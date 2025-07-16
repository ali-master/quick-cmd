# 🛠️ Development Setup Guide

## Table of Contents
- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Building the Project](#building-the-project)
- [Development Workflow](#development-workflow)
- [Architecture Overview](#architecture-overview)
- [Contributing Guidelines](#contributing-guidelines)

## Prerequisites

### System Requirements
- **macOS 11.0+** (Big Sur or later)
- **Xcode Command Line Tools**
- **Rust 1.70+**
- **Bun** (latest version)
- **Git**

### Installing Prerequisites

#### 1. Xcode Command Line Tools
```bash
xcode-select --install
```

#### 2. Rust
```bash
# Install via rustup (recommended)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Reload your shell
source ~/.cargo/env

# Verify installation
rustc --version
cargo --version
```

#### 3. Bun
```bash
# Install bun
curl -fsSL https://bun.sh/install | bash

# Verify installation
bun --version
```

#### 4. Additional Tools (Optional but Recommended)
```bash
# Install useful development tools
cargo install cargo-watch    # Auto-rebuild on file changes
cargo install cargo-audit    # Security audit
cargo install cargo-outdated # Check for outdated dependencies
```

## Environment Setup

### 1. Clone the Repository
```bash
git clone https://github.com/ali-master/quick-cmd.git
cd quick-cmd
```

### 2. Install Dependencies
```bash
# Install frontend dependencies
bun install

# Install Rust dependencies (handled automatically by Cargo)
cd src-tauri
cargo fetch
cd ..
```

### 3. Verify Setup
```bash
# Check that all tools are working
bun run test:types
bun run lint
cd src-tauri && cargo check
```

## Building the Project

### Development Build
```bash
# Start development server with hot reload
bun run app:dev
```

This command:
- Starts the Vite dev server for the frontend
- Builds and runs the Tauri backend
- Enables hot reload for both frontend and backend changes

### Production Build
```bash
# Build for production
bun run app:build
```

This creates:
- Optimized frontend bundle
- Release build of Rust backend
- macOS app bundle in `src-tauri/target/release/bundle/macos/`

### Debug Build
```bash
# Build debug version (faster compilation, larger binary)
cd src-tauri
cargo tauri build --debug
```

### Build Outputs
After building, you'll find:
```
src-tauri/target/release/bundle/macos/
├── QuickCMD.app/           # macOS Application Bundle
└── QuickCMD.dmg            # Installer DMG (if configured)
```

## Development Workflow

### Project Structure
```
quick-cmd/
├── src/                    # React Frontend
│   ├── components/         # React components
│   │   ├── ui/            # shadcn/ui components
│   │   └── command-launcher.tsx
│   ├── libs/              # Utility functions
│   ├── assets/            # Static assets
│   └── main.tsx           # Entry point
├── src-tauri/             # Rust Backend
│   ├── src/
│   │   ├── lib.rs         # Main Tauri application
│   │   └── main.rs        # Entry point
│   ├── Cargo.toml         # Rust dependencies
│   └── tauri.conf.json    # Tauri configuration
├── assets/                # Project assets (logos, etc.)
├── docs/                  # Documentation
└── package.json           # Node.js dependencies
```

### Development Commands

#### Frontend Development
```bash
# Start frontend dev server only
bun run dev

# Type checking
bun run test:types

# Linting
bun run lint
bun run lint:fix

# Code formatting
bun run format
bun run format:check
```

#### Backend Development
```bash
cd src-tauri

# Check Rust code
cargo check

# Run tests
cargo test

# Format code
cargo fmt

# Lint with Clippy
cargo clippy

# Watch for changes and rebuild
cargo watch -x check
```

#### Full Application
```bash
# Development with hot reload
bun run app:dev

# Production build
bun run app:build

# Preview production build
bun run preview
```

### Code Style & Standards

#### TypeScript/React
- **ESLint**: Uses `@antfu/eslint-config` with custom rules
- **Prettier**: Automatic code formatting
- **TypeScript**: Strict mode enabled
- **React**: Hooks and functional components preferred

#### Rust
- **Rustfmt**: Standard Rust formatting
- **Clippy**: Linting with strict rules
- **Documentation**: All public APIs must be documented

### Testing

#### Frontend Testing
```bash
# Type checking
bun run test:types

# Component testing (future)
bun run test
```

#### Backend Testing
```bash
cd src-tauri

# Unit tests
cargo test

# Integration tests
cargo test --test integration

# Test with coverage
cargo tarpaulin --out html
```

### Debugging

#### Frontend Debugging
- Use browser dev tools in the Tauri webview
- React DevTools extension works normally
- Console logs appear in the webview

#### Backend Debugging
```bash
# Enable debug logging
RUST_LOG=debug bun run app:dev

# Use rust-gdb for deep debugging
rust-gdb target/debug/quick-cmd
```

#### Tauri-Specific Debugging
```bash
# Enable Tauri debug features
export TAURI_DEBUG=1
bun run app:dev
```

## Architecture Overview

### Frontend Architecture
- **React 19**: Modern hooks-based components
- **TypeScript**: Strict type checking
- **Tailwind CSS v4**: Utility-first styling
- **shadcn/ui**: Accessible component library
- **Framer Motion**: Smooth animations
- **Lucide React**: Consistent iconography

### Backend Architecture
- **Tauri 2.0**: Desktop app framework
- **Rust**: Systems programming language
- **System Integration**: menubar, global shortcuts, shell commands
- **Security**: Sandboxed command execution

### Communication
- **Tauri Commands**: RPC between frontend and backend
- **Events**: Real-time communication
- **State Management**: Shared between frontend/backend

### Key Files

#### Frontend
- `src/main.tsx`: Application entry point
- `src/App.tsx`: Root component
- `src/components/command-launcher.tsx`: Main launcher UI
- `src/components/ui/`: shadcn/ui components

#### Backend
- `src-tauri/src/main.rs`: Application entry point
- `src-tauri/src/lib.rs`: Main Tauri logic and commands
- `src-tauri/tauri.conf.json`: Tauri configuration
- `src-tauri/Cargo.toml`: Rust dependencies

## Contributing Guidelines

### Before Contributing
1. Read the [User Guide](./user-guide.md)
2. Check existing [issues](https://github.com/ali-master/quick-cmd/issues)
3. Look at the [project roadmap](../README.md#-roadmap)

### Development Process
1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Make** your changes
4. **Test** thoroughly (both frontend and backend)
5. **Follow** code style guidelines
6. **Write** tests for new features
7. **Update** documentation if needed
8. **Submit** a pull request

### Code Quality Standards
- All TypeScript code must pass `bun run test:types`
- All code must pass linting: `bun run lint`
- Rust code must pass `cargo clippy`
- Format code before submitting: `bun run format`
- Write meaningful commit messages
- Add tests for new features

### Pull Request Guidelines
1. **Clear title** describing the change
2. **Detailed description** explaining the motivation
3. **Screenshots** for UI changes
4. **Testing instructions** for reviewers
5. **Link related issues** using keywords (fixes #123)

### Commit Message Format
```
type(scope): description

[optional body]

[optional footer]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
Scopes: `frontend`, `backend`, `ui`, `menubar`, `commands`

Examples:
```
feat(menubar): add global shortcut configuration
fix(commands): resolve shell command execution on paths with spaces
docs(api): update command interface documentation
```

### Getting Help
- **GitHub Discussions**: For questions and ideas
- **GitHub Issues**: For bugs and feature requests
- **Code Review**: Feel free to request reviews on draft PRs

### Development Tips
1. **Use `cargo watch`** for automatic Rust rebuilds
2. **Enable Tauri debug mode** for detailed logging
3. **Test on different macOS versions** when possible
4. **Profile performance** for command execution speed
5. **Keep security in mind** when adding new features
