<div align="center">
  <img src="./assets/logo-liquid-glass.svg" alt="QuickCMD Logo" width="120" height="120">

  <h1>QuickCMD</h1>

  <p>
    <strong>⚡ Lightning-fast command launcher for macOS</strong>
  </p>
  <p>
    <em>Execute scripts, open files, and manage workflows with beautiful menubar integration</em>
  </p>

  <p>
    <img src="https://img.shields.io/badge/macOS-11.0+-blue?style=for-the-badge&logo=apple" alt="macOS Support">
    <img src="https://img.shields.io/badge/React-19+-61DAFB?style=for-the-badge&logo=react" alt="React">
    <img src="https://img.shields.io/badge/Tauri-2.0-FFC131?style=for-the-badge&logo=tauri" alt="Tauri">
    <img src="https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript">
  </p>

  <p>
    <a href="#-features"><img src="https://img.shields.io/badge/Features-✨-blue?style=for-the-badge" alt="Features"></a>
    <a href="#-installation"><img src="https://img.shields.io/badge/Install-🚀-green?style=for-the-badge" alt="Installation"></a>
    <a href="#-usage"><img src="https://img.shields.io/badge/Usage-📖-purple?style=for-the-badge" alt="Usage"></a>
    <a href="#-development"><img src="https://img.shields.io/badge/Develop-🛠️-orange?style=for-the-badge" alt="Development"></a>
  </p>
</div>

---

## 🌟 What is QuickCMD?

**QuickCMD** is a modern, lightning-fast command launcher designed specifically for macOS. It lives in your menubar and provides instant access to your most-used commands, scripts, and files. Think of it as a beautiful, powerful alternative to Spotlight for developers and power users.

### 🎯 Why QuickCMD?

- **⚡ Instant Access**: Global shortcuts and menubar integration
- **🎨 Beautiful UI**: Modern glass-morphism design with smooth animations
- **🔍 Smart Search**: Fuzzy search with command history and favorites
- **⌨️ Keyboard-First**: Navigate entirely with keyboard shortcuts
- **🛡️ Secure**: Sandboxed execution with fine-grained permissions
- **🔧 Extensible**: Easy to add custom commands and workflows

---

## ✨ Features

### 🚀 **Core Functionality**
- **Global Shortcuts**: `⌘ + Space` to open from anywhere
- **Menubar Integration**: Click the tray icon to toggle the launcher
- **Smart Search**: Real-time filtering with fuzzy matching
- **Command History**: Recently used commands for quick access
- **Favorites System**: Star your most-used commands

### 🎛️ **Command Types**
- **Shell Commands**: Execute any terminal command
- **File Operations**: Open files and directories
- **Application Launchers**: Quick access to your apps
- **Custom Scripts**: Run your own automation scripts

### 🎨 **User Experience**
- **Glass Morphism UI**: Modern, translucent design
- **Smooth Animations**: Powered by Framer Motion
- **Keyboard Navigation**: Arrow keys + Enter to execute
- **Auto-positioning**: Window appears below menubar icon
- **Auto-hide**: Hides when losing focus

### 🔒 **Security & Performance**
- **Sandboxed Execution**: Secure command execution
- **Native Performance**: Built with Tauri for speed
- **Low Memory Footprint**: Efficient resource usage
- **Background Operation**: Runs quietly in the background

---

## 📋 Table of Contents

