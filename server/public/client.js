$(document).ready(readyNow);

function readyNow() {
    console.log('js/jquery ready');
    refreshToDo();
    $('#submit-btn').on('click', handlePostPackage);
    $('#display-tasks').on('click', '.delete-btn', handleDelete);
    $('#display-tasks').on('click', '.complete-btn', handleComplete);
    $('#complete-div').on('click', '.submit-btn', handlePut)
}

//gets all tasks from server and calls appendToDo to render them on dom
function refreshToDo() {
    $.ajax({
        type: 'GET',
        url: '/toDo'
    }).then((response) => {
        console.log('in get', response);
        appendToDo(response);
    }).catch((err) => {
        console.log('get err', err)
    });
}

//renders tasks to dom first checks if completed or not
//then renders accordingly
function appendToDo(todo) {
    $('#display-tasks').empty();

    for (let tasks of todo) {
        let finished = 'No';
        if (tasks.completion === true) {
            finished = 'Yes';
            let date = new Date(tasks.date_completed).toLocaleDateString();
            
            
            $('#display-tasks').append(`
            <tr class="table-success">
                <td> ${tasks.task}</td>
                <td> ${tasks.category}</td>
                <td> ${finished}</td>
                <td> Completed on: ${date}</td>
               <td> <button data-id="${tasks.id}" class="delete-btn">Remove </button> </td>
            </tr>
        `)
        }
        else {
            $('#display-tasks').append(`
            <tr>
                <td> ${tasks.task}</td>
                <td> ${tasks.category}</td>
                <td> ${finished}</td>
               <td> <button data-id="${tasks.id}" class="complete-btn">Complete</button></td>
               <td> <button data-id="${tasks.id}" class="delete-btn">Remove</button></td>
            </tr>
        `)
        }
    }

}

//on submit task packages up data to send to server
function handlePostPackage(evt) {
    evt.preventDefault();
    let newTask = {}
    newTask.task = $('#task').val();
    newTask.category = $('#category').val();

    console.log(newTask);

    addTask(newTask);

    $('#task').val('');
    $('#category').val('');
}

//handles post to server first verifies all inputs have been filled in
function addTask(task) {

    if (task.task === '' || task.category === null){
        alert('Please fill out all input fields!');
        return false;
    }

    $.ajax({
        type: 'POST',
        url: '/toDo',
        data: task
    })
        .then((response) => {
            console.log('response from server', response);
            refreshToDo();
        })
        .catch((err) => {
            console.log('unable to add task', err);
        })
}

//handles deleting task sends delete request to server
function handleDelete() {
    let taskId = $(this).data('id');

    $.ajax({
        method: 'DELETE',
        url: `/toDo/${taskId}`
    })
        .then(() => {
            console.log('delete success');
            refreshToDo();
        })
        .catch((err) => {
            console.log('error deleting', err);
        })
}

//handles complete btn press 
//renders new input field to dom 
function handleComplete() {
    let taskId = $(this).data('id');
    $('#complete-div').empty();
    $('#complete-div').append(`<div class="alert alert-dark">
        <label>Date Completed</label>
        <input id="date-completed" type="date">
        <button data-id="${taskId}" class="submit-btn">Submit</button>
    </div>`)
}


//grabs completion date and sends put request to server
function handlePut() {
    let taskId = $(this).data('id');
    console.log(taskId);

    const dateComplete = { date: $('#date-completed').val() };

    $.ajax({
        method: 'PUT',
        url: `/toDo/${taskId}`,
        data: dateComplete
    })
        .then(res => {
            console.log('PUT success');
            $('#complete-div').empty();
            refreshToDo();
        })
        .catch(err => {

            console.log('PUT failed: ', err);
        });

}