const form = document.querySelector('#form');
const BASE_URL = "https://jsonplaceholder.typicode.com/todos";
const todoArray = [];
const output = document.querySelector('#tasksOutput');
const todoInput = document.querySelector('#todo');
const whenInput = document.querySelector('#when');
const whereInput = document.querySelector('#where');
const description = document.querySelector('#description');
const submitBtn = document.querySelector('#submitBtn');
const errorMessage = document.querySelector('#errorMessage');


// GET TODOS FROM DATABASE

const getTodos = async () => {
    const res = await fetch(BASE_URL)
    const data = await res.json();

    todoArray.push(data)
    console.log(todoArray)
    return data;  
}

getTodos()
    .then(data => console.log('resolved:', data));
    
    

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

const handleSubmit = e => {
    e.preventDefault();

    
    const validateTodo = () => {
        if(todoInput.value === "") {
            console.log('Fel i todo')
            return setError(todoInput)
        }
        else {
            console.log('Bra i input')
            return setSuccess(todoInput)
        }
        
    }

    validateTodo();
    
    if(todoInput.classList.contains('error')) {
        console.log('sätt en toto')
        return false
    }

    // POST TODO TO DATABASE

    const newTodo = {
        completed: false,
        id: todoInput.id,
        title: todoInput.value,
        userId: 1
    }

    fetch(BASE_URL, {
        method: 'POST',
        body: JSON.stringify(newTodo),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })

    .then((response) => response.json())
    .then((data) => {
       todoArray.push(data)

    })



    console.log(todoArray)

}

submitBtn.addEventListener('click', handleSubmit)
