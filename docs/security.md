# 🔒 QuickCMD Security Guide

## Table of Contents
- [Security Overview](#security-overview)
- [Command Execution Security](#command-execution-security)
- [System Integration Security](#system-integration-security)
- [Data Protection](#data-protection)
- [Permission Model](#permission-model)
- [Security Best Practices](#security-best-practices)
- [Reporting Security Issues](#reporting-security-issues)

## Security Overview

QuickCMD is designed with security as a core principle. As a command launcher with system-level access, we implement multiple layers of protection to ensure safe operation.

### Security Philosophy
- **Principle of Least Privilege**: Request only necessary permissions
- **Defense in Depth**: Multiple security layers
- **Transparency**: Open source for security auditing
- **User Control**: Clear permission requests and explanations

### Threat Model
QuickCMD protects against:
- **Malicious Command Injection**: Preventing execution of harmful commands
- **Path Traversal Attacks**: Restricting file system access
- **Resource Exhaustion**: Limiting CPU, memory, and time usage
- **Data Exfiltration**: No network access by default
- **Privilege Escalation**: Commands run with user permissions only

## Command Execution Security

### Command Validation

#### Input Sanitization
All commands undergo strict validation before execution:

```rust
pub struct CommandValidator {
    blocked_patterns: Vec<Regex>,
    allowed_commands: HashSet<String>,
    dangerous_flags: Vec<String>,
}

impl CommandValidator {
    fn validate(&self, command: &str) -> ValidationResult {
        // 1. Check against blocked patterns
        for pattern in &self.blocked_patterns {
            if pattern.is_match(command) {
                return ValidationResult::Blocked("Dangerous pattern detected");
            }
        }
        
        // 2. Validate command structure
        self.validate_command_structure(command)
    }
}
```

#### Blocked Commands
The following commands are blocked by default:
- **File Deletion**: `rm`, `rmdir`, `del`, `erase`
- **System Modification**: `sudo`, `su`, `chmod 777`
- **Network Tools**: `wget`, `curl`, `nc`, `telnet`
- **Process Control**: `kill -9`, `killall`
- **Disk Operations**: `dd`, `format`, `fdisk`

#### Safe Command Patterns
Only commands matching safe patterns are allowed:
- Application launchers: `open -a "App Name"`
- Directory navigation: `cd`, `ls`, `pwd`
- File viewing: `cat`, `less`, `head`, `tail`
- Git operations: `git status`, `git log`
- Development tools: `npm`, `yarn`, `cargo`

### Sandboxing

#### Process Isolation
Commands execute in isolated processes with restricted capabilities:

```rust
pub struct SecuritySandbox {
    // File system restrictions
    allowed_paths: Vec<PathBuf>,
    read_only_paths: Vec<PathBuf>,
    blocked_paths: Vec<PathBuf>,
    
    // Resource limits
    max_execution_time: Duration,
    max_memory_usage: u64,
    max_cpu_usage: f32,
    
    // Network restrictions
    allow_network: bool,
    allowed_hosts: Vec<String>,
}
```

#### Resource Limits
- **Execution Time**: 30 seconds maximum per command
- **Memory Usage**: 512MB maximum per process
- **CPU Usage**: Limited to prevent system freeze
- **File Descriptors**: Limited to prevent resource exhaustion

#### File System Access
- **Home Directory**: Read/write access to user's home directory
- **System Directories**: Read-only access to common system paths
- **Restricted Areas**: No access to `/System`, `/private`, etc.
- **Temporary Files**: Automatic cleanup of temporary files

### Command Categories

#### Trusted Commands
Commands that are always allowed:
```rust
const TRUSTED_COMMANDS: &[&str] = &[
    "ls", "pwd", "date", "whoami", "uname",
    "git status", "git log", "git diff",
    "npm --version", "node --version"
];
```

#### Conditional Commands
Commands allowed with restrictions:
- **File Operations**: Only in user directories
- **Network Commands**: With explicit user consent
- **System Information**: Limited to safe queries

#### Blocked Commands
Commands never allowed:
```rust
const BLOCKED_COMMANDS: &[&str] = &[
    "rm -rf", "sudo", "su", "chmod 777",
    "dd", "format", "fdisk", "kill -9"
];
```

## System Integration Security

### Global Shortcuts

#### Secure Registration
Global shortcuts are registered securely:
- **Single Shortcut**: Only one global shortcut active
- **User Control**: User can disable/change shortcut
- **No Key Logging**: Shortcuts don't log keystrokes
- **Conflict Detection**: Warns about shortcut conflicts

```rust
impl GlobalShortcutManager {
    fn register_shortcut(&mut self, shortcut: &str) -> Result<()> {
        // Unregister previous shortcut
        self.unregister_all()?;
        
        // Validate shortcut format
        self.validate_shortcut_format(shortcut)?;
        
        // Register with system
        self.register_with_system(shortcut)
    }
}
```

### Menubar Integration

#### Tray Icon Security
- **Icon Validation**: Only trusted icon formats
- **Menu Sanitization**: Menu items are validated
- **Click Validation**: Prevent click injection
- **Context Menu**: Secure context menu implementation

#### Window Management
- **Position Validation**: Window position bounds checking
- **Focus Management**: Secure focus handling
- **Event Filtering**: Filter malicious window events

### System Permissions

#### Required Permissions
QuickCMD requests minimal permissions:

1. **Accessibility**: For global shortcut registration
   - Purpose: Capture global keyboard shortcuts
   - Scope: Only registered shortcuts, no keylogging
   - User Control: Can be revoked in System Preferences

2. **File System**: For command execution
   - Purpose: Execute commands and open files
   - Scope: User's home directory and common locations
   - Restrictions: No system-critical directories

3. **Automation**: For application launching
   - Purpose: Open applications via commands
   - Scope: Standard application launching
   - Limitations: No scripting of other applications

#### Permission Validation
```rust
fn check_permissions() -> PermissionStatus {
    let mut status = PermissionStatus::new();
    
    // Check accessibility permission
    status.accessibility = check_accessibility_permission();
    
    // Check file system access
    status.file_system = check_file_system_permission();
    
    // Check automation permission
    status.automation = check_automation_permission();
    
    status
}
```

## Data Protection

### Local Data Storage

#### Data Location
User data is stored securely in:
```
~/Library/Application Support/QuickCMD/
├── commands.json       # Encrypted command history
├── settings.json       # Application settings
├── favorites.json      # Favorite commands
└── logs/              # Application logs (if enabled)
```

#### Data Encryption
Sensitive data is encrypted at rest:
- **Command History**: AES-256 encryption
- **API Keys**: Stored in macOS Keychain
- **Settings**: Plain text (non-sensitive)
- **Logs**: No sensitive data logged

```rust
struct SecureStorage {
    encryption_key: [u8; 32],
    cipher: ChaCha20Poly1305,
}

impl SecureStorage {
    fn encrypt_data(&self, data: &[u8]) -> Result<Vec<u8>> {
        let nonce = ChaCha20Poly1305::generate_nonce(&mut OsRng);
        self.cipher.encrypt(&nonce, data)
    }
    
    fn decrypt_data(&self, encrypted: &[u8]) -> Result<Vec<u8>> {
        // Extract nonce and decrypt
        self.cipher.decrypt(&nonce, encrypted)
    }
}
```

### Privacy Protection

#### No Data Collection
QuickCMD does not collect or transmit user data:
- **No Analytics**: No usage tracking
- **No Telemetry**: No performance data sent
- **No Crash Reports**: Crashes handled locally
- **No Updates**: No automatic update checks

#### Data Minimization
- **Command History**: Limited to last 100 commands
- **Log Files**: Minimal logging, automatic rotation
- **Temporary Files**: Automatic cleanup
- **Memory**: Sensitive data cleared from memory

### Network Security

#### No Network Access
QuickCMD operates entirely offline:
- **No Internet Required**: All functionality works offline
- **No External Requests**: No outbound network connections
- **Local Only**: All data processing happens locally
- **Air-Gapped**: Complete isolation from network threats

## Permission Model

### macOS Security Integration

#### Gatekeeper Compliance
- **Code Signing**: Application is properly signed
- **Notarization**: Submitted to Apple for security review
- **Entitlements**: Minimal required entitlements
- **Hardened Runtime**: Enhanced security features enabled

#### System Integrity Protection (SIP)
- **SIP Compliance**: Respects SIP restrictions
- **No SIP Bypass**: No attempts to circumvent SIP
- **Protected Resources**: Avoids protected system resources

### User Consent

#### Permission Requests
All permissions are requested with clear explanations:

```rust
fn request_accessibility_permission() -> bool {
    let alert = Alert::new()
        .title("Accessibility Permission Required")
        .message("QuickCMD needs accessibility permission to register global shortcuts. This allows you to open QuickCMD from anywhere using Cmd+Space.")
        .buttons(vec!["Open System Preferences", "Cancel"]);
        
    match alert.show() {
        AlertResponse::Primary => {
            open_accessibility_preferences();
            true
        }
        _ => false
    }
}
```

#### Granular Control
Users can control permissions individually:
- **Global Shortcuts**: Can be disabled
- **Command Execution**: Can be restricted
- **File Access**: Can be limited to specific directories
- **Application Launching**: Can be disabled

## Security Best Practices

### For Users

#### Safe Usage
1. **Review Commands**: Always review commands before execution
2. **Avoid Sudo**: Never use sudo commands in QuickCMD
3. **Regular Updates**: Keep QuickCMD updated for security fixes
4. **Permission Audit**: Regularly review granted permissions

#### Command Guidelines
- ✅ **Safe**: `git status`, `ls`, `open .`
- ⚠️ **Caution**: `npm install`, `brew install`
- ❌ **Dangerous**: `sudo rm -rf`, `chmod 777`

### For Developers

#### Code Review
All code changes undergo security review:
- **Dependency Audit**: Regular dependency security checks
- **Static Analysis**: Automated security scanning
- **Penetration Testing**: Regular security assessments
- **Code Signing**: All releases are signed

#### Development Practices
```rust
// Example: Secure command execution
fn execute_command_safely(cmd: &str) -> Result<Output> {
    // 1. Validate command
    CommandValidator::validate(cmd)?;
    
    // 2. Apply sandbox
    let sandbox = SecuritySandbox::new()
        .with_timeout(Duration::from_secs(30))
        .with_memory_limit(512 * 1024 * 1024)
        .with_readonly_filesystem();
    
    // 3. Execute with restrictions
    sandbox.execute(cmd)
}
```

## Security Auditing

### Audit Logs
When enabled, QuickCMD maintains security audit logs:
- **Command Execution**: Timestamp, command, result
- **Permission Changes**: User permission modifications
- **Security Violations**: Blocked commands and reasons
- **System Events**: Application start/stop, crashes

### Log Format
```json
{
  "timestamp": "2024-01-01T12:00:00Z",
  "event_type": "command_execution",
  "command": "git status",
  "result": "success",
  "execution_time": 0.123,
  "user": "username"
}
```

### Compliance

#### Security Standards
QuickCMD follows industry security standards:
- **OWASP Top 10**: Protection against common vulnerabilities
- **CIS Controls**: Implementation of critical security controls
- **NIST Framework**: Alignment with cybersecurity framework

## Reporting Security Issues

### Responsible Disclosure

If you discover a security vulnerability, please:

1. **Do Not** create a public GitHub issue
2. **Email** security concerns to: [security@ali-master.dev]
3. **Include** detailed reproduction steps
4. **Provide** your contact information for follow-up

### Security Response Process

1. **Acknowledgment**: Within 24 hours
2. **Initial Assessment**: Within 72 hours
3. **Fix Development**: Priority based on severity
4. **Security Release**: Emergency release if critical
5. **Public Disclosure**: After fix is widely deployed

### Vulnerability Rewards

We appreciate security researchers and offer:
- **Recognition**: Public acknowledgment (if desired)
- **Early Access**: Preview of upcoming features
- **Swag**: QuickCMD merchandise

### Security Contact

- **Email**: security@ali-master.dev
- **PGP Key**: Available on request
- **Response Time**: 24-72 hours

## Security Roadmap

### Current Implementation
- ✅ Command validation and sandboxing
- ✅ Minimal permission model
- ✅ Local data encryption
- ✅ No network communication

### Planned Enhancements
- 🔄 Enhanced audit logging
- 🔄 User-configurable security policies
- 🔄 Integration with macOS Security Framework
- 🔄 Advanced threat detection

### Future Considerations
- 📋 Hardware security module integration
- 📋 Remote security policy management
- 📋 Enterprise security features
- 📋 Third-party security tool integration

This security model ensures QuickCMD provides powerful functionality while maintaining the highest security standards for user safety and data protection.