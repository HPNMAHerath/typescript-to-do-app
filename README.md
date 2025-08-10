# TypeScript Todo Application

A comprehensive Todo application built with **TypeScript** demonstrating advanced programming concepts including OOP, interfaces, enums, and type safety.

##  Assignment Requirements Fulfilled

### TypeScript Features Implemented:
- **Type Aliases**: `TaskId`, `TaskText`, `TaskDate`, `HTMLElementId`, `ValidationResult`
- **Enums**: `TaskStatus`, `FilterOption`, `Priority`
- **Interfaces**: `Task`, `TaskStats`, `AppConfig`
- **Union Types**: `FilterType`, `TaskAction`
-  **Classes**: Abstract `TaskManager` class with concrete `TodoApp` implementation
- **Functions**: Pure functions, validation functions, utility functions
- **Arrays**: Array manipulation, filtering, iteration
- **OOP Concepts**: Inheritance, encapsulation, abstraction, polymorphism

## Features

- **Add Tasks**: Create new todo items with validation
- **Edit Tasks**: Inline editing with save/cancel functionality
- **Delete Tasks**: Remove tasks from the list
- **Toggle Completion**: Mark tasks as completed or pending
- **Filter Tasks**: View all, completed, or pending tasks only
- **Real-time Statistics**: Live count of total, completed, and pending tasks
- **Input Validation**: Character limits and empty input prevention
- **Responsive Design**: Works on desktop and mobile devices

##  Project Structure

```
src/
├── index.html          # Main HTML structure
├── main.ts            # TypeScript source code (main application)
├── main.js            # Compiled JavaScript output
├── main.css           # Application styling
├── tsconfig.json      # TypeScript configuration
└── README.md          # Project documentation
```

##  Technologies Used

- **TypeScript**: Type-safe JavaScript with advanced features
- **HTML5**: Semantic markup structure
- **CSS3**: Modern styling with Flexbox and CSS Variables
- **DOM API**: Dynamic user interface manipulation

##  Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- TypeScript compiler
- Modern web browser
- Git

### Installation & Running

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/typescript-todo-app.git
   cd typescript-todo-app
   ```

2. **Install TypeScript (if not installed globally)**
   ```bash
   npm install -g typescript
   ```

3. **Compile TypeScript**
   ```bash
   tsc
   ```

4. **Run the application**
   
   **Option 1**: Open directly in browser
   ```bash
   # Open src/index.html in your web browser
   ```
   
   **Option 2**: Use local server
   ```bash
   # Using Python
   python -m http.server 8080
   
   # Using Node.js
   npx http-server src -p 8080
   
   # Using VS Code Live Server extension
   # Right-click on index.html → "Open with Live Server"
   ```

5. **Access the application**
   ```
   http://localhost:8080 (if using server)
   or
   Direct file opening in browser
   ```

##  How to Use

1. **Adding Tasks**: Type in the input field and press Enter or click "Add Task"
2. **Completing Tasks**: Click the checkbox to mark as complete/incomplete
3. **Editing Tasks**: Click "Edit" button, modify text, then click "Save"
4. **Deleting Tasks**: Click "Delete" button to remove tasks
5. **Filtering**: Use filter buttons to view All, Pending, or Completed tasks
6. **Statistics**: View real-time count of your tasks in the header

## TypeScript Implementation Details

### Type System
```typescript
// Type Aliases for better code organization
type TaskId = number;
type TaskText = string;
type ValidationResult = 'valid' | 'empty' | 'too_long' | 'invalid';

// Enums for constants
enum TaskStatus {
    PENDING = 'pending',
    COMPLETED = 'completed'
}

// Interfaces for structure
interface Task {
    id: TaskId;
    text: TaskText;
    completed: boolean;
    status: TaskStatus;
    priority: Priority;
    createdAt: Date;
}
```

### Object-Oriented Design
```typescript
// Abstract base class
abstract class TaskManager {
    protected tasks: Task[] = [];
    abstract addTask(text: TaskText): void;
    abstract deleteTask(id: TaskId): void;
}

// Concrete implementation with inheritance
class TodoApp extends TaskManager {
    // Implementation with encapsulation and polymorphism
}
```

### Function Implementation
- **Pure Functions**: No side effects, predictable outputs
- **Array Methods**: Filter, map, reduce operations
- **Validation Functions**: Input sanitization and checking
- **DOM Functions**: Type-safe element manipulation

##  Code Quality Features

- **Strict TypeScript**: All strict mode options enabled
- **Type Safety**: No `any` types used (except for necessary DOM workarounds)
- **Error Handling**: Try-catch blocks and graceful failure handling
- **Input Validation**: Comprehensive user input sanitization
- **Clean Architecture**: Separation of concerns and single responsibility
- **Comments**: Comprehensive code documentation
- **Consistent Naming**: Following TypeScript/JavaScript conventions

##  Assignment Compliance

##  TypeScript Configuration

```json
{
  "compilerOptions": {
    "target": "ES5",
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "lib": ["DOM", "ES6"]
  }
}
```

##  Learning Outcomes

This project demonstrates:
- **Type Safety**: Preventing runtime errors through compile-time checking
- **OOP Principles**: Inheritance, encapsulation, and abstraction
- **Clean Code**: Readable, maintainable, and well-documented code
- **DOM Manipulation**: Type-safe interaction with web page elements
- **Project Organization**: Proper file structure and code organization
- **Error Handling**: Graceful failure and user feedback

##  License

MIT License - Free to use for educational purposes.

---



