$(document).ready(readyNow);

function readyNow() {
    console.log('js/jquery ready');
    refreshToDo();
    $('#submit-btn').on('click', handlePostPackage);
    $('#display-tasks').on('click', '.delete-btn', handleDelete);
    $('#display-tasks').on('click', '.complete-btn', handleComplete);

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

//renders tasks to dom
function appendToDo(todo) {
    $('#display-tasks').empty();

    for (let tasks of todo) {
        let finished = 'No';
        if (tasks.completion === true) {
            finished = 'Yes'

            $('#display-tasks').append(`
            <tr>
                <td> ${tasks.task}</td>
                <td> ${tasks.category}</td>
                <td> ${finished}</td>
                <td> ${tasks.date_completed}</td>
               <td> <button class="complete-btn">Complete</button></td>
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

function handlePostPackage(evt){
    evt.preventDefault();
    let newTask = {}
    newTask.task = $('#task').val();
    newTask.category = $('#category').val();

    console.log(newTask);

    addTask(newTask);

    $('#task').val('');
    $('#category').val('');
}

function addTask(task){

    $.ajax({
        type: 'POST',
        url: '/toDo',
        data: task
     })
    .then((response) =>{
         console.log('response from server', response);
         refreshToDo();
     })
    .catch((err) =>{
        console.log('unable to add task', err);
    })
}

function handleDelete() {
    let taskId = $(this).data('id');

    $.ajax({
        method: 'DELETE',
        url: `/toDo/${taskId}`
    })
    .then(()=>{
      console.log('delete success');
      refreshToDo();
    })
    .catch((err) =>{
        console.log('error deleting', err);
    })
}

function handleComplete() {

    $('#complete-div').append(`
        <label>Date Completed</label>
        <input type="date">
        <button class="submit-btn">Submit</button>
    `)
}