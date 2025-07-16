# 📖 QuickCMD User Guide

## Table of Contents
- [Getting Started](#getting-started)
- [Basic Usage](#basic-usage)
- [Advanced Features](#advanced-features)
- [Customization](#customization)
- [Troubleshooting](#troubleshooting)

## Getting Started

### Installation
1. Download QuickCMD from the releases page or build from source
2. Launch the application
3. Grant necessary permissions when prompted (accessibility, automation)
4. The QuickCMD icon will appear in your macOS menubar

### First Launch
When you first launch QuickCMD:
1. Look for the QuickCMD icon in your menubar (top-right area)
2. Click the icon or press `⌘ + Space` to open the launcher
3. Start typing to search for commands

## Basic Usage

### Opening QuickCMD
- **Click menubar icon**: Left-click the QuickCMD icon
- **Global shortcut**: Press `⌘ + Space` from anywhere
- **Right-click menu**: Right-click the icon for context menu

### Searching Commands
1. Open QuickCMD using any method above
2. Start typing your search query
3. Results update in real-time as you type
4. Use arrow keys to navigate results
5. Press `Enter` to execute selected command

### Command Types
QuickCMD supports several types of commands:

#### Shell Commands
- Execute terminal commands directly
- Examples: `git status`, `npm install`, `ls -la`

#### File Operations
- Open files and directories
- Examples: `open .`, `open ~/Documents`

#### Application Launchers
- Quick access to applications
- Examples: `open -a Terminal`, `open -a "VS Code"`

## Advanced Features

### Favorites System
- **Add to favorites**: Click the star icon next to any command
- **Quick access**: Favorites appear at the top when no search query
- **Remove from favorites**: Click the star icon again

### Command History
- **Recent commands**: QuickCMD tracks your last 5 executed commands
- **Smart ranking**: Frequently used commands appear higher in results
- **Automatic learning**: The system learns your usage patterns

### Keyboard Navigation
| Key | Action |
|-----|--------|
| `↑` / `↓` | Navigate command list |
| `Enter` | Execute selected command |
| `Escape` | Close QuickCMD window |
| `⌘ + ,` | Open preferences (coming soon) |

## Customization

### Default Commands
QuickCMD comes with these built-in commands:
- **Open Terminal** - `open -a Terminal`
- **Open VS Code** - `code .`
- **Git Status** - `git status`
- **Open Finder** - `open .`

### Adding Custom Commands
*(Feature coming in future release)*

You'll be able to add custom commands via a JSON configuration file:

```json
{
  "commands": [
    {
      "name": "Deploy to Production",
      "command": "npm run deploy:prod",
      "type": "script",
      "description": "Deploy the app to production",
      "icon": "🚀",
      "favorite": true
    },
    {
      "name": "Open Project in IDE",
      "command": "code ~/Projects/my-app",
      "type": "command",
      "description": "Open my main project",
      "favorite": true
    }
  ]
}
```

### Settings
*(Coming in future release)*

Planned settings include:
- Custom global shortcut
- Window position preferences
- Theme selection (light/dark/auto)
- Startup behavior
- Command timeout settings

## Troubleshooting

### Common Issues

#### QuickCMD icon not visible in menubar
- **Cause**: Menubar might be crowded
- **Solution**: Look for overflow indicators (>>) on the right side of menubar
- **Alternative**: Use global shortcut `⌘ + Space`

#### Global shortcut not working
- **Cause**: Another app might be using the same shortcut
- **Solution**: Quit other apps temporarily to test
- **Future**: Custom shortcut configuration will be available

#### Commands not executing
- **Cause**: Insufficient permissions or command doesn't exist
- **Solution**: Check that the command works in Terminal first
- **Check**: Ensure QuickCMD has necessary permissions in System Preferences

#### Window appears in wrong position
- **Cause**: Display configuration changes
- **Solution**: Restart QuickCMD to reset positioning
- **Future**: Position preferences will be configurable

### Performance Issues

#### Slow search results
- **Cause**: Large number of commands
- **Solution**: Use favorites for frequently accessed commands
- **Tip**: Clear command history if needed (future feature)

#### High memory usage
- **Cause**: Rare issue with command history
- **Solution**: Restart QuickCMD
- **Contact**: Report if issue persists

### Getting Help

If you encounter issues not covered here:

1. **Check GitHub Issues**: Search existing issues at [github.com/ali-master/quick-cmd/issues](https://github.com/ali-master/quick-cmd/issues)
2. **Create New Issue**: If your issue isn't found, create a new issue with:
   - macOS version
   - QuickCMD version
   - Steps to reproduce
   - Expected vs actual behavior
3. **Discussions**: For questions and feature requests, use [GitHub Discussions](https://github.com/ali-master/quick-cmd/discussions)

### System Requirements

- **macOS**: 11.0 (Big Sur) or later
- **Memory**: 50MB RAM (typical usage)
- **Storage**: 20MB disk space
- **Permissions**: Accessibility (for global shortcuts)

### Privacy & Security

QuickCMD is designed with privacy in mind:
- **No data collection**: All data stays on your local machine
- **Sandboxed execution**: Commands run with appropriate security restrictions
- **No network access**: QuickCMD doesn't send data anywhere
- **Open source**: Code is available for inspection

For more technical details, see our [Security Documentation](./security.md).