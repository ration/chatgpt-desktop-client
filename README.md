# Chatgpt Desktop

Chatgpt Desktop is a cross-platform desktop application that allows you to use Notion directly on your computer, making it easier to chat with friends and family while working.

![Image](https://github.com/xanmoy/chatgpt-desktop-client/blob/main/screenshots/chatgpt-desktop-client.jpeg)

## 🛠 **Features**

- **Full Notion Functionality**: Access all Notion features in a dedicated desktop app.
- **Single Instance**: Ensures only one instance of the app runs at a time.
- **Custom User-Agent**: Enhanced compatibility with ChatGPT Web.
- **Window Management**: Automatically maximizes on startup for better visibility.
- **Google Sign-In Support**: Login via Google is supported with external browser fallback for security.
- **Popup Handling**: Popups are allowed to ensure smooth navigation and interactions.

---

![Image](https://github.com/xanmoy/chatgpt-desktop-client/blob/main/screenshots/image1.png)

## 📦 **Installation**

```bash
sudo snap install chatgpt-desktop-client
```

### Build From Source

1. **Clone the repository**:

```bash
git clone https://github.com/xanmoy/chatgpt-desktop-client.git
cd chatgpt-desktop-client
```

2. **Install dependencies**: Ensure that you have all the necessary dependencies installed.

```bash
   npm instal
```

3. Start the application:

```bash
npm start
```

4. **Build the application**: Run the following command to create a Snap package of the application.

```bash
npm run dist
```

5. **Change to the dist directory**: Navigate to the dist directory where the Snap package is located.

```bash
cd dist
```

6. **Install the Snap package**: Use the following command to install the Snap package. The `--dangerous` flag allows the installation of locally built packages.

```bash
sudo snap install --dangerous ./chatgpt-desktop-client_1.0.3_amd64.snap 
```

## ↩️ **Uninstallation Steps**

Remove the Snap package: To uninstall the Chatgpt Desktop application, run the following command:

```bash
sudo snap remove chatgpt-desktop-client
```

## 📖 **Usage Instructions**

### **Launching the App**:

   After installation, open Chatgpt Desktop using:

```bash
   chatgpt-desktop-client
```

## 🤝 **Contributing**

Contributions are welcome! If you'd like to contribute to this project, please fork the repository and submit a pull request.

## 📜 **License**

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

## Acknowledgments

- **Electron** - Framework used to build the application.

