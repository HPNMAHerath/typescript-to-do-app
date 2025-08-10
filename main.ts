//  TYPE ALIASES 
type TaskId = number;
type TaskText = string;
type TaskDate = Date;
type HTMLElementId = string;

//  ENUMS 
enum TaskStatus {
    PENDING = 'pending',
    COMPLETED = 'completed'
}

enum FilterOption {
    ALL = 'all',
    COMPLETED = 'completed',
    PENDING = 'pending'
}

enum Priority {
    LOW = 1,
    MEDIUM = 2,
    HIGH = 3
}

// INTERFACES
interface Task {
    id: TaskId;
    text: TaskText;
    completed: boolean;
    status: TaskStatus;
    priority: Priority;
    createdAt: TaskDate;
}

interface TaskStats {
    total: number;
    completed: number;
    pending: number;
}

interface AppConfig {
    maxTaskLength: number;
    autoSave: boolean;
    defaultPriority: Priority;
}

//  UNION TYPES 
type FilterType = FilterOption.ALL | FilterOption.COMPLETED | FilterOption.PENDING;
type TaskAction = 'add' | 'edit' | 'delete' | 'toggle' | 'filter';
type ValidationResult = 'valid' | 'empty' | 'too_long' | 'invalid';

// CLASSES

// Base class for Task operations
abstract class TaskManager {
    protected tasks: Task[] = [];
    
    abstract addTask(text: TaskText): void;
    abstract deleteTask(id: TaskId): void;
    
    // Function using arrays
    protected getTasksArray(): Task[] {
        const result: Task[] = [];
        for (let i = 0; i < this.tasks.length; i++) {
            result.push(this.tasks[i]);
        }
        return result;
    }
}

// Main application class (OOP concepts)
class TodoApp extends TaskManager {
    private currentFilter: FilterType = FilterOption.ALL;
    private editingId: TaskId | null = null;
    private config: AppConfig;

    // DOM Elements - Removed readonly to allow direct assignment
    private taskInput!: HTMLInputElement;
    private addBtn!: HTMLButtonElement;
    private tasksList!: HTMLElement;
    private emptyState!: HTMLElement;
    private filterBtns!: NodeListOf<HTMLButtonElement>;

    constructor() {
        super(); // OOP inheritance
        
        // Initialize configuration
        this.config = {
            maxTaskLength: 200,
            autoSave: true,
            defaultPriority: Priority.MEDIUM
        };

        // Initialize DOM elements with error handling
        try {
            // Direct assignment now that properties are not readonly
            this.taskInput = this.getElementById<HTMLInputElement>('taskInput');
            this.addBtn = this.getElementById<HTMLButtonElement>('addBtn');
            this.tasksList = this.getElementById<HTMLElement>('tasksList');
            this.emptyState = this.getElementById<HTMLElement>('emptyState');
            this.filterBtns = document.querySelectorAll<HTMLButtonElement>('.filter-btn');

            console.log('DOM elements initialized successfully');
            this.initializeEventListeners();
            this.renderTasks();
            this.updateStats();
        } catch (error) {
            console.error('Failed to initialize TodoApp:', error);
        }
    }

    //  HELPER FUNCTIONS

    private getElementById<T extends HTMLElement>(id: HTMLElementId): T {
        const element = document.getElementById(id) as T;
        if (!element) {
            throw new Error(`Element with id "${id}" not found`);
        }
        return element;
    }

    private generateUniqueId(): TaskId {
        return Date.now() + Math.random();
    }

    // Function demonstrating enums and type aliases
    private createNewTask(text: TaskText): Task {
        return {
            id: this.generateUniqueId(),
            text: text,
            completed: false,
            status: TaskStatus.PENDING,
            priority: this.config.defaultPriority,
            createdAt: new Date()
        };
    }

    // VALIDATION FUNCTIONS 

    private validateTaskInput(text: TaskText): ValidationResult {
        console.log('Validating input:', text);
        
        if (!text || !text.trim()) {
            console.log('Validation failed: empty text');
            return 'empty';
        }
        
        if (text.trim().length > this.config.maxTaskLength) {
            console.log('Validation failed: text too long');
            return 'too_long';
        }
        
        console.log('Validation passed');
        return 'valid';
    }

    //  EVENT LISTENERS 

    private initializeEventListeners(): void {
        console.log('Setting up event listeners...');
        
        // Direct call to addTask method
        this.addBtn.addEventListener('click', () => {
            console.log('Add button clicked');
            this.addTask(this.taskInput.value);
        });
        
        this.taskInput.addEventListener('keypress', (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                console.log('Enter key pressed');
                this.addTask(this.taskInput.value);
            }
        });

        // Filter button listeners
        for (let i = 0; i < this.filterBtns.length; i++) {
            const btn = this.filterBtns[i];
            btn.addEventListener('click', () => {
                this.setActiveFilter(btn);
                const filter = this.getFilterFromButton(btn);
                this.applyFilter(filter);
            });
        }
        