- [🌟 What is QuickCMD?](#-what-is-quickcmd)
- [✨ Features](#-features)
- [🚀 Installation](#-installation)
- [📖 Usage](#-usage)
- [⌨️ Keyboard Shortcuts](#️-keyboard-shortcuts)
- [🎛️ Configuration](#️-configuration)
- [🛠️ Development](#️-development)
- [📚 Documentation](#-documentation)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## 🚀 Installation

### 📦 **Pre-built Releases** *(Coming Soon)*

Download the latest release from the [Releases page](https://github.com/ali-master/quick-cmd/releases).

### 🔨 **Build from Source**

#### Prerequisites

Ensure you have the following installed:

- **macOS 11.0+**
- **Rust 1.70+** ([Install via rustup](https://rustup.rs/))
- **Bun** ([Install here](https://bun.sh/))
- **Xcode Command Line Tools**: `xcode-select --install`

#### Build Steps

```bash
# Clone the repository
git clone https://github.com/ali-master/quick-cmd.git
cd quick-cmd

# Install dependencies
bun install

# Development mode (with hot reload)
bun run app:dev

# Production build
bun run app:build
```

The built application will be in `src-tauri/target/release/bundle/macos/`.

---

## 📖 Usage

### 🎬 **Getting Started**

1. **Launch QuickCMD**: Open the built application
2. **Look for the menubar icon**: Find the QuickCMD icon in your macOS menubar
3. **Open the launcher**: Click the icon or press `⌘ + Space`
4. **Start typing**: Search for commands, files, or applications
5. **Execute**: Press `Enter` or click to run the selected item

### 🔍 **Search & Execute**

```
🔍 Type to search...
┌─────────────────────────────────┐
│ > terminal                      │
├─────────────────────────────────┤
│ ⭐ Open Terminal                │
│ 📁 Open VS Code                 │
│ 🔧 Git Status                   │
│ 📂 Open Finder                  │
└─────────────────────────────────┘
```

### ⭐ **Managing Favorites**

- **Add to Favorites**: Click the star icon next to any command
- **Quick Access**: Favorites appear at the top of search results
- **Remove**: Click the star again to unfavorite

### 📊 **Command History**

QuickCMD automatically tracks your command usage:
- **Recent Commands**: Shows your last 5 executed commands
- **Frequency Ranking**: Most-used commands appear higher in results
- **Smart Suggestions**: Learns your patterns over time

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `⌘ + Space` | Toggle QuickCMD window |
| `↑` / `↓` | Navigate command list |
| `Enter` | Execute selected command |
| `Escape` | Hide QuickCMD window |
| `⌘ + ,` | Open preferences *(coming soon)* |
| `⌘ + Q` | Quit QuickCMD |

---

## 🎛️ Configuration

### 📁 **Default Commands**

QuickCMD comes with these built-in commands:

- **Open Terminal** - `open -a Terminal`
- **Open VS Code** - `code .`
- **Git Status** - `git status`
- **Open Finder** - `open .`

### ➕ **Adding Custom Commands**

*(Feature coming soon - will support JSON configuration file)*

```json
{
  "commands": [
    {
      "name": "Deploy to Production",
      "command": "npm run deploy:prod",
      "type": "script",
      "icon": "🚀",
      "favorite": true
    }
  ]
}
```

### ⚙️ **Settings**

- **Global Shortcut**: Customize the global hotkey
- **Window Position**: Choose where the window appears
- **Theme**: Light/Dark/Auto modes
- **Startup**: Launch on system startup

---

## 🛠️ Development

### 🏗️ **Tech Stack**

- **Frontend**: React 19 + TypeScript + Vite
- **Backend**: Rust + Tauri 2.0
- **UI**: Tailwind CSS v4 + shadcn/ui
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Build**: Bun

### 📁 **Project Structure**

```
quick-cmd/
├── src/                    # React frontend
│   ├── components/         # UI components
│   │   ├── ui/            # shadcn/ui components
│   │   └── command-launcher.tsx
│   ├── libs/              # Utilities
│   └── assets/            # Static assets
├── src-tauri/             # Rust backend
│   ├── src/
│   │   ├── lib.rs         # Main Tauri logic
│   │   └── main.rs        # Entry point
│   ├── Cargo.toml         # Rust dependencies
│   └── tauri.conf.json    # Tauri configuration
├── assets/                # Logos and graphics
├── docs/                  # Documentation
└── package.json           # Node.js dependencies
```

### 🔧 **Development Commands**

```bash
# Start development server
bun run app:dev

# Type checking
bun run test:types

# Linting
bun run lint

# Format code
bun run format

# Build for production
bun run app:build
```

### 🧪 **Testing**

```bash
# Run Rust tests
cd src-tauri && cargo test

# Type checking
bun run test:types
```

---

## 📚 Documentation

Detailed documentation is available in the [`docs/`](./docs/) folder:

- [📖 **User Guide**](./docs/user-guide.md) - Complete usage instructions
- [🛠️ **Development Setup**](./docs/development.md) - Detailed dev environment setup
- [🏗️ **Architecture**](./docs/architecture.md) - Technical architecture overview
- [🔌 **API Reference**](./docs/api.md) - Frontend-backend API documentation
- [🎨 **Design System**](./docs/design-system.md) - UI components and styling
- [🔒 **Security**](./docs/security.md) - Security features and sandboxing

---

## 🚀 Roadmap

### 🎯 **Near Term** (v0.1.0)
- [x] Menubar integration
- [x] Command execution
- [x] Search functionality
- [x] Favorites system
- [ ] Settings panel
- [ ] Custom command configuration

### 🌟 **Medium Term** (v0.2.0)
- [ ] Plugin system
- [ ] Workflow automation
- [ ] Advanced search filters
- [ ] Command aliases
- [ ] Export/import settings

### 🚀 **Long Term** (v1.0.0)
- [ ] Multi-platform support
- [ ] Team sharing features
- [ ] Advanced integrations
- [ ] Performance analytics

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### 🐛 **Bug Reports**
Found a bug? [Open an issue](https://github.com/ali-master/quick-cmd/issues) with:
- Steps to reproduce
- Expected vs actual behavior
- macOS version and QuickCMD version

### 💡 **Feature Requests**
Have an idea? [Start a discussion](https://github.com/ali-master/quick-cmd/discussions) to:
- Describe the feature
- Explain the use case
- Discuss implementation approaches

### 🔧 **Pull Requests**
Ready to contribute code?
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test thoroughly
4. Follow our coding standards (ESLint + Prettier)
5. Submit a pull request with a clear description

### 📋 **Development Guidelines**

- **Code Style**: We use ESLint + Prettier with strict TypeScript
- **Commits**: Use conventional commit messages
- **Testing**: Add tests for new features
- **Documentation**: Update docs for user-facing changes

---

## 📊 Stats

![GitHub stars](https://img.shields.io/github/stars/ali-master/quick-cmd?style=social)
![GitHub forks](https://img.shields.io/github/forks/ali-master/quick-cmd?style=social)
![GitHub issues](https://img.shields.io/github/issues/ali-master/quick-cmd)
![GitHub license](https://img.shields.io/github/license/ali-master/quick-cmd)

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **[Tauri](https://tauri.app/)** - The framework that makes this possible
- **[shadcn/ui](https://ui.shadcn.com/)** - Beautiful, accessible UI components
- **[Lucide](https://lucide.dev/)** - Clean, consistent icons
- **[Framer Motion](https://www.framer.com/motion/)** - Smooth animations

---

<div align="center">
  <p>
    <strong>Made with ❤️ by <a href="https://github.com/ali-master">Ali Torki</a></strong>
  </p>
  <p>
    <a href="https://github.com/ali-master/quick-cmd/issues">🐛 Report Bug</a>
    ·
    <a href="https://github.com/ali-master/quick-cmd/issues">💡 Request Feature</a>
    ·
    <a href="https://github.com/ali-master/quick-cmd/discussions">💬 Discussions</a>
  </p>
  
  <br>
  
  <p>
    <strong>⭐ Star this repo if you find it useful!</strong>
  </p>
</div>
