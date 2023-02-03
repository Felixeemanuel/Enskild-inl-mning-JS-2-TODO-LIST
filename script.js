const form = document.querySelector('#form');
const BASE_URL = "https://jsonplaceholder.typicode.com/todos/";
const todoArray = [];
const output = document.querySelector('#tasksOutput');
const todoInput = document.querySelector('#todo');
const whenInput = document.querySelector('#when');
const whereInput = document.querySelector('#where');
const description = document.querySelector('#description');
const submitBtn = document.querySelector('#submitBtn');
const errorMessage = document.querySelector('#errorMessage');
const modal = document.querySelector('#modal');
const modalBtn = document.querySelector('#modalBtn');
const main = document.querySelector('#main');
const id = todoArray.length + 1;

// GET TODOS FROM DATABASE

const getTodos = async () => {

    const res = await fetch("https://jsonplaceholder.typicode.com/todos?_limit=7")
    const todo = await res.json();

    // PUSH EVERY TODO INTO THE ARRAY

    todo.forEach(todo => {
        todoArray.push(todo)
        
    })

    // RUN LIST-TODO FUNCTION TO PUSH EVERY NEW TODO INTO THE ARRAY

    listTodos()
 
}

getTodos()

// COOL ANIMATIONS FOR THE EYE

gsap.timeline()
    .from('main', {scale: 0.6, opacity: 0, duration: .8, ease: "back"})
    .from('form', {xPercent: -50, opacity: 0, duration: .6, ease: 'Power1.out'}, "<.5")
    .from('.tasks-section h1', {opacity: 0, yPercent: -200, duration: .8, ease: "bounce.out"}, "<")


// FUNCTION TO APPEND ALL NEW CREATED TODOS

const listTodos = () => {

    todoArray.forEach(todo => {
        const todoElement = createTodoElement(todo)
        output.appendChild(todoElement)
    })
}

// CREATE TODO ELEMENTS TO SHOW ON SCREEN

const createTodoElement = (todoData) => {

    let todo = document.createElement('div');
    todo.classList.add('todo_container');
    todo.id = todoData.id

    let todoInfo = document.createElement('div')
    todoInfo.classList.add('todo_info')

    let todoTitle = document.createElement('h2')
    todoTitle.innerText = todoData.title

    let todoWhen = document.createElement('p')
    todoWhen.innerText = whenInput.value

    let todoWhere = document.createElement('p')
    todoWhere.innerText = whereInput.value

    let todoDescription = document.createElement('div')
    todoDescription.classList.add('todo_description')
    
    let todoDescriptionText = document.createElement('p')
    todoDescriptionText.innerText = description.value

    let todoButtonContainer = document.createElement('div')
    todoButtonContainer.classList.add('todo_button_wrapper')


    // CREATE BUTTON TO CHANGE COMPLETED STATUS
    let todoButton = document.createElement('button')
    todoButton.classList.add('todo_button')
    todoButton.innerHTML = '&#x2713;'

    // FUNCTION TO CHANGE COMPLETED: FALSE/TRUE
    const changeStatus = e => {

        todoData = e;

        idUrl = BASE_URL + todoData.id

        let changeStatus = {
            completed: !todoData.completed
        }

        let statusOptions = {
            method: 'PATCH',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify(changeStatus)
        }

        try{
            fetch(idUrl, statusOptions)

            .then(res => res.json())
            .then(data => {
                console.log(data)
                console.log(data.completed)
                todoData.completed = data.completed
            })
        }
        catch(err) {
            console.log(error)
        }

    }

    // RUN PREVIOUS FUNCTION WHEN CLICKING TODO-BUTTON
    todoButton.addEventListener('click', () => {

        // TOGGLE CLASS TO SHOW IF DONE / NOT DONE
        todo.classList.toggle('done')

        // CHANGE ICON INSIDE THE BUTTON IF DONE / NOT DONE
        if (todo.classList.contains('done')) {
            todoButton.innerHTML = '&#8634'
        } else {
            todoButton.innerHTML = '&#x2713';
        }

        changeStatus(todoData)
    })


    let trash = document.createElement('i')
    trash.classList.add('fa-solid')
    trash.classList.add('fa-trash')

    // APPEND ALL ELEMENTS INSIDE THE TODO
    todo.appendChild(todoInfo)
    todoInfo.appendChild(todoTitle)
    todoInfo.appendChild(todoWhen)
    todoInfo.appendChild(todoWhere)
    todo.appendChild(todoDescription)
    todoDescription.appendChild(todoDescriptionText)
    todo.appendChild(todoButtonContainer)
    todoButtonContainer.appendChild(todoButton)
    todoButtonContainer.appendChild(trash)

    // ALL TODOS WITH COMPLETED: TRUE GET THE 'DONE'-CLASS
    if (todoData.completed === true) {
        todo.classList.add('done')
        todoButton.innerHTML = '&#8634'
    }

    return todo
}