        console.log('Event listeners set up successfully');
    }

    private getFilterFromButton(btn: HTMLButtonElement): FilterType {
        const filterValue = btn.dataset.filter;
        
        switch (filterValue) {
            case 'completed':
                return FilterOption.COMPLETED;
            case 'pending':
                return FilterOption.PENDING;
            case 'all':
            default:
                return FilterOption.ALL;
        }
    }

    private setActiveFilter(activeBtn: HTMLButtonElement): void {
        for (let i = 0; i < this.filterBtns.length; i++) {
            this.filterBtns[i].classList.remove('active');
        }
        activeBtn.classList.add('active');
    }

    //  CORE FUNCTIONALITY FUNCTIONS 

    // Override abstract method from base class
    public addTask(text: TaskText): void {
        console.log('addTask called with:', text);
        
        const validation = this.validateTaskInput(text);
        
        if (validation !== 'valid') {
            this.handleValidationError(validation);
            return;
        }

        const newTask = this.createNewTask(text.trim());
        console.log('Created new task:', newTask);
        
        this.tasks.unshift(newTask); // Array operation
        console.log('Tasks array now has', this.tasks.length, 'items');
        
        this.taskInput.value = '';
        this.renderTasks();
        this.updateStats();

        if (this.config.autoSave) {
            this.autoSaveToConsole();
        }
    }

    private handleValidationError(error: ValidationResult): void {
        switch (error) {
            case 'empty':
                console.warn('Task text cannot be empty');
                alert('Please enter a task!');
                break;
            case 'too_long':
                console.warn(`Task text too long (max ${this.config.maxTaskLength} characters)`);
                alert(`Task too long! Maximum ${this.config.maxTaskLength} characters.`);
                break;
            case 'invalid':
                console.warn('Invalid task input');
                alert('Invalid task input!');
                break;
        }
    }

    public toggleTask(id: TaskId): void {
        console.log('Toggling task:', id);
        const task = this.findTaskById(id);
        
        if (task) {
            task.completed = !task.completed;
            task.status = task.completed ? TaskStatus.COMPLETED : TaskStatus.PENDING;
            this.renderTasks();
            this.updateStats();
        } else {
            console.error(`Task with id ${id} not found`);
        }
    }

    // Override abstract method from base class
    public deleteTask(id: TaskId): void {
        console.log('Deleting task:', id);
        const initialLength = this.tasks.length;
        const newTasks: Task[] = [];
        
        // Array manipulation using functions
        for (let i = 0; i < this.tasks.length; i++) {
            if (this.tasks[i].id !== id) {
                newTasks.push(this.tasks[i]);
            }
        }
        
        this.tasks = newTasks;
        
        if (this.tasks.length === initialLength) {
            console.error(`Task with id ${id} not found for deletion`);
            return;
        }

        this.renderTasks();
        this.updateStats();
    }

    public startEdit(id: TaskId): void {
        if (!this.findTaskById(id)) {
            console.error(`Task with id ${id} not found for editing`);
            return;
        }
        
        this.editingId = id;
        this.renderTasks();
    }

    public saveEdit(id: TaskId, newText: TaskText): void {
        const task = this.findTaskById(id);
        const validation = this.validateTaskInput(newText);
        
        if (task && validation === 'valid') {
            task.text = newText.trim();
            this.editingId = null;
            this.renderTasks();
        } else {
            this.handleValidationError(validation);
        }
    }

    public cancelEdit(): void {
        this.editingId = null;
        this.renderTasks();
    }

    //  FILTERING FUNCTIONS 

    private applyFilter(filter: FilterType): void {
        this.currentFilter = filter;
        this.renderTasks();
    }

    private getFilteredTasks(): Task[] {
        const result: Task[] = [];
        
        for (let i = 0; i < this.tasks.length; i++) {
            const task = this.tasks[i];
            
            if (this.shouldIncludeTask(task, this.currentFilter)) {
                result.push(task);
            }
        }
        
        return result;
    }

    private shouldIncludeTask(task: Task, filter: FilterType): boolean {
        switch (filter) {
            case FilterOption.COMPLETED:
                return task.status === TaskStatus.COMPLETED;
            case FilterOption.PENDING:
                return task.status === TaskStatus.PENDING;
            case FilterOption.ALL:
            default:
                return true;
        }
    }

    //  UTILITY FUNCTIONS 

    private findTaskById(id: TaskId): Task | null {
        for (let i = 0; i < this.tasks.length; i++) {
            if (this.tasks[i].id === id) {
                return this.tasks[i];
            }
        }
        return null;
    }

    private calculateStats(): TaskStats {
        let completed = 0;
        let pending = 0;
        
        // Array iteration with functions
        for (let i = 0; i < this.tasks.length; i++) {
            const task = this.tasks[i];
            if (task.status === TaskStatus.COMPLETED) {
                completed++;
            } else {
                pending++;
            }
        }
        
        return {
            total: this.tasks.length,
            completed: completed,
            pending: pending
        };
    }

    private getPriorityClass(priority: Priority): string {
        switch (priority) {
            case Priority.HIGH:
                return 'priority-high';
            case Priority.MEDIUM:
                return 'priority-medium';
            case Priority.LOW:
            default:
                return 'priority-low';
        }
    }

    //  RENDERING FUNCTIONS 

    private renderTasks(): void {
        console.log('Rendering tasks...');
        const filteredTasks = this.getFilteredTasks();
        console.log('Filtered tasks:', filteredTasks.length);

        if (filteredTasks.length === 0) {
            this.renderEmptyState();
            return;
        }

        this.hideEmptyState();
        this.renderTaskList(filteredTasks);
    }

    private renderEmptyState(): void {
        console.log('Rendering empty state');
        this.tasksList.innerHTML = '';
        this.emptyState.classList.add('show');
    }

    private hideEmptyState(): void {
        console.log('Hiding empty state');
        this.emptyState.classList.remove('show');
    }

    private renderTaskList(tasks: Task[]): void {
        console.log('Rendering task list with', tasks.length, 'tasks');
        const taskHTMLArray: string[] = [];
        
        // Array processing with functions
        for (let i = 0; i < tasks.length; i++) {
            taskHTMLArray.push(this.renderTaskItem(tasks[i]));
        }
        
        this.tasksList.innerHTML = taskHTMLArray.join('');
        console.log('Task list HTML updated');
    }

    private renderTaskItem(task: Task): string {
        if (this.editingId === task.id) {
            return this.renderEditingTask(task);
        }
        
        return this.renderNormalTask(task);
    }

    private renderEditingTask(task: Task): string {
        const escapedText = this.escapeHtml(task.text);
        
        return `
            <div class="task-item ${task.completed ? 'completed' : ''}">
                <input type="text" class="edit-input" value="${escapedText}" id="editInput-${task.id}">
                <div class="edit-actions">
                    <button class="save-btn" onclick="todoApp.saveEdit(${task.id}, document.getElementById('editInput-${task.id}').value)">
                        Save
                    </button>
                    <button class="cancel-btn" onclick="todoApp.cancelEdit()">
                        Cancel
                    </button>
                </div>
            </div>
        `;
    }

    private renderNormalTask(task: Task): string {
        const escapedText = this.escapeHtml(task.text);
        const statusIcon = task.status === TaskStatus.COMPLETED ? '✅' : '⏳';
        
        return `
            <div class="task-item ${task.completed ? 'completed' : ''}">
                <div class="task-checkbox ${task.completed ? 'checked' : ''}"
                     onclick="todoApp.toggleTask(${task.id})">
                </div>
                <div class="task-text">
                    <span class="status-icon">${statusIcon}</span>
                    ${escapedText}
                </div>
                <div class="task-actions">
                    <button class="edit-btn" onclick="todoApp.startEdit(${task.id})">
                        Edit
                    </button>
                    <button class="delete-btn" onclick="todoApp.deleteTask(${task.id})">
                        Delete
                    </button>
                </div>
            </div>
        `;
    }

    private escapeHtml(text: string): string {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    private updateStats(): void {
        console.log('Updating stats...');
        const stats = this.calculateStats();
        
        this.updateStatElement('totalTasks', stats.total);
        this.updateStatElement('completedTasks', stats.completed);
        this.updateStatElement('pendingTasks', stats.pending);
        
        console.log('Stats updated:', stats);
    }

    private updateStatElement(elementId: HTMLElementId, value: number): void {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = value.toString();
        }
    }

    private autoSaveToConsole(): void {
        console.log('Auto-saving tasks:', this.exportTasks());
    }

    //  PUBLIC API FUNCTIONS 

    public getTasks(): Task[] {
        return this.getTasksArray(); // Using base class method
    }

    public getTaskCount(): TaskStats {
        return this.calculateStats();
    }

    public clearAllTasks(): void {
        this.tasks = [];
        this.renderTasks();
        this.updateStats();
    }

    public exportTasks(): string {
        return JSON.stringify(this.tasks, null, 2);
    }

    public getConfig(): AppConfig {
        return this.config;
    }

    public updateConfig(newConfig: Partial<AppConfig>): void {
        this.config = { ...this.config, ...newConfig };
    }
}

//  UTILITY FUNCTIONS 

function createTaskManager(): TodoApp {
    return new TodoApp();
}

function getFilterOptions(): FilterOption[] {
    return [FilterOption.ALL, FilterOption.COMPLETED, FilterOption.PENDING];
}

function getPriorityLevels(): Priority[] {
    return [Priority.LOW, Priority.MEDIUM, Priority.HIGH];
}

// INITIALIZATION 

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const todoApp: TodoApp = createTaskManager();
    
    // Make it available globally for HTML onclick handlers
    (window as any).todoApp = todoApp;
});

// Fallback initialization if DOMContentLoaded has already fired
if (document.readyState === 'loading') {
    // DOM is still loading, event listener will handle it
} else {
    // DOM is already loaded
    const todoApp: TodoApp = createTaskManager();
    (window as any).todoApp = todoApp;
}