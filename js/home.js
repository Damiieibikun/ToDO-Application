$(document).ready(() => {
  // first make a get request

  // get current user and display welcome message
  let currentUser = localStorage.getItem("current-user");
  $("#greeting-msg").text(`${currentUser}'s todos`);

  //populate page with categories already created
  let todoUsers = JSON.parse(localStorage.getItem("todo-users")) || [];
  todoUsers.forEach((user) => {
    if (user.fullName === currentUser) {
      if (user.todoInfo.categories.length !== 0) {
        $("#add-new-task").css("display", "flex");
      } else {
        $("#add-new-task").css("display", "none");
      }

      user.todoInfo.categories.forEach((cat) => {
        $("#category-list").append(`
     
        <div class="color-div" style="background-color: ${cat.color};"></div>
     
        <p class="category-name">${cat.category}</p>
    `);

        // add availiable categories to task form
        $("#availiable-categories")
          .append(`<div class="chosen-color flex align-center gap-10">
<div class="color-div-md" style="background-color: ${cat.color};"></div>
<p class="category-name-sm">${cat.category}</p>
</div>`);
      });

      // from get request
      //check if each dodo has been ticked as done
      user.todoInfo.todoTasks.forEach((todo, i) => {
        let checkedValue = null;
        let applyStrikeThrough = false;
        if (todo.done) {
          checkedValue = "checked";
          applyStrikeThrough = true;
        }
        // create a new card with a unique id number
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
              <p class="task-title">${todo.title}</p>
              <p class="task-description">${todo.description}</p>
              <div style="text-align: end;">
                  <input type="checkbox" name="" class="check-task" ${checkedValue}> <span class="done">Done</span>
              </div>
              <div class="flex gap-10 color-list-chosen">
                  </div>
          </div>
      `);

        // append new card to page
        $("#todo-items").append(newCard);

        // add colors chosen to page
        for (var i of todo.colors) {
          newCard.find(".color-list-chosen").append(`
                      <div class="color-div-md" style="background-color: ${i}"></div>`);
        }

        if (applyStrikeThrough) {
          newCard.find(".task-title").addClass("strike-through");
          newCard.find(".task-description").addClass("strike-through");
        }
      });

      // creating new category
      $("#category-form").on("submit", function () {
        if ($("#category-input").val() === "") {
          $("#cat-error").css("display", "block");
          $("#category-input").addClass("wrong-format");
        } else {
          $("#cat-error").css("display", "none");
          $("#category-input").removeClass("wrong-format");

          let category = $("#category-input").val();
          let color = $("#color-picker").val();

          // display new task button once category has been created
          $("#add-new-task").css("display", "flex");

          $("#category-form")[0].reset();

          // make post request to api?
          user.todoInfo.categories.push({
            category: category,
            color: color,
          });
          // add to local storage/ make post request
          localStorage.setItem("todo-users", JSON.stringify(todoUsers));
        }
      });

      //input validation for task form
      $("#add-new-task").click(function () {
        // remove all error classes on open
        $("#add-tasks").show();
        $("#task-title").removeClass("wrong-format");
        $("#task-details").removeClass("wrong-format");
        $("#add-task-error").css("display", "none");
        $(".chosen-color").removeClass("chosen-tag");
      });

      // filtering through categories may need api
      $(document).on("click", ".color-div", function () {
        $(this).next().toggleClass("font-weight");
        let color = $(this).css("background-color");

        // from get request
        user.todoInfo.todoTasks.forEach((todo, i) => {
          if (todo.colors.includes(color) === false) {
            $(`[data-id=${i}]`).toggle();
          }
        });
        $(this).next().siblings().toggleClass("opacity");
      });

      //open and close new categories and new tasks
      $("#close").on("click", function () {
        $("#add-categories").hide();
      });

      $("#open-cat").click(function () {
        // remove all error classes on open
        $("#add-categories").show();
        $("#cat-error").css("display", "none");
        $("#category-input").removeClass("wrong-format");
      });

      $("#close-task").on("click", function () {
        $("#add-tasks").hide();
      });

      // adding new todo card
      $("#task-form").on("submit", function (e) {
        if ($("#task-title").val() === "" && $("#task-details").val() === "") {
          $("#task-title").addClass("wrong-format");
          $("#task-details").addClass("wrong-format");
          $("#add-task-error").text("Empty fields");
          $("#add-task-error").css("display", "block");
          e.preventDefault(); // prevent default when validating
        } else if ($("#task-title").val() === "") {
          $("#task-title").addClass("wrong-format");
          $("#task-details").removeClass("wrong-format");
          $("#add-task-error").text("Enter a title");
          $("#add-task-error").css("display", "block");
          e.preventDefault(); // prevent default when validating
        } else if ($("#task-details").val() === "") {
          $("#task-details").addClass("wrong-format");
          $("#task-title").removeClass("wrong-format");
          $("#add-task-error").text("Enter a Description");
          $("#add-task-error").css("display", "block");
          e.preventDefault(); // prevent default when validating
        } else {
          $("#task-title").removeClass("wrong-format");
          $("#task-details").removeClass("wrong-format");

          //get input value
          let taskTitle = $("#task-title").val();
          let taskDescription = $("#task-details").val();

          // get colors chosen for categories and append to new card
          let chosenColorsTask = [];
          $("#task-form")
            .find(".chosen-tag")
            .find(".color-div-md")
            .each((index, element) => {
              let catColor = $(element).css("background-color");
              chosenColorsTask.push(catColor);
            });

          // clear all inputs and hide task form
          $("#task-form")[0].reset();
          $("#add-tasks").hide();

          // send info to api?
          user.todoInfo.todoTasks.push({
            title: taskTitle,
            description: taskDescription,
            colors: chosenColorsTask,
            done: false,
          });
          // add to local storage//post to api
          localStorage.setItem("todo-users", JSON.stringify(todoUsers));
        }
      });

      // once category is selected assign class chosen-color
      $(document).on("click", ".chosen-color", function () {
        $(this).toggleClass("chosen-tag");
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
        user.todoInfo.todoTasks.splice(id, 1);
        localStorage.setItem("todo-users", JSON.stringify(todoUsers));
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

      // striking through finished tasks
      $(document).on("click", ".check-task", function () {
        // get id of card and apply styles to text
        let id = $(this).closest(".task-card").data("id");

        $(this)
          .closest(".task-card")
          .find(".task-title")
          .toggleClass("strike-through");
        $(this)
          .closest(".task-card")
          .find(".task-description")
          .toggleClass("strike-through");
        // make api post request
        // find trageted and set todo-checked to true and update

        user.todoInfo.todoTasks.forEach((todo, i) => {
          if (i == id) {
            if (this.checked) {
              todo.done = true;
            } else {
              todo.done = false;
            }
          }
        });
        localStorage.setItem("todo-users", JSON.stringify(todoUsers));
      });

      // check for done tasks and hide the tags
      $(document).on("click", "#done-tasks", function () {
        for (var i of $(".task-card").find(".check-task")) {
          if (i.checked) {
            $(i).closest(".task-card").toggleClass("display-none");
          }
        }
      });
    }
  });

  $("#logout-btn").click(() => {
    window.location.href = "index.html";
  });
});
