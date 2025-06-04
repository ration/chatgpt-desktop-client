import { app, BrowserWindow, shell, globalShortcut } from 'electron';
import path from 'path';
import { config } from './config/index.js';
import { fileURLToPath } from 'url';
import electronContextMenu from 'electron-context-menu';

// Set up the context menu
electronContextMenu({
    showSaveImageAs: true,
});

const appUrl = 'https://chatgpt.com';

let window = null;

function onNewWindow(details) {
    // Open URL directly in the default system browser for Google Sign-In popups
    if (details.url.includes('accounts.google.com')) {
        shell.openExternal(details.url); // Open Google Sign-In popup in the system browser
        return { action: 'deny' };
    }

    return { action: 'allow' }; // Allow other popups
}

// Calculate __dirname for ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Function to create the main application window
const createWindow = () => {
    window = new BrowserWindow({
        icon: path.join(__dirname, '../assets/icon.png'),
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            nativeWindowOpen: true, // Enables proper popup handling
            preload: path.join(__dirname, 'preload.js'),
            webSecurity: true,
        },
    });

    // Load Notion login page
    window.loadURL(appUrl, {
        userAgent: config.userAgent,
    });

    window.webContents.setWindowOpenHandler((details) => {
        return {
            action: 'allow', // Allow popups by default
        };
    });

    window.once('ready-to-show', () => {
        window.maximize();
    });

};


// Single instance lock
const appLock = app.requestSingleInstanceLock();

if (!appLock) {
    app.quit();
} else {
    app.on('second-instance', (event, args) => {
        if (window) {
            const url = processArgs(args);
            if (url) {
                window.loadURL(url, { userAgent: config.userAgent });
            }
            window.focus();
        }
    });

app.on('ready', () => {
    createWindow();
    
    // Register global shortcuts after window is created
    console.log('Registering global keyboard shortcuts');
    
    // Shortcut for focusing the prompt
    globalShortcut.register('CommandOrControl+L', () => {
        console.log('Ctrl+L shortcut triggered');
        if (window) {
            // A more aggressive approach to find the input field
            window.webContents.executeJavaScript(`
                (function() {
                    console.log('Executing Ctrl+L script');
                    // Try to find the textarea by various methods
                    const textareas = document.querySelectorAll('textarea');
                    console.log('Found ' + textareas.length + ' textareas');
                    
                    if (textareas.length > 0) {
                        // Focus the last textarea (usually the input)
                        textareas[textareas.length - 1].focus();
                        return 'Focused textarea';
                    }
                    
                    // If no textarea, try contenteditable
                    const editables = document.querySelectorAll('[contenteditable="true"]');
                    if (editables.length > 0) {
                        editables[editables.length - 1].focus();
                        return 'Focused contenteditable';
                    }
                    
                    return 'No input element found';
                })();
            `).then(result => {
                console.log('Ctrl+L result:', result);
            }).catch(err => {
                console.error('Ctrl+L error:', err);
            });
        }
    });
    
    // Shortcut for creating a new chat
    globalShortcut.register('CommandOrControl+N', () => {
        console.log('Ctrl+N shortcut triggered');
        if (window) {
            // A more aggressive approach to find the new chat button
            window.webContents.executeJavaScript(`
                (function() {
                    console.log('Executing Ctrl+N script');
                    
                    // Try to find elements with "new" and "chat" in their text or attributes
                    const allElements = Array.from(document.querySelectorAll('a, button'));
                    console.log('Found ' + allElements.length + ' buttons/links');
                    
                    // First, look for elements with exact "New chat" text
                    for (const el of allElements) {
                        if (el.innerText?.trim() === 'New chat' || 
                            el.textContent?.trim() === 'New chat' ||
                            el.getAttribute('aria-label') === 'New chat') {
                            el.click();
                            return 'Clicked element with "New chat" text';
                        }
                    }
                    
                    // Next, look for elements containing both "new" and "chat"
                    for (const el of allElements) {
                        const text = (el.innerText || el.textContent || '').toLowerCase();
                        if (text.includes('new') && text.includes('chat')) {
                            el.click();
                            return 'Clicked element containing "new" and "chat"';
                        }
                    }
                    
                    // Finally, try clicking the first item in the sidebar
                    const sidebarItems = document.querySelectorAll('nav a, nav button');
                    if (sidebarItems.length > 0) {
                        sidebarItems[0].click();
                        return 'Clicked first sidebar item';
                    }
                    
                    return 'No new chat button found';
                })();
            `).then(result => {
                console.log('Ctrl+N result:', result);
            }).catch(err => {
                console.error('Ctrl+N error:', err);
            });
        }
    });
});

    app.on('window-all-closed', () => {
        // Unregister all shortcuts when closing the application
        globalShortcut.unregisterAll();
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
}

// Process arguments for the second instance
function processArgs(args) {
    const regHttps = /^https:\/\/www\.notion\.so\/.*/g;
    const regNotion = /^notion:\/\//g;
    for (const arg of args) {
        if (regHttps.test(arg)) {
            return arg;
        }
        if (regNotion.test(arg)) {
            return appUrl + arg.substring(11);
        }
    }
    return null;
}
