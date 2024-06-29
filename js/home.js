$(document).ready(() => {
  // get request
  //populate page with categories already created

  let todoCategories =
    JSON.parse(localStorage.getItem("todo-categories")) || [];

  if (todoCategories.length !== 0) {
    $("#add-new-task").css("display", "flex");
  } else {
    $("#add-new-task").css("display", "none");
  }
  todoCategories.forEach((element) => {
    $("#category-list").append(`
     
      <div class="color-div" style="background-color: ${element.color};"></div>
   
      <p id="category-name">${element.category}</p>
  `);

    // get request
    // add availiable categories to task form
    $("#availiable-categories")
      .append(`<div class="chosen-color flex align-center gap-10">
<div class="color-div-sm" style="background-color: ${element.color};"></div>
<p id="category-name-sm">${element.category}</p>
<input type="checkbox" name="checkbox" class="selected-cat" />
</div>`);
  });

  // get request
  //populate page with tasks already created
  let todoTasks = JSON.parse(localStorage.getItem("todo-tasks")) || [];
  todoTasks.forEach((element, i) => {
    let checkedValue = null;
    if (element.done) {
      checkedValue = "checked";
    }
    // create a new card
    let newCard = $(`<div class="task-card" data-id = ${i}>
            <div style="text-align: end;" class="dropdown-edit-delete">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-three-dots dropdown-edit-delete-icon" viewBox="0 0 16 16">
<path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3"/>
</svg>
<div class="dropdown-edit-delete-list">
                    <div class="edit">Edit..</div>
                    <div class="delete">Delete..</div>
                  </div>
            </div>
            <p class="task-title">${element.title}</p>
            <p class="task-description">${element.description}</p>
            <div style="text-align: end;">
                <input type="checkbox" name="" class="check-task" ${checkedValue}> <span class="done">Done</span>
            </div>
            <div class="flex gap-10 color-list-chosen">
                </div>
        </div>
    `);

    // append to page
    $("#todo-items").append(newCard);

    // add colors chosen to page
    for (var i of element.colors) {
      newCard.find(".color-list-chosen").append(`
                    <div class="color-div-md" style="background-color: ${i}"></div>`);
    }
  });

  // creating new category
  $("#category-form").on("submit", function (e) {
    e.preventDefault();

    if ($("#category-input").val() === "") {
      $("#cat-error").css("display", "block");
      $("#category-input").addClass("wrong-format");
    } else {
      $("#cat-error").css("display", "none");
      $("#category-input").removeClass("wrong-format");

      // make get request
      let category = $("#category-input").val();
      let color = $("#color-picker").val();

      //  populate categories list

      $("#chosen-colors")
        .append(` <div class="chosen-color flex-col align-center">
                      <div class="color-div-sm" style="background-color: ${color};"></div>
                      <p id="category-name-sm">${category}</p>
                  </div>`);

      $("#category-list").append(`
      <div class="color-div" style="background-color: ${color};"></div>
      <p id="category-name">${category}</p>
  `);

      $("#add-new-task").css("display", "flex");

      $("#availiable-categories")
        .append(`<div class="chosen-color flex align-center gap-10">
          <div class="color-div-sm" style="background-color: ${color};"></div>
          <p id="category-name-sm">${category}</p>
          <input type="checkbox" name="checkbox" class="selected-cat" />
      </div>`);

      $("#category-form")[0].reset();

      // make post request to api?
      todoCategories.push({
        category: category,
        color: color,
      });
      // add to local storage/ make post request
      localStorage.setItem("todo-categories", JSON.stringify(todoCategories));
    }
  });

  $("#add-new-task").click(function () {
    $("#add-tasks").show();
  });

  // filtering through categories may need api

  $(document).on("click", ".color-div", function () {
    let color = $(this).css("background-color");

    //get request

    todoTasks.forEach((element, i) => {
      if (element.colors.includes(color) === false) {
        $(`[data-id=${i}]`).toggle();
      }
    });
  });

  //open and close new categories and new tasks
  $("#close").on("click", function () {
    $("#add-categories").hide();
  });

  $("#open-cat").click(function () {
    $("#add-categories").show();
  });

  $("#close-task").on("click", function () {
    $("#add-tasks").hide();
  });

  // adding new todo sticky notes
  $("#task-form").on("submit", function (e) {
    // e.preventDefault();

    if ($("#task-title").val() === "") {
      $("#task-title").addClass("wrong-format");
      $("#add-task-error").text("Enter a title");
      $("#add-task-error").css("display", "block");
      e.preventDefault();
    } else if ($("#task-details").val() === "") {
      $("#task-details").addClass("wrong-format");
      $("#task-title").removeClass("wrong-format");
      $("#add-task-error").text("Enter a Description");
      $("#add-task-error").css("display", "block");
      e.preventDefault();
    } else {
      $("#task-title").removeClass("wrong-format");
      $("#task-details").removeClass("wrong-format");

      let taskTitle = $("#task-title").val();
      let taskDescription = $("#task-details").val();

      // create a new card
      let newCard = $(`<div class="task-card">
              <div style="text-align: end;" class="dropdown-edit-delete">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-three-dots dropdown-edit-delete-icon" viewBox="0 0 16 16">
<path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3"/>
</svg>
<div class="dropdown-edit-delete-list">
                      <div class="edit">Edit..</div>
                      <div class="delete">Delete..</div>
                    </div>
              </div>
              <p class="task-title">${taskTitle}</p>
              <p class="task-description">${taskDescription}</p>
              <div style="text-align: end;">
                  <input type="checkbox" name="" class="check-task"> <span class="done">Done</span>
              </div>
              <div class="flex gap-10 color-list-chosen">
                  </div>
          </div>
      `);

      // make get request here
      $("#todo-items").append(newCard);
      let chosenColorsTask = [];
      for (var i of $("#task-form").find(".selected-cat")) {
        if (i.checked) {
          let colors =
            i.previousSibling.previousSibling.previousSibling.previousSibling
              .style.backgroundColor;
          newCard.find(".color-list-chosen").append(`
                      <div class="color-div-md" style="background-color: ${colors}"></div>`);
          chosenColorsTask.push(colors);
        }
      }

      $("#task-form")[0].reset();
      $("#add-tasks").hide();

      // send info to api?
      todoTasks.push({
        title: taskTitle,
        description: taskDescription,
        colors: chosenColorsTask,
        done: false,
      });
      // add to local storage//post to api
      localStorage.setItem("todo-tasks", JSON.stringify(todoTasks));
    }
  });

  // edit and delete toggle buttons
  $(document).on("click", ".dropdown-edit-delete-icon", function () {
    $(this).next().toggle();
  });

  // delete item maybe a post request to remove item
  $(document).on("click", ".delete", function () {
    $(this).parent().parent().parent().hide();
    let id = $(this).parent().parent().parent().data("id");
    //make an api request here to remove item
    todoTasks.splice(id, 1);
    localStorage.setItem("todo-tasks", JSON.stringify(todoTasks));
    location.reload(true);
  });

  // edit item maybe a post request to update item
  $(document).on("click", ".edit", function () {
    $(this).parent().hide();
    $("#add-tasks").show();
    $("#task-title").val(
      $(this).parents(".dropdown-edit-delete").next().text()
    );
    $("#task-details").val(
      $(this).parents(".dropdown-edit-delete").next().next().text()
    );

    // make an api request here to edit and update
  });
  ///

  // striking through finished tasks
  $(document).on("click", ".check-task", function () {
    let id = $(this).closest(".task-card").data("id");
    if (this.checked) {
      $(this)
        .closest(".task-card")
        .find(".task-title")
        .css("text-decoration", "line-through");
      $(this)
        .closest(".task-card")
        .find(".task-description")
        .css("text-decoration", "line-through");
      todoTasks.forEach((element, i) => {
        if (i == id) {
          element.done = true;
          localStorage.setItem("todo-tasks", JSON.stringify(todoTasks));
        }
      });
    } else {
      $(this)
        .closest(".task-card")
        .find(".task-title")
        .css("text-decoration", "none");
      $(this)
        .closest(".task-card")
        .find(".task-description")
        .css("text-decoration", "none");
      todoTasks.forEach((element, i) => {
        if (i == id) {
          element.done = false;
          localStorage.setItem("todo-tasks", JSON.stringify(todoTasks));
        }
      });
    }
  });

  for (var i of $(".check-task")) {
    if (i.checked) {
      $(i)
        .closest(".task-card")
        .find(".task-title")
        .css("text-decoration", "line-through");
      $(i)
        .closest(".task-card")
        .find(".task-description")
        .css("text-decoration", "line-through");
    } else {
      $(i)
        .closest(".task-card")
        .find(".task-title")
        .css("text-decoration", "none");
      $(i)
        .closest(".task-card")
        .find(".task-description")
        .css("text-decoration", "none");
    }
  }
  // hide all done tasks
  // api might do this job

  $(document).on("click", "#done-tasks", function () {
    if (this.checked) {
      for (var i of $(".task-card").find(".check-task")) {
        if (i.checked) {
          $(i).closest(".task-card").css("display", "none");
        }
      }
    } else {
      for (var i of $(".task-card").find(".check-task")) {
        $(i).closest(".task-card").css("display", "grid");
      }
    }
  });
});
