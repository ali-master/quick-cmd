# 🏗️ QuickCMD Architecture

## Table of Contents
- [Overview](#overview)
- [System Architecture](#system-architecture)
- [Frontend Architecture](#frontend-architecture)
- [Backend Architecture](#backend-architecture)
- [Communication Layer](#communication-layer)
- [Security Model](#security-model)
- [Performance Considerations](#performance-considerations)

## Overview

QuickCMD is built as a modern desktop application using the Tauri framework, combining a React-based frontend with a Rust backend for optimal performance and security.

### Technology Stack
- **Frontend**: React 19 + TypeScript + Vite
- **Backend**: Rust + Tauri 2.0
- **UI Framework**: Tailwind CSS v4 + shadcn/ui
- **Build System**: Bun + Cargo
- **Platform**: macOS (with future cross-platform support)

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    QuickCMD Application                     │
├─────────────────────────────────────────────────────────────┤
│  Frontend (React/TypeScript)                               │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │ Command Launcher │  │   UI Components │  │    Assets    │ │
│  │   - Search       │  │  - shadcn/ui    │  │   - Icons    │ │
│  │   - Execution    │  │  - Animations   │  │   - Styles   │ │
│  │   - State Mgmt   │  │  - Layout       │  │   - Images   │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
├─────────────────────────────────────────────────────────────┤
│  Communication Layer (Tauri Bridge)                        │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │    Commands     │  │     Events      │  │     State    │ │
│  │   - RPC calls   │  │  - Window mgmt  │  │  - Shared    │ │
│  │   - Async ops   │  │  - System evts  │  │  - Reactive  │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
├─────────────────────────────────────────────────────────────┤
│  Backend (Rust/Tauri)                                      │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │  System Tray    │  │ Command Engine  │  │   Security   │ │
│  │  - Menu bar     │  │ - Shell exec    │  │ - Sandboxing │ │
│  │  - Global keys  │  │ - File ops      │  │ - Validation │ │
│  │  - Positioning  │  │ - App launch    │  │ - Perms      │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
├─────────────────────────────────────────────────────────────┤
│  macOS System Integration                                  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │   Menu Bar      │  │    Shell        │  │  File System │ │
│  │ - Tray icon     │  │ - Command exec  │  │ - File access│ │
│  │ - Context menu  │  │ - Process mgmt  │  │ - Permissions│ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Frontend Architecture

### Component Hierarchy
```
App
├── CommandLauncher (Main component)
│   ├── SearchInput
│   ├── CommandList
│   │   ├── FavoriteCommands
│   │   ├── RecentCommands
│   │   └── SearchResults
│   ├── CommandItem
│   └── ToastNotifications
└── UI Components (shadcn/ui)
    ├── Button
    ├── Input
    ├── Card
    ├── Badge
    └── ScrollArea
```

### State Management
QuickCMD uses React's built-in state management with hooks:

```typescript
interface AppState {
  // Search state
  searchQuery: string;
  selectedIndex: number;
  filteredCommands: CommandItem[];
  
  // Command state
  commands: CommandItem[];
  recentCommands: CommandItem[];
  favoriteCommands: CommandItem[];
  
  // UI state
  isLoading: boolean;
  toastMessage: Toast | null;
}
```

### Data Flow
1. **User Input** → React state updates
2. **State Changes** → Component re-renders
3. **Command Execution** → Tauri command invocation
4. **Backend Response** → State updates + UI feedback

### Key Components

#### CommandLauncher
- Central component managing all launcher functionality
- Handles keyboard navigation and search
- Manages command execution flow

#### SearchInput
- Real-time search with debouncing
- Keyboard event handling
- Focus management

#### CommandList
- Virtualized rendering for performance
- Dynamic filtering and sorting
- Keyboard navigation support

## Backend Architecture

### Core Modules

#### System Tray Module
```rust
// Handles menubar integration
pub struct TrayManager {
    icon: TrayIcon,
    menu: Menu,
    position_calculator: PositionCalculator,
}

impl TrayManager {
    fn create_tray() -> Result<TrayIcon>;
    fn handle_click_event(&self, event: TrayIconEvent);
    fn show_context_menu(&self);
    fn calculate_window_position(&self) -> Position;
}
```

#### Command Engine
```rust
// Executes commands with security
pub struct CommandEngine {
    sandbox: SecuritySandbox,
    shell: ShellExecutor,
    validator: CommandValidator,
}

impl CommandEngine {
    fn execute_command(&self, cmd: &CommandItem) -> Result<Output>;
    fn validate_command(&self, cmd: &str) -> ValidationResult;
    fn apply_sandbox_rules(&self, cmd: &CommandItem);
}
```

#### Window Manager
```rust
// Manages window positioning and behavior
pub struct WindowManager {
    window: WebviewWindow,
    positioner: WindowPositioner,
}

impl WindowManager {
    fn toggle_visibility(&mut self);
    fn position_near_tray(&mut self);
    fn handle_focus_loss(&mut self);
}
```

### Command Execution Flow
1. **Command Received** from frontend
2. **Validation** checks safety and format
3. **Sandbox Setup** applies security restrictions
4. **Execution** runs command in controlled environment
5. **Result Processing** captures output/errors
6. **Response** sent back to frontend

## Communication Layer

### Tauri Commands
Rust functions exposed to the frontend:

```rust
#[tauri::command]
async fn execute_command(command: String) -> Result<String, String>;

#[tauri::command]
async fn toggle_window(app: AppHandle) -> Result<(), String>;

#[tauri::command]
async fn add_to_favorites(command_id: String) -> Result<(), String>;

#[tauri::command]
async fn get_recent_commands() -> Result<Vec<CommandItem>, String>;
```

### Event System
Real-time communication via Tauri events:

```typescript
// Frontend listening to backend events
import { listen } from '@tauri-apps/api/event';

await listen('command-executed', (event) => {
  updateCommandHistory(event.payload);
});

await listen('window-focus-changed', (event) => {
  handleFocusChange(event.payload.focused);
});
```

### Data Serialization
All data is serialized using serde for type safety:

```rust
#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct CommandItem {
    pub id: String,
    pub name: String,
    pub command: String,
    pub command_type: CommandType,
    pub is_favorite: bool,
    pub last_used: Option<DateTime<Utc>>,
    pub description: Option<String>,
}
```

## Security Model

### Command Validation
- **Input Sanitization**: Prevent injection attacks
- **Command Whitelist**: Only allow safe command patterns
- **Path Validation**: Restrict file system access

### Sandbox Execution
```rust
pub struct SecuritySandbox {
    allowed_paths: Vec<PathBuf>,
    blocked_commands: HashSet<String>,
    timeout: Duration,
}

impl SecuritySandbox {
    fn apply_restrictions(&self, cmd: &mut Command);
    fn validate_path_access(&self, path: &Path) -> bool;
    fn enforce_timeout(&self, process: &mut Child);
}
```

### Process Isolation
- Commands run in separate processes
- Limited file system access
- Network restrictions when applicable
- Resource limits (CPU, memory, time)

## Performance Considerations

### Frontend Optimization
- **Virtual Scrolling**: Handle large command lists efficiently
- **Debounced Search**: Reduce unnecessary re-renders
- **Lazy Loading**: Load components as needed
- **Memoization**: Cache expensive computations

### Backend Optimization
- **Async Execution**: Non-blocking command execution
- **Connection Pooling**: Reuse system resources
- **Caching**: Cache frequently used commands
- **Memory Management**: Efficient Rust memory handling

### Startup Performance
```rust
// Lazy initialization of heavy components
static COMMAND_ENGINE: LazyLock<CommandEngine> = LazyLock::new(|| {
    CommandEngine::new()
});

// Preload common commands
fn preload_commands() {
    spawn(async {
        load_command_history().await;
        validate_system_commands().await;
    });
}
```

### Memory Usage
- **Command History**: Limited to last 100 commands
- **Search Cache**: LRU cache for search results
- **Icon Caching**: Cache frequently used icons
- **Cleanup**: Regular cleanup of temporary data

## Data Persistence

### Command Storage
Commands and preferences stored in:
```
~/Library/Application Support/QuickCMD/
├── commands.json           # User commands
├── favorites.json          # Favorite commands
├── history.json           # Command history
└── settings.json          # App settings
```

### Configuration Format
```json
{
  "commands": [
    {
      "id": "uuid-v4",
      "name": "Open Terminal",
      "command": "open -a Terminal",
      "type": "application",
      "favorite": true,
      "created": "2024-01-01T00:00:00Z"
    }
  ],
  "settings": {
    "globalShortcut": "CommandOrControl+Space",
    "windowPosition": "tray-center",
    "theme": "auto"
  }
}
```

## Error Handling

### Frontend Error Boundaries
```typescript
class CommandErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error and show user-friendly message
    logError(error, errorInfo);
    showErrorToast("Something went wrong. Please try again.");
  }
}
```

### Backend Error Handling
```rust
#[derive(Debug, thiserror::Error)]
pub enum QuickCmdError {
    #[error("Command execution failed: {0}")]
    ExecutionError(String),
    
    #[error("Permission denied: {0}")]
    PermissionError(String),
    
    #[error("Invalid command format: {0}")]
    ValidationError(String),
}
```

### Recovery Strategies
- **Graceful Degradation**: App continues working with reduced functionality
- **Automatic Retry**: Retry failed operations with exponential backoff
- **User Feedback**: Clear error messages with suggested actions
- **Logging**: Comprehensive logging for debugging

This architecture ensures QuickCMD is secure, performant, and maintainable while providing a smooth user experience.