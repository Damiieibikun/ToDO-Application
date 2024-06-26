$(document).ready(() => {

$('#category-form').on('submit', function(e){
    e.preventDefault();
    let category = $('#category-input').val();
    let color = $('#color-picker').val();
    $('#chosen-colors').append(` <div class="chosen-color flex-col align-center">
                        <div class="color-div-sm" style="background-color: ${color};"></div>
                        <p id="category-name-sm">${category}</p>
                    </div>`)

    $('#category-list').append(` <div class="chosen-color flex align-center gap-30">
        <div class="color-div" style="background-color: ${color};"></div>
        <p id="category-name">${category}</p>
    </div>`)

    $('#add-new-task').css('display', 'flex')

    $('#availiable-categories').append(`<div class="chosen-color flex align-center gap-10">
        <div class="color-div-sm" style="background-color: ${color};"></div>
        <p id="category-name-sm">${category}</p>
        <input type="checkbox" name="" id="selected-cat" />
    </div>`)

    $('#category-form')[0].reset()
})

$('#close').on('click', function(){
    $('#add-categories').hide()
})

$('#open-cat').click(function(){
    $('#add-categories').show()
})

$('#add-new-task').click(function(){
    $('#add-tasks').show();
})


$('#task-form').on('submit', function(e){
    e.preventDefault()
    
    let taskTitle = $('#task-title').val();
    let taskDescription = $('#task-details').val();
    $('#todo-items').append(`<div class="task-card">
                <div style="text-align: end;" class="dropdown-edit-delete">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-three-dots-vertical" viewBox="0 0 16 16">
                        <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
                      </svg>
                </div>
                <p class="task-title">${taskTitle}</p>
                <p class="task-description">${taskDescription}</p>
                <div style="text-align: end;">
                    <input type="checkbox" name="" class="check-task"> <span class="done">Done</span>
                </div>
                
            </div>
        `)

        $('#task-form')[0].reset()
})

$('#close-task').on('click', function(){
    $('#add-tasks').hide()
})


})