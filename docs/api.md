# 🔌 QuickCMD API Reference

## Table of Contents
- [Tauri Commands](#tauri-commands)
- [Events](#events)
- [Data Types](#data-types)
- [Error Handling](#error-handling)
- [Frontend API](#frontend-api)

## Tauri Commands

Tauri commands are Rust functions that can be called from the frontend. They provide the bridge between the React UI and the Rust backend.

### Window Management

#### `toggle_window`
Toggles the visibility of the QuickCMD window.

```typescript
import { invoke } from '@tauri-apps/api/core';

await invoke('toggle_window');
```

**Returns:** `void`

**Description:** Shows the window if hidden, hides if visible. Also handles positioning the window below the menubar icon.

#### `show_window`
Forces the window to be shown.

```typescript
await invoke('show_window');
```

**Returns:** `void`

**Description:** Makes the window visible and brings it to focus, regardless of current state.

### Command Management

#### `execute_command`
Executes a shell command or opens a file/application.

```typescript
interface ExecuteCommandParams {
  command: string;
  type: 'command' | 'file' | 'script';
  workingDir?: string;
}

const result = await invoke('execute_command', {
  command: 'git status',
  type: 'command'
});
```

**Parameters:**
- `command`: The command to execute
- `type`: Type of command (shell command, file path, or script)
- `workingDir`: Optional working directory

**Returns:** `Promise<string>` - Command output or success message

**Errors:**
- `ExecutionError`: Command failed to execute
- `PermissionError`: Insufficient permissions
- `ValidationError`: Invalid command format

#### `validate_command`
Validates a command before execution.

```typescript
const isValid = await invoke('validate_command', {
  command: 'rm -rf /'
});
```

**Parameters:**
- `command`: Command string to validate

**Returns:** `Promise<boolean>` - Whether the command is safe to execute

### Favorites Management

#### `add_to_favorites`
Adds a command to the favorites list.

```typescript
await invoke('add_to_favorites', {
  commandId: 'uuid-string'
});
```

**Parameters:**
- `commandId`: Unique identifier for the command

**Returns:** `void`

#### `remove_from_favorites`
Removes a command from favorites.

```typescript
await invoke('remove_from_favorites', {
  commandId: 'uuid-string'
});
```

**Parameters:**
- `commandId`: Unique identifier for the command

**Returns:** `void`

#### `get_favorites`
Retrieves all favorite commands.

```typescript
const favorites = await invoke('get_favorites');
```

**Returns:** `Promise<CommandItem[]>` - Array of favorite commands

### Command History

#### `get_recent_commands`
Gets recently executed commands.

```typescript
const recent = await invoke('get_recent_commands', {
  limit: 10
});
```

**Parameters:**
- `limit`: Maximum number of commands to return (default: 5)

**Returns:** `Promise<CommandItem[]>` - Array of recent commands

#### `clear_command_history`
Clears the command execution history.

```typescript
await invoke('clear_command_history');
```

**Returns:** `void`

### Settings Management

#### `get_settings`
Retrieves application settings.

```typescript
const settings = await invoke('get_settings');
```

**Returns:** `Promise<AppSettings>` - Current application settings

#### `update_settings`
Updates application settings.

```typescript
await invoke('update_settings', {
  settings: {
    globalShortcut: 'CommandOrControl+Shift+Space',
    theme: 'dark'
  }
});
```

**Parameters:**
- `settings`: Partial settings object to update

**Returns:** `void`

## Events

Events allow the backend to send real-time updates to the frontend.

### Window Events

#### `window-focus-changed`
Emitted when the window gains or loses focus.

```typescript
import { listen } from '@tauri-apps/api/event';

await listen('window-focus-changed', (event) => {
  const { focused } = event.payload;
  console.log(`Window ${focused ? 'gained' : 'lost'} focus`);
});
```

**Payload:**
```typescript
{
  focused: boolean;
  timestamp: number;
}
```

#### `window-position-changed`
Emitted when the window position changes.

```typescript
await listen('window-position-changed', (event) => {
  const { x, y } = event.payload;
  console.log(`Window moved to (${x}, ${y})`);
});
```

**Payload:**
```typescript
{
  x: number;
  y: number;
}
```

### Command Events

#### `command-executed`
Emitted after a command is successfully executed.

```typescript
await listen('command-executed', (event) => {
  const { command, output, duration } = event.payload;
  updateCommandHistory(command);
});
```

**Payload:**
```typescript
{
  command: CommandItem;
  output: string;
  duration: number; // milliseconds
  timestamp: number;
}
```

#### `command-failed`
Emitted when a command execution fails.

```typescript
await listen('command-failed', (event) => {
  const { command, error } = event.payload;
  showErrorMessage(error);
});
```

**Payload:**
```typescript
{
  command: CommandItem;
  error: string;
  errorCode: string;
  timestamp: number;
}
```

### System Events

#### `global-shortcut-triggered`
Emitted when the global shortcut is pressed.

```typescript
await listen('global-shortcut-triggered', (event) => {
  toggleWindow();
});
```

**Payload:**
```typescript
{
  shortcut: string;
  timestamp: number;
}
```

## Data Types

### CommandItem
```typescript
interface CommandItem {
  id: string;
  name: string;
  command: string;
  type: 'command' | 'file' | 'script';
  isFavorite: boolean;
  lastUsed?: Date;
  description?: string;
  icon?: string;
  tags?: string[];
  createdAt: Date;
  executionCount: number;
}
```

### AppSettings
```typescript
interface AppSettings {
  globalShortcut: string;
  windowPosition: 'tray-center' | 'screen-center' | 'cursor';
  theme: 'light' | 'dark' | 'auto';
  startOnLogin: boolean;
  commandTimeout: number; // seconds
  maxHistorySize: number;
  enableAnimations: boolean;
  hideOnFocusLoss: boolean;
}
```

### ExecutionResult
```typescript
interface ExecutionResult {
  success: boolean;
  output: string;
  error?: string;
  exitCode: number;
  duration: number; // milliseconds
}
```

### ValidationResult
```typescript
interface ValidationResult {
  valid: boolean;
  reason?: string;
  suggestions?: string[];
}
```

## Error Handling

### Error Types

#### QuickCmdError
Base error type for all QuickCMD operations.

```typescript
interface QuickCmdError {
  code: string;
  message: string;
  details?: any;
}
```

#### Common Error Codes
- `EXECUTION_FAILED`: Command execution failed
- `PERMISSION_DENIED`: Insufficient permissions
- `INVALID_COMMAND`: Command format is invalid
- `TIMEOUT`: Command execution timed out
- `NOT_FOUND`: Command or file not found
- `NETWORK_ERROR`: Network-related error

### Error Handling Patterns

#### Try-Catch with Tauri Commands
```typescript
try {
  const result = await invoke('execute_command', {
    command: 'some-command'
  });
  // Handle success
} catch (error) {
  if (error.code === 'PERMISSION_DENIED') {
    showPermissionError();
  } else {
    showGenericError(error.message);
  }
}
```

#### Event-Based Error Handling
```typescript
await listen('command-failed', (event) => {
  const { error, errorCode } = event.payload;
  
  switch (errorCode) {
    case 'TIMEOUT':
      showTimeoutError();
      break;
    case 'NOT_FOUND':
      showNotFoundError();
      break;
    default:
      showGenericError(error);
  }
});
```

## Frontend API

### React Hooks

#### useCommands
Custom hook for managing commands.

```typescript
interface UseCommandsReturn {
  commands: CommandItem[];
  favorites: CommandItem[];
  recent: CommandItem[];
  executeCommand: (command: CommandItem) => Promise<void>;
  toggleFavorite: (commandId: string) => Promise<void>;
  addCommand: (command: Omit<CommandItem, 'id'>) => Promise<void>;
  deleteCommand: (commandId: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const {
  commands,
  executeCommand,
  toggleFavorite
} = useCommands();
```

#### useSettings
Hook for managing application settings.

```typescript
interface UseSettingsReturn {
  settings: AppSettings;
  updateSetting: (key: keyof AppSettings, value: any) => Promise<void>;
  resetSettings: () => Promise<void>;
  isLoading: boolean;
}

const { settings, updateSetting } = useSettings();
```

#### useKeyboardNavigation
Hook for handling keyboard navigation.

```typescript
interface UseKeyboardNavigationReturn {
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  handleKeyDown: (event: KeyboardEvent) => void;
  selectNext: () => void;
  selectPrevious: () => void;
  executeSelected: () => void;
}

const {
  selectedIndex,
  handleKeyDown,
  executeSelected
} = useKeyboardNavigation(filteredCommands);
```

### Utility Functions

#### formatCommand
Formats a command string for display.

```typescript
function formatCommand(command: string, maxLength = 50): string {
  if (command.length <= maxLength) return command;
  return command.substring(0, maxLength - 3) + '...';
}
```

#### validateCommandInput
Validates user input for commands.

```typescript
function validateCommandInput(input: string): ValidationResult {
  // Returns validation result
}
```

#### searchCommands
Filters commands based on search query.

```typescript
function searchCommands(
  commands: CommandItem[],
  query: string
): CommandItem[] {
  // Returns filtered commands
}
```

## Rate Limiting

Some commands have built-in rate limiting to prevent abuse:

- **Command execution**: Max 10 commands per second
- **Settings updates**: Max 5 updates per second
- **Favorites changes**: Max 20 changes per minute

## Security Considerations

### Command Validation
All commands are validated before execution:
- No dangerous commands (rm, format, etc.)
- Path traversal prevention
- Shell injection protection

### Sandboxing
Commands run in a restricted environment:
- Limited file system access
- No network access by default
- Resource limits (CPU, memory, time)

### Permissions
QuickCMD requests minimal permissions:
- Accessibility (for global shortcuts)
- File system (for command execution)
- No network access required

This API provides a comprehensive interface for building and extending QuickCMD's functionality while maintaining security and performance.