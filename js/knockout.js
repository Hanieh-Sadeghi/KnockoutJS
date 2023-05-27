const todoInput = document.getElementById("todo-input");

// View Model
const VM = {
    // All saved todos
    todos: ko.observableArray([]),

    // Input value
    todoText: ko.observable(""),

    // For edit todo
    acceptInput: ko.observable(true),

    addTodo: function () {
        if (this.acceptInput() && todoInput.value) {
            VM.todos.push(new addNewTodo(VM.todoText()));
            VM.todoText("");
        }
    },
    todosFilter: ko.observable("all"), // all - active - completed

    pending: function () {
        if (this.todosFilter() === "all") {
            return "";
        } else {
            return this.todosFilter();
        }
    },
    todosFilterAll: function () {
        console.log("all");
        this.todosFilter("all");
    },
    todosFilterActive: function () {
        console.log("active");
        this.todosFilter("active");
    },
    todosFilterCompleted: function () {
        console.log("completed");
        this.todosFilter("completed");
    },

    clearAll: function () {
        this.todos(
            this.todos().filter(function (todo) {
                return !VM.showTodos().includes(todo);
            })
        );
    },

    // Only if showTodos is empty
    addBr: function () {
        if (!VM.showTodos().length) {
            return "<br>";
        }
    },
};

// Obj constructor for addTodo
function addNewTodo(todoText) {
    this.todoText = todoText;
    this.isActive = ko.observable(true);
    this.editTodo = function () {
        todoInput.value = this.todoText;
        VM.acceptInput(false);
        document.getElementById("add-btn").addEventListener(
            "click",
            function () {
                this.todoText = todoInput.value;
                VM.acceptInput(true);
                console.log(this.todoText, todoInput.value);
            },
            { once: true }
        );
    };
    this.changeCompleteState = function () {
        this.isActive(!this.isActive());
    };
    this.deleteTodo = function () {
        VM.todos.remove(this);
    };

    // Log changes in todo's isActive
    this.isActive.subscribe(function (value) {
        console.log(todoText, "=>", value);
    });
}

VM.showTodos = ko.computed(function () {
    let filteredList = function () {
        switch (VM.todosFilter()) {
            case "active":
                return VM.todos().filter(function (todo) {
                    return todo.isActive();
                });
            case "completed":
                return VM.todos().filter(function (todo) {
                    return !todo.isActive();
                });
            default:
                return VM.todos();
        }
    };

    console.log(filteredList());

    // New todo placed at the top of the list
    return filteredList().slice(0).reverse();
});

// remaining task text
taskTasks = ko.computed(function () {
    let output = "";
    if (VM.showTodos().length == 1) {
        output += "task";
    } else {
        output += "tasks";
    }
    if (VM.todosFilter() === "all") {
        output += " in total";
    }
    return output;
});

ko.applyBindings(VM);
