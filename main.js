var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
//  ENUMS 
var TaskStatus;
(function (TaskStatus) {
    TaskStatus["PENDING"] = "pending";
    TaskStatus["COMPLETED"] = "completed";
})(TaskStatus || (TaskStatus = {}));
var FilterOption;
(function (FilterOption) {
    FilterOption["ALL"] = "all";
    FilterOption["COMPLETED"] = "completed";
    FilterOption["PENDING"] = "pending";
})(FilterOption || (FilterOption = {}));
var Priority;
(function (Priority) {
    Priority[Priority["LOW"] = 1] = "LOW";
    Priority[Priority["MEDIUM"] = 2] = "MEDIUM";
    Priority[Priority["HIGH"] = 3] = "HIGH";
})(Priority || (Priority = {}));
// CLASSES
// Base class for Task operations
var TaskManager = /** @class */ (function () {
    function TaskManager() {
        this.tasks = [];
    }
    // Function using arrays
    TaskManager.prototype.getTasksArray = function () {
        var result = [];
        for (var i = 0; i < this.tasks.length; i++) {
            result.push(this.tasks[i]);
        }
        return result;
    };
    return TaskManager;
}());
// Main application class (OOP concepts)
var TodoApp = /** @class */ (function (_super) {
    __extends(TodoApp, _super);
    function TodoApp() {
        var _this = _super.call(this) || this; // OOP inheritance
        _this.currentFilter = FilterOption.ALL;
        _this.editingId = null;
        // Initialize configuration
        _this.config = {
            maxTaskLength: 200,
            autoSave: true,
            defaultPriority: Priority.MEDIUM
        };
        // Initialize DOM elements with error handling
        try {
            // Direct assignment now that properties are not readonly
            _this.taskInput = _this.getElementById('taskInput');
            _this.addBtn = _this.getElementById('addBtn');
            _this.tasksList = _this.getElementById('tasksList');
            _this.emptyState = _this.getElementById('emptyState');
            _this.filterBtns = document.querySelectorAll('.filter-btn');
            console.log('DOM elements initialized successfully');
            _this.initializeEventListeners();
            _this.renderTasks();
            _this.updateStats();
        }
        catch (error) {
            console.error('Failed to initialize TodoApp:', error);
        }
        return _this;
    }
    //  HELPER FUNCTIONS
    TodoApp.prototype.getElementById = function (id) {
        var element = document.getElementById(id);
        if (!element) {
            throw new Error("Element with id \"".concat(id, "\" not found"));
        }
        return element;
    };
    TodoApp.prototype.generateUniqueId = function () {
        return Date.now() + Math.random();
    };
    // Function demonstrating enums and type aliases
    TodoApp.prototype.createNewTask = function (text) {
        return {
            id: this.generateUniqueId(),
            text: text,
            completed: false,
            status: TaskStatus.PENDING,
            priority: this.config.defaultPriority,
            createdAt: new Date()
        };
    };
    // VALIDATION FUNCTIONS 
    TodoApp.prototype.validateTaskInput = function (text) {
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
    };
    //  EVENT LISTENERS 
    TodoApp.prototype.initializeEventListeners = function () {
        var _this = this;
        console.log('Setting up event listeners...');
        // Direct call to addTask method
        this.addBtn.addEventListener('click', function () {
            console.log('Add button clicked');
            _this.addTask(_this.taskInput.value);
        });
        this.taskInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                console.log('Enter key pressed');
                _this.addTask(_this.taskInput.value);
            }
        });
        var _loop_1 = function (i) {
            var btn = this_1.filterBtns[i];
            btn.addEventListener('click', function () {
                _this.setActiveFilter(btn);
                var filter = _this.getFilterFromButton(btn);
                _this.applyFilter(filter);
            });
        };
        var this_1 = this;
        // Filter button listeners
        for (var i = 0; i < this.filterBtns.length; i++) {
            _loop_1(i);
        }
        console.log('Event listeners set up successfully');
    };
    TodoApp.prototype.getFilterFromButton = function (btn) {
        var filterValue = btn.dataset.filter;
        switch (filterValue) {
            case 'completed':
                return FilterOption.COMPLETED;
            case 'pending':
                return FilterOption.PENDING;
            case 'all':
            default:
                return FilterOption.ALL;
        }
    };
    TodoApp.prototype.setActiveFilter = function (activeBtn) {
        for (var i = 0; i < this.filterBtns.length; i++) {
            this.filterBtns[i].classList.remove('active');
        }
        activeBtn.classList.add('active');
    };
    //  CORE FUNCTIONALITY FUNCTIONS 
    // Override abstract method from base class
    TodoApp.prototype.addTask = function (text) {
        console.log('addTask called with:', text);
        var validation = this.validateTaskInput(text);
        if (validation !== 'valid') {
            this.handleValidationError(validation);
            return;
        }
        var newTask = this.createNewTask(text.trim());
        console.log('Created new task:', newTask);
        this.tasks.unshift(newTask); // Array operation
        console.log('Tasks array now has', this.tasks.length, 'items');
        this.taskInput.value = '';
        this.renderTasks();
        this.updateStats();
        if (this.config.autoSave) {
            this.autoSaveToConsole();
        }
    };
    TodoApp.prototype.handleValidationError = function (error) {
        switch (error) {
            case 'empty':
                console.warn('Task text cannot be empty');
                alert('Please enter a task!');
                break;
            case 'too_long':
                console.warn("Task text too long (max ".concat(this.config.maxTaskLength, " characters)"));
                alert("Task too long! Maximum ".concat(this.config.maxTaskLength, " characters."));
                break;
            case 'invalid':
                console.warn('Invalid task input');
                alert('Invalid task input!');
                break;
        }
    };
    TodoApp.prototype.toggleTask = function (id) {
        console.log('Toggling task:', id);
        var task = this.findTaskById(id);
        if (task) {
            task.completed = !task.completed;
            task.status = task.completed ? TaskStatus.COMPLETED : TaskStatus.PENDING;
            this.renderTasks();
            this.updateStats();
        }
        else {
            console.error("Task with id ".concat(id, " not found"));
        }
    };
    // Override abstract method from base class
    TodoApp.prototype.deleteTask = function (id) {
        console.log('Deleting task:', id);
        var initialLength = this.tasks.length;
        var newTasks = [];
        // Array manipulation using functions
        for (var i = 0; i < this.tasks.length; i++) {
            if (this.tasks[i].id !== id) {
                newTasks.push(this.tasks[i]);
            }
        }
        this.tasks = newTasks;
        if (this.tasks.length === initialLength) {
            console.error("Task with id ".concat(id, " not found for deletion"));
            return;
        }
        this.renderTasks();
        this.updateStats();
    };
    TodoApp.prototype.startEdit = function (id) {
        if (!this.findTaskById(id)) {
            console.error("Task with id ".concat(id, " not found for editing"));
            return;
        }
        this.editingId = id;
        this.renderTasks();
    };
    TodoApp.prototype.saveEdit = function (id, newText) {
        var task = this.findTaskById(id);
        var validation = this.validateTaskInput(newText);
        if (task && validation === 'valid') {
            task.text = newText.trim();
            this.editingId = null;
            this.renderTasks();
        }
        else {
            this.handleValidationError(validation);
        }
    };
    TodoApp.prototype.cancelEdit = function () {
        this.editingId = null;
        this.renderTasks();
    };
    //  FILTERING FUNCTIONS 
    TodoApp.prototype.applyFilter = function (filter) {
        this.currentFilter = filter;
        this.renderTasks();
    };
    TodoApp.prototype.getFilteredTasks = function () {
        var result = [];
        for (var i = 0; i < this.tasks.length; i++) {
            var task = this.tasks[i];
            if (this.shouldIncludeTask(task, this.currentFilter)) {
                result.push(task);
            }
        }
        return result;
    };
    TodoApp.prototype.shouldIncludeTask = function (task, filter) {
        switch (filter) {
            case FilterOption.COMPLETED:
                return task.status === TaskStatus.COMPLETED;
            case FilterOption.PENDING:
                return task.status === TaskStatus.PENDING;
            case FilterOption.ALL:
            default:
                return true;
        }
    };
    //  UTILITY FUNCTIONS 
    TodoApp.prototype.findTaskById = function (id) {
        for (var i = 0; i < this.tasks.length; i++) {
            if (this.tasks[i].id === id) {
                return this.tasks[i];
            }
        }
        return null;
    };
    TodoApp.prototype.calculateStats = function () {
        var completed = 0;
        var pending = 0;
        // Array iteration with functions
        for (var i = 0; i < this.tasks.length; i++) {
            var task = this.tasks[i];
            if (task.status === TaskStatus.COMPLETED) {
                completed++;
            }
            else {
                pending++;
            }
        }
        return {
            total: this.tasks.length,
            completed: completed,
            pending: pending
        };
    };
    TodoApp.prototype.getPriorityClass = function (priority) {
        switch (priority) {
            case Priority.HIGH:
                return 'priority-high';
            case Priority.MEDIUM:
                return 'priority-medium';
            case Priority.LOW:
            default:
                return 'priority-low';
        }
    };
    //  RENDERING FUNCTIONS 
    TodoApp.prototype.renderTasks = function () {
        console.log('Rendering tasks...');
        var filteredTasks = this.getFilteredTasks();
        console.log('Filtered tasks:', filteredTasks.length);
        if (filteredTasks.length === 0) {
            this.renderEmptyState();
            return;
        }
        this.hideEmptyState();
        this.renderTaskList(filteredTasks);
    };
    TodoApp.prototype.renderEmptyState = function () {
        console.log('Rendering empty state');
        this.tasksList.innerHTML = '';
        this.emptyState.classList.add('show');
    };
    TodoApp.prototype.hideEmptyState = function () {
        console.log('Hiding empty state');
        this.emptyState.classList.remove('show');
    };
    TodoApp.prototype.renderTaskList = function (tasks) {
        console.log('Rendering task list with', tasks.length, 'tasks');
        var taskHTMLArray = [];
        // Array processing with functions
        for (var i = 0; i < tasks.length; i++) {
            taskHTMLArray.push(this.renderTaskItem(tasks[i]));
        }
        this.tasksList.innerHTML = taskHTMLArray.join('');
        console.log('Task list HTML updated');
    };
    TodoApp.prototype.renderTaskItem = function (task) {
        if (this.editingId === task.id) {
            return this.renderEditingTask(task);
        }
        return this.renderNormalTask(task);
    };
    TodoApp.prototype.renderEditingTask = function (task) {
        var escapedText = this.escapeHtml(task.text);
        return "\n            <div class=\"task-item ".concat(task.completed ? 'completed' : '', "\">\n                <input type=\"text\" class=\"edit-input\" value=\"").concat(escapedText, "\" id=\"editInput-").concat(task.id, "\">\n                <div class=\"edit-actions\">\n                    <button class=\"save-btn\" onclick=\"todoApp.saveEdit(").concat(task.id, ", document.getElementById('editInput-").concat(task.id, "').value)\">\n                        Save\n                    </button>\n                    <button class=\"cancel-btn\" onclick=\"todoApp.cancelEdit()\">\n                        Cancel\n                    </button>\n                </div>\n            </div>\n        ");
    };
    TodoApp.prototype.renderNormalTask = function (task) {
        var escapedText = this.escapeHtml(task.text);
        var statusIcon = task.status === TaskStatus.COMPLETED ? '✅' : '⏳';
        return "\n            <div class=\"task-item ".concat(task.completed ? 'completed' : '', "\">\n                <div class=\"task-checkbox ").concat(task.completed ? 'checked' : '', "\"\n                     onclick=\"todoApp.toggleTask(").concat(task.id, ")\">\n                </div>\n                <div class=\"task-text\">\n                    <span class=\"status-icon\">").concat(statusIcon, "</span>\n                    ").concat(escapedText, "\n                </div>\n                <div class=\"task-actions\">\n                    <button class=\"edit-btn\" onclick=\"todoApp.startEdit(").concat(task.id, ")\">\n                        Edit\n                    </button>\n                    <button class=\"delete-btn\" onclick=\"todoApp.deleteTask(").concat(task.id, ")\">\n                        Delete\n                    </button>\n                </div>\n            </div>\n        ");
    };
    TodoApp.prototype.escapeHtml = function (text) {
        var div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    };
    TodoApp.prototype.updateStats = function () {
        console.log('Updating stats...');
        var stats = this.calculateStats();
        this.updateStatElement('totalTasks', stats.total);
        this.updateStatElement('completedTasks', stats.completed);
        this.updateStatElement('pendingTasks', stats.pending);
        console.log('Stats updated:', stats);
    };
    TodoApp.prototype.updateStatElement = function (elementId, value) {
        var element = document.getElementById(elementId);
        if (element) {
            element.textContent = value.toString();
        }
    };
    TodoApp.prototype.autoSaveToConsole = function () {
        console.log('Auto-saving tasks:', this.exportTasks());
    };
    //  PUBLIC API FUNCTIONS 
    TodoApp.prototype.getTasks = function () {
        return this.getTasksArray(); // Using base class method
    };
    TodoApp.prototype.getTaskCount = function () {
        return this.calculateStats();
    };
    TodoApp.prototype.clearAllTasks = function () {
        this.tasks = [];
        this.renderTasks();
        this.updateStats();
    };
    TodoApp.prototype.exportTasks = function () {
        return JSON.stringify(this.tasks, null, 2);
    };
    TodoApp.prototype.getConfig = function () {
        return this.config;
    };
    TodoApp.prototype.updateConfig = function (newConfig) {
        this.config = __assign(__assign({}, this.config), newConfig);
    };
    return TodoApp;
}(TaskManager));
//  UTILITY FUNCTIONS 
function createTaskManager() {
    return new TodoApp();
}
function getFilterOptions() {
    return [FilterOption.ALL, FilterOption.COMPLETED, FilterOption.PENDING];
}
function getPriorityLevels() {
    return [Priority.LOW, Priority.MEDIUM, Priority.HIGH];
}
// INITIALIZATION 
// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    var todoApp = createTaskManager();
    // Make it available globally for HTML onclick handlers
    window.todoApp = todoApp;
});
// Fallback initialization if DOMContentLoaded has already fired
if (document.readyState === 'loading') {
    // DOM is still loading, event listener will handle it
}
else {
    // DOM is already loaded
    var todoApp = createTaskManager();
    window.todoApp = todoApp;
}
