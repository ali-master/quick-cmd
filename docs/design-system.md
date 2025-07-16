# 🎨 QuickCMD Design System

## Table of Contents
- [Design Philosophy](#design-philosophy)
- [Visual Language](#visual-language)
- [Color System](#color-system)
- [Typography](#typography)
- [Component Library](#component-library)
- [Animation System](#animation-system)
- [Accessibility](#accessibility)

## Design Philosophy

### Core Principles

#### 1. **Minimal & Focused**
- Clean, uncluttered interface
- Focus on command execution workflow
- Remove unnecessary visual elements
- Prioritize content over decoration

#### 2. **Native Integration**
- Follows macOS design guidelines
- Consistent with system UI patterns
- Respects user's appearance preferences
- Seamless menubar integration

#### 3. **Performance First**
- Smooth 60fps animations
- Instant response to user input
- Efficient rendering and memory usage
- Optimized for keyboard navigation

#### 4. **Glass Morphism**
- Translucent, layered surfaces
- Backdrop blur effects
- Subtle depth and elevation
- Modern, premium feel

## Visual Language

### Glass Morphism Design

#### Surface Hierarchy
```css
/* Primary Surface - Main window */
.surface-primary {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

/* Secondary Surface - Command items */
.surface-secondary {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Tertiary Surface - Subtle backgrounds */
.surface-tertiary {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
}
```

#### Elevation System
- **Level 0**: Base background (transparent)
- **Level 1**: Command list container
- **Level 2**: Individual command items
- **Level 3**: Hover states and selections
- **Level 4**: Modals and overlays

### Spatial Design

#### Layout Grid
```css
.container {
  padding: 16px;
  gap: 12px;
}

.header {
  padding: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.content {
  padding: 12px 16px;
}
```

#### Spacing Scale
- **xs**: 4px
- **sm**: 8px
- **md**: 12px
- **lg**: 16px
- **xl**: 24px
- **2xl**: 32px

## Color System

### Light Theme

#### Primary Colors
```css
:root[data-theme="light"] {
  /* Primary - Blue gradient */
  --primary-50: #eff6ff;
  --primary-100: #dbeafe;
  --primary-500: #3b82f6;
  --primary-600: #2563eb;
  --primary-900: #1e3a8a;
  
  /* Secondary - Purple accent */
  --secondary-500: #8b5cf6;
  --secondary-600: #7c3aed;
  
  /* Accent - Cyan highlight */
  --accent-500: #06b6d4;
  --accent-600: #0891b2;
}
```

#### Semantic Colors
```css
:root[data-theme="light"] {
  /* Status colors */
  --success: #10b981;
  --warning: #f59e0b;
  --error: #ef4444;
  --info: #3b82f6;
  
  /* Neutral colors */
  --background: rgba(255, 255, 255, 0.95);
  --foreground: #1f2937;
  --muted: rgba(0, 0, 0, 0.6);
  --border: rgba(0, 0, 0, 0.1);
}
```

### Dark Theme

#### Primary Colors
```css
:root[data-theme="dark"] {
  /* Primary - Blue gradient (adjusted) */
  --primary-500: #60a5fa;
  --primary-600: #3b82f6;
  
  /* Background surfaces */
  --background: rgba(15, 23, 42, 0.95);
  --foreground: #f8fafc;
  --muted: rgba(255, 255, 255, 0.6);
  --border: rgba(255, 255, 255, 0.1);
}
```

#### Glass Effects
```css
/* Dark theme glass surfaces */
.surface-primary-dark {
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

### Color Usage Guidelines

#### Command Types
- **Commands**: Blue (#3b82f6)
- **Files**: Green (#10b981)
- **Scripts**: Purple (#8b5cf6)
- **Applications**: Orange (#f59e0b)

#### Interactive States
- **Default**: Neutral colors
- **Hover**: Primary color with 10% opacity
- **Active**: Primary color with 20% opacity
- **Selected**: Primary color with gradient
- **Disabled**: 40% opacity

## Typography

### Font System

#### Primary Font
```css
.font-primary {
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
  font-feature-settings: 'kern' 1, 'liga' 1;
}
```

#### Monospace Font
```css
.font-mono {
  font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', monospace;
  font-feature-settings: 'kern' 1;
}
```

### Type Scale

#### Heading Scale
```css
.text-xs { font-size: 12px; line-height: 16px; }
.text-sm { font-size: 14px; line-height: 20px; }
.text-base { font-size: 16px; line-height: 24px; }
.text-lg { font-size: 18px; line-height: 28px; }
.text-xl { font-size: 20px; line-height: 28px; }
.text-2xl { font-size: 24px; line-height: 32px; }
```

#### Font Weights
```css
.font-normal { font-weight: 400; }
.font-medium { font-weight: 500; }
.font-semibold { font-weight: 600; }
.font-bold { font-weight: 700; }
```

### Typography Usage

#### Command Names
- Font: SF Pro Display
- Size: 14px (text-sm)
- Weight: 500 (medium)
- Color: Primary foreground

#### Command Descriptions
- Font: SF Pro Display
- Size: 12px (text-xs)
- Weight: 400 (normal)
- Color: Muted foreground

#### Search Input
- Font: SF Pro Display
- Size: 16px (text-base)
- Weight: 400 (normal)
- Color: Primary foreground

## Component Library

### Core Components

#### Button Component
```tsx
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md',
  disabled = false,
  children 
}) => {
  const baseStyles = "rounded-lg font-medium transition-all duration-200";
  const variants = {
    primary: "bg-primary-500 text-white hover:bg-primary-600",
    secondary: "bg-surface-secondary text-foreground hover:bg-surface-tertiary",
    ghost: "bg-transparent text-foreground hover:bg-surface-secondary"
  };
  
  return (
    <button className={`${baseStyles} ${variants[variant]}`}>
      {children}
    </button>
  );
};
```

#### Input Component
```tsx
interface InputProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  autoFocus?: boolean;
}

const Input: React.FC<InputProps> = ({ 
  placeholder, 
  value, 
  onChange,
  autoFocus = false 
}) => {
  return (
    <input
      className="w-full px-4 py-3 bg-surface-secondary border border-border rounded-lg 
                 text-foreground placeholder-muted focus:outline-none focus:ring-2 
                 focus:ring-primary-500 transition-all duration-200"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      autoFocus={autoFocus}
    />
  );
};
```

#### Command Item Component
```tsx
interface CommandItemProps {
  command: CommandItem;
  isSelected: boolean;
  onExecute: () => void;
  onToggleFavorite: () => void;
}

const CommandItem: React.FC<CommandItemProps> = ({
  command,
  isSelected,
  onExecute,
  onToggleFavorite
}) => {
  return (
    <motion.div
      className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
        isSelected ? 'bg-primary-500/20 ring-1 ring-primary-500' : 'hover:bg-surface-secondary'
      }`}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onExecute}
    >
      <div className="flex items-center gap-3">
        <CommandIcon type={command.type} />
        <div className="flex-1">
          <div className="font-medium text-sm text-foreground">
            {command.name}
          </div>
          <div className="text-xs text-muted">
            {command.description}
          </div>
        </div>
        <FavoriteButton 
          isFavorite={command.isFavorite} 
          onToggle={onToggleFavorite} 
        />
      </div>
    </motion.div>
  );
};
```

### Icon System

#### Icon Components
```tsx
const CommandIcon: React.FC<{ type: CommandType }> = ({ type }) => {
  const icons = {
    command: Terminal,
    file: FileText,
    script: Code,
    application: Package
  };
  
  const Icon = icons[type] || Terminal;
  
  return (
    <div className="w-8 h-8 rounded-lg bg-surface-tertiary flex items-center justify-center">
      <Icon className="w-4 h-4 text-muted" />
    </div>
  );
};
```

#### Icon Guidelines
- **Size**: 16px (w-4 h-4) for inline icons
- **Container**: 32px (w-8 h-8) for command type icons
- **Color**: Muted foreground for consistency
- **Style**: Lucide React icon set

### Layout Components

#### Window Container
```tsx
const WindowContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="w-full h-full bg-background/95 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="h-full"
      >
        <Card className="h-full overflow-hidden border-0 bg-transparent shadow-none">
          {children}
        </Card>
      </motion.div>
    </div>
  );
};
```

#### Header Component
```tsx
const Header: React.FC = () => {
  return (
    <div className="p-4 border-b border-border/50">
      {/* Arrow pointing to tray */}
      <div className="flex justify-center mb-2">
        <div className="w-3 h-3 bg-background border border-border rotate-45 transform -translate-y-1.5" />
      </div>
      
      <div className="flex items-center gap-3">
        <SearchInput />
        <CloseButton />
      </div>
    </div>
  );
};
```

## Animation System

### Motion Principles

#### 1. **Purposeful Motion**
- Animations guide user attention
- Provide feedback for interactions
- Enhance spatial understanding
- Never purely decorative

#### 2. **Natural Easing**
- Use ease-out for entry animations
- Use ease-in for exit animations
- Spring physics for interactive elements
- Consistent timing across components

### Animation Library

#### Entry Animations
```tsx
const entryVariants = {
  hidden: { 
    opacity: 0, 
    y: -10,
    scale: 0.98
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.2,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};
```

#### Hover Animations
```tsx
const hoverVariants = {
  hover: {
    scale: 1.01,
    transition: {
      duration: 0.1,
      ease: "easeOut"
    }
  },
  tap: {
    scale: 0.99,
    transition: {
      duration: 0.05,
      ease: "easeInOut"
    }
  }
};
```

#### List Animations
```tsx
const listVariants = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 10
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  }
};
```

### Performance Guidelines

#### Animation Optimization
- Use `transform` and `opacity` for smooth animations
- Avoid animating `width`, `height`, or layout properties
- Use `will-change` sparingly and remove after animation
- Prefer CSS transforms over JavaScript animations

#### Frame Rate Targets
- **60fps**: Standard animations and transitions
- **120fps**: High-frequency interactions (where supported)
- **Reduced Motion**: Respect user preferences

## Accessibility

### Keyboard Navigation

#### Focus Management
```css
.focus-visible {
  outline: 2px solid var(--primary-500);
  outline-offset: 2px;
  border-radius: 6px;
}

.focus-within {
  ring: 2px solid var(--primary-500);
  ring-opacity: 0.5;
}
```

#### Navigation Patterns
- **Tab Order**: Logical and predictable
- **Arrow Keys**: List navigation
- **Enter**: Activate selected item
- **Escape**: Close/cancel actions

### Screen Reader Support

#### ARIA Labels
```tsx
<div
  role="listbox"
  aria-label="Command list"
  aria-activedescendant={`command-${selectedIndex}`}
>
  {commands.map((command, index) => (
    <div
      key={command.id}
      id={`command-${index}`}
      role="option"
      aria-selected={index === selectedIndex}
      aria-label={`${command.name}: ${command.description}`}
    >
      {/* Command content */}
    </div>
  ))}
</div>
```

#### Live Regions
```tsx
<div
  aria-live="polite"
  aria-atomic="true"
  className="sr-only"
>
  {searchResults.length} commands found
</div>
```

### Color & Contrast

#### Contrast Ratios
- **Normal Text**: 4.5:1 minimum
- **Large Text**: 3:1 minimum
- **Interactive Elements**: 3:1 minimum
- **Focus Indicators**: 3:1 minimum

#### Color Independence
- Never rely solely on color to convey information
- Use icons, text, or patterns as alternatives
- Test with color blindness simulators

### Reduced Motion

#### Respecting Preferences
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

#### Alternative Feedback
- Instant state changes instead of transitions
- Static focus indicators
- Simplified entrance effects

## Design Tokens

### Spacing Tokens
```css
:root {
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
}
```

### Border Radius
```css
:root {
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-full: 50%;
}
```

### Shadows
```css
:root {
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.1);
  --shadow-glass: 0 8px 32px rgba(0, 0, 0, 0.1);
}
```

This design system ensures QuickCMD maintains a consistent, accessible, and beautiful user interface that feels native to macOS while providing a modern, glass-morphism aesthetic.