// MAKE MODAL POPUP DISSAPEAR
modalBtn.addEventListener('click', () => {
    gsap.to('#modal', {opacity: 0, scale: 0, duration: .3})
    main.style.filter = 'blur(0px)'
    main.style.pointerEvents = 'all'
})

// REMOVE TODO FUNCTION
const removeTodo = e => {

        fetch(BASE_URL + e.target.parentElement.parentElement.id, {
            method: 'DELETE',
        })
        .then(res => {

            // CHECK IF E.TARGET CONTAINS CLASS 'FA-TRASH' AND PARENTELEMENT CONTAINS CLASS 'DONE' TO SUCCESSFULLY REMOVE THE ELEMENT
            if(res.ok && e.target.classList.contains('fa-trash') && e.target.parentElement.parentElement.classList.contains('done')) {
                e.target.parentElement.parentElement.remove()

                // ALSE REMOVE IT FROM THE ARRAY
                const todoIndex = todoArray.findIndex(todo => todo.id == e.target.parentElement.parentElement.id)
                todoArray.splice(todoIndex, 1)
                console.log(todoArray)

                // IF IT DOESN'T CONTAIN 'DONE', SHOW POPUP MODAL
            } else if (res.ok && e.target.classList.contains('fa-trash') && !e.target.parentElement.parentElement.classList.contains('done')) {
                gsap.fromTo( "#modal", {scale: 0, opacity: 0}, {scale: 1, opacity: 1, ease: "power3.out", duration: .3})
                modal.style.visibility = 'visible'
                main.style.filter = 'blur(5px)'
                main.style.pointerEvents = 'none'
            }
        })
    
}

output.addEventListener('click', removeTodo)

// FUNCTIONS FOR INPUT VALIDATION
const setSuccess = (input) => {
    input.classList.remove('error')
    input.classList.add('success')
    return true
}
const setError = (input) => {
    input.classList.add('error')
    input.classList.remove('success')
    return false
}

// HANDLE ADD BUTTON EVENT
const handleSubmit = e => {
    e.preventDefault();

    // VALIDATE FORM
    const validateTodo = () => {
        if(todoInput.value === "") {
            errorMessage.style.display = 'block'
            console.log('Fel i todo')
            return setError(todoInput)
        }
        else {

            errorMessage.style.display = 'none'
            return setSuccess(todoInput)
        }
        
    }

    validateTodo();
    
    // IF WE HAVE AN ERROR, JUMP OUT OF THE FUNCTION AND RETURN FALSE
    if(todoInput.classList.contains('error')) {
        console.log('sätt en toto')
        return false
    }

    // POST TODO TO DATABASE
    const newTodo = {
        userId: 11,
        id: id,
        title: todoInput.value,
        completed: false,
    }

    fetch(BASE_URL, {
        method: 'POST',
        body: JSON.stringify(newTodo),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
    .then((response) => response.json())
    .then(data => {
        // PUSH NEW DATA TO ARRAY
       todoArray.push(data)
       console.log(todoArray)
       
       // CREATE NEW ELEMENT WITH THE DATA
       const todoElement = createTodoElement(data)
        output.appendChild(todoElement)
        console.log(todoElement.id)
    })
}

submitBtn.addEventListener('click', handleSubmit)
