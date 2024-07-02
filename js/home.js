$(document).ready(() => {
  // first make a get request
  const url = "http://todo.reworkstaging.name.ng/v1";
  // get current user and display welcome message
  let currentUser = JSON.parse(localStorage.getItem("logged-user"));
  $("#greeting-msg").text(`${currentUser.name}'s todos`);
  let userId = currentUser.id;

  //open and close new categories
  $("#close").on("click", function () {
    $("#add-categories").hide();
  });

  $("#open-cat").click(function () {
    // remove all error classes on open
    $("#add-categories").css("display", "flex");
    $("#cat-error").css("display", "none");
    $("#category-input").removeClass("wrong-format");
  });

  // open and close new task
  //input validation for task form
  $("#add-new-task").click(function () {
    // remove all error classes on open
    $("#add-tasks").css("display", "flex");
    $("#task-title").removeClass("wrong-format");
    $("#task-details").removeClass("wrong-format");
    $("#add-task-error").css("display", "none");
    $(".chosen-color").removeClass("chosen-tag");
  });

  $("#close-task").on("click", function () {
    $("#add-tasks").hide();
  });

  function displayCat() {
    // function to display all categories
    $.ajax({
      url: `${url}/tags?user_id=${userId}`,
      method: "GET",
      success: function (data) {
        // console.log(data);
        data.forEach((cat) => {
          $("#category-list").append(`
       
          <div class="color-div" data-id=${cat.id} style="background-color: ${cat.color};"></div>
       
          <p class="category-name">${cat.title}</p>
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square edit-tag-icon" viewBox="0 0 16 16">
    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
    <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
  </svg>
  
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x delete-tag-icon" viewBox="0 0 16 16">
    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
  </svg>
      `);

          // add availiable categories to task form
          $("#availiable-categories")
            .append(`<div class="chosen-color flex align-center gap-10" data-id=${cat.id}>
  <div class="color-div-md"  style="background-color: ${cat.color};"></div>
  <p class="category-name-sm">${cat.title}</p>
  </div>`);
        });
        if (data.length !== 0) {
          $("#add-new-task").css("display", "flex");
        } else {
          $("#add-new-task").css("display", "none");
        }
      },
      error: function (error) {
        console.log("Error");
        console.log("error: " + error);
      },
    });
  }

  function displayTodoCards(task, color) {
    let completedTask = null;
    if (task.completed) {
      completedTask = "checked";
    }
    let newCard = $(`<div class="task-card" data-id = ${task.id}>
      <div style="text-align: end;" class="dropdown-edit-delete">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-three-dots dropdown-edit-delete-icon" viewBox="0 0 16 16">
<path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3"/>
</svg>
<div class="dropdown-edit-delete-list">
              <div class="edit">Edit..</div>
              <div class="delete">Delete..</div>
            </div>
      </div>
      <p class="task-title">${task.title}</p>
      <p class="task-description">${task.content}</p>
      <div style="text-align: end;">
          <input type="checkbox" name="" class="check-task" ${completedTask}> <span class="done">Done</span>
      </div>
      <div class="flex gap-10 color-list-chosen">
      <div class="color-div-md" style="background-color: ${color}"></div>
          </div>
  </div>
`);

    if (task.completed) {
      newCard.find(".task-title").addClass("strike-through");
      newCard.find(".task-description").addClass("strike-through");
    }
    return newCard;
  }
  // get and display tags
  displayCat();

  // create new tags and post
  $("#category-form").on("submit", function () {
    if ($("#category-input").val() === "") {
      $("#cat-error").css("display", "block");
      $("#category-input").addClass("wrong-format");
    } else {
      $("#cat-error").css("display", "none");
      $("#category-input").removeClass("wrong-format");

      let category = $("#category-input").val().toLowerCase();
      let color = $("#color-picker").val();

      $("#category-form")[0].reset();

      $.ajax({
        url: `${url}/tags`,
        method: "POST",
        data: {
          user_id: userId,
          title: category,
          color: color,
        },
        success: function (data) {
          console.log("Successfully created a new Tag");
          // console.log(data)
        },
        error: function (error) {
          console.log("Error");
          console.log("error: " + error);
        },
      });

      // get and display tags
      displayCat();
    }
  });

  // open and close edit and delete task

  $(document).on("click", ".delete-tag-icon", function () {
    let selectedTag = $(this).prev().prev().text();
    $("#delete-categories").css("display", "flex");
    $("#delete-tag").text(selectedTag);
  });

  $("#close-delete-task").on("click", function () {
    $("#delete-task").hide();
  });

  $("#close-delete").on("click", function () {
    $("#delete-categories").hide();
  });

  $("#delete-category-form").on("submit", function (e) {
    e.preventDefault();
    let tagToDelete = $(this).find("#delete-tag").text();
    $.ajax({
      url: `${url}/tags?user_id=${userId}`,
      method: "GET",
      success: function (data) {
        console.log(data);
        data.forEach((tag) => {
          if (tag.title === tagToDelete) {
            $.ajax({
              url: `${url}/tags/${tag.id}`,
              method: "DELETE",
              success: function (res) {
                console.log("Deleted Successfully!");
                console.log(res);
                location.reload();
              },
              error: function (res) {
                console.log(res);
              },
            });
          }
        });
      },

      error: function (data) {
        console.log(data);
      },
    });
    $("#delete-categories").hide();
  });

  // add class to chosen tag
  $(document).on("click", ".chosen-color", function () {
    $(".chosen-color").each((i, chosentag) => {
      if (chosentag === this) {
        chosentag.classList.add("chosen-tag");
      } else {
        chosentag.classList.remove("chosen-tag");
      }
    });
  });

  // post a new todo card and reload
  $("#task-form").on("submit", function (e) {
    e.preventDefault();
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

      // get id for tag
      let tagId = $(this).find(".chosen-tag").data("id");

      // get input value
      let taskTitle = $("#task-title").val();
      let taskDescription = $("#task-details").val();

      // send info to api
      $.ajax({
        url: `${url}/tasks`,
        method: "POST",
        data: {
          tag_id: tagId,
          title: taskTitle,
          content: taskDescription,
        },
        success: function (data) {
          console.log("Successfully posted tasks");
          console.log(data);
          location.reload();
        },
        error: function (data) {
          console.log(data);
        },
      });

      // clear all inputs and hide task form
      $("#task-form")[0].reset();
      $("#add-tasks").hide();
    }
  });

  //populate page with tasks already created
  $.ajax({
    url: `${url}/tasks?user_id=${userId}`,
    method: "GET",
    success: function (data) {
      console.log(data);
      console.log("Task data successfully retrieved");
      let completedTask = null;
      data.forEach((task) => {
        let colorCat = null;
        $("#category-list")
          .find(".category-name")
          .each((i, cat) => {
            if (cat.innerText.toLowerCase() === task.tag) {
              colorCat = $(cat).prev().css("background-color");
            }
          });

        let newCard = displayTodoCards(task, colorCat);
        // append new card to page
        $("#todo-items").append(newCard);
      });
    },
    error: function (data) {
      console.log("Error");
      console.log("error: " + error);
    },
  });

  // filtering through categories may need api
  $(document).on("click", ".color-div", function () {
    $(this).next().toggleClass("font-weight");
    $(this).next().siblings().toggleClass("opacity");

    let chosenID = $(this).data("id");
    let color = $(this).css("background-color");
    $.ajax({
      url: `${url}/tags/tasks?tag_id=${chosenID}`,
      method: "GET",
      success: function (data) {
        console.log(data);
        console.log("Data filtered successfully");

        $("#todo-items").empty();
        data.forEach((task) => {
          let newCard = displayTodoCards(task, color);

          // append new card to page
          $("#todo-items").append(newCard);
        });
      },
      error: function (data) {
        console.log(data);
      },
    });
  });

  // edit and delete toggle buttons
  $(document).on("click", ".dropdown-edit-delete-icon", function () {
    $(this).next().toggle();
  });

  // delete a task

  $(document).on("click", ".delete", function () {
    let id = $(this).parent().parent().parent().data("id");
    let title = $(this).parent().parent().next().text();
    $("#delete-task-title").text(title);
    $("#delete-task").css("display", "flex");
    localStorage.setItem("delete-task", id);
  });

  $("#delete-task-form").on("submit", function (e) {
    e.preventDefault();
    let id = localStorage.getItem("delete-task");
    $.ajax({
      url: `${url}/tasks/${id}`,
      method: "DELETE",
      success: function (data) {
        console.log("Task deleted successfully");
        console.log(data);
        location.reload();
      },
      error: function (data) {
        console.log(data);
      },
    });
  });

  // mark as task as completed

  // striking through finished tasks
  $(document).on("click", ".check-task", function () {
    // get id of card and apply styles to text
    let id = $(this).closest(".task-card").data("id");
    let status = $(this)[0].checked;
    console.log(status);

    $(this)
      .closest(".task-card")
      .find(".task-title")
      .toggleClass("strike-through");
    $(this)
      .closest(".task-card")
      .find(".task-description")
      .toggleClass("strike-through");

    $.ajax({
      url: `${url}/tasks/${id}/set-completed`,
      method: "PUT",
      data: {
        completed: status,
      },
      success: function (data) {
        console.log("Task updated successfully");
        console.log(data);
      },
      error: function (data) {
        console.log(data);
      },
    });
  });

  //populate page with categories already created
  // let todoUsers = JSON.parse(localStorage.getItem("todo-users")) || [];
  //   todoUsers.forEach((user) => {
  //     if (user.fullName === currentUser) {
  //       if (user.todoInfo.categories.length !== 0) {
  //         $("#add-new-task").css("display", "flex");
  //       } else {
  //         $("#add-new-task").css("display", "none");
  //       }

  //       user.todoInfo.categories.forEach((cat) => {
  //         $("#category-list").append(`

  //         <div class="color-div" style="background-color: ${cat.color};"></div>

  //         <p class="category-name">${cat.category}</p>
  //     `);

  //         // add availiable categories to task form
  //         $("#availiable-categories")
  //           .append(`<div class="chosen-color flex align-center gap-10">
  // <div class="color-div-md" style="background-color: ${cat.color};"></div>
  // <p class="category-name-sm">${cat.category}</p>
  // </div>`);
  //       });

  //       // from get request
  //       //check if each dodo has been ticked as done
  //       user.todoInfo.todoTasks.forEach((todo, i) => {
  //         let checkedValue = null;
  //         let applyStrikeThrough = false;
  //         if (todo.done) {
  //           checkedValue = "checked";
  //           applyStrikeThrough = true;
  //         }
  //         // create a new card with a unique id number
  //         let newCard = $(`<div class="task-card" data-id = ${i}>
  //               <div style="text-align: end;" class="dropdown-edit-delete">
  //                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-three-dots dropdown-edit-delete-icon" viewBox="0 0 16 16">
  //   <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3"/>
  //   </svg>
  //   <div class="dropdown-edit-delete-list">
  //                       <div class="edit">Edit..</div>
  //                       <div class="delete">Delete..</div>
  //                     </div>
  //               </div>
  //               <p class="task-title">${todo.title}</p>
  //               <p class="task-description">${todo.description}</p>
  //               <div style="text-align: end;">
  //                   <input type="checkbox" name="" class="check-task" ${checkedValue}> <span class="done">Done</span>
  //               </div>
  //               <div class="flex gap-10 color-list-chosen">
  //                   </div>
  //           </div>
  //       `);

  //         // append new card to page
  //         $("#todo-items").append(newCard);

  //         // add colors chosen to page
  //         for (var i of todo.colors) {
  //           newCard.find(".color-list-chosen").append(`
  //                       <div class="color-div-md" style="background-color: ${i}"></div>`);
  //         }

  //         if (applyStrikeThrough) {
  //           newCard.find(".task-title").addClass("strike-through");
  //           newCard.find(".task-description").addClass("strike-through");
  //         }
  //       });

  //       // creating new category
  //       $("#category-form").on("submit", function () {
  //         if ($("#category-input").val() === "") {
  //           $("#cat-error").css("display", "block");
  //           $("#category-input").addClass("wrong-format");
  //         } else {
  //           $("#cat-error").css("display", "none");
  //           $("#category-input").removeClass("wrong-format");

  //           let category = $("#category-input").val();
  //           let color = $("#color-picker").val();

  //           // display new task button once category has been created
  //           $("#add-new-task").css("display", "flex");

  //           $("#category-form")[0].reset();

  //           // make post request to api?
  //           user.todoInfo.categories.push({
  //             category: category,
  //             color: color,
  //           });
  //           // add to local storage/ make post request
  //           localStorage.setItem("todo-users", JSON.stringify(todoUsers));
  //         }
  //       });

  //       //input validation for task form
  //       $("#add-new-task").click(function () {
  //         // remove all error classes on open
  //         // $("#add-tasks").show();
  //         $("#add-tasks").css('display', 'flex');
  //         $("#task-title").removeClass("wrong-format");
  //         $("#task-details").removeClass("wrong-format");
  //         $("#add-task-error").css("display", "none");
  //         $(".chosen-color").removeClass("chosen-tag");
  //       });

  //       // filtering through categories may need api
  //       $(document).on("click", ".color-div", function () {
  //         $(this).next().toggleClass("font-weight");
  //         let color = $(this).css("background-color");

  //         // from get request
  //         user.todoInfo.todoTasks.forEach((todo, i) => {
  //           if (todo.colors.includes(color) === false) {
  //             $(`[data-id=${i}]`).toggle();
  //           }
  //         });
  //         $(this).next().siblings().toggleClass("opacity");
  //       });

  //       //open and close new categories and new tasks
  //       $("#close").on("click", function () {
  //         $("#add-categories").hide();
  //       });

  //       $("#open-cat").click(function () {
  //         // remove all error classes on open
  //         // $("#add-categories").show();
  //         $("#add-categories").css('display', 'flex');
  //         $("#cat-error").css("display", "none");
  //         $("#category-input").removeClass("wrong-format");
  //       });

  //       $("#close-task").on("click", function () {
  //         $("#add-tasks").hide();
  //       });

  //       // adding new todo card
  //       $("#task-form").on("submit", function (e) {
  //         if ($("#task-title").val() === "" && $("#task-details").val() === "") {
  //           $("#task-title").addClass("wrong-format");
  //           $("#task-details").addClass("wrong-format");
  //           $("#add-task-error").text("Empty fields");
  //           $("#add-task-error").css("display", "block");
  //           e.preventDefault(); // prevent default when validating
  //         } else if ($("#task-title").val() === "") {
  //           $("#task-title").addClass("wrong-format");
  //           $("#task-details").removeClass("wrong-format");
  //           $("#add-task-error").text("Enter a title");
  //           $("#add-task-error").css("display", "block");
  //           e.preventDefault(); // prevent default when validating
  //         } else if ($("#task-details").val() === "") {
  //           $("#task-details").addClass("wrong-format");
  //           $("#task-title").removeClass("wrong-format");
  //           $("#add-task-error").text("Enter a Description");
  //           $("#add-task-error").css("display", "block");
  //           e.preventDefault(); // prevent default when validating
  //         } else {
  //           $("#task-title").removeClass("wrong-format");
  //           $("#task-details").removeClass("wrong-format");

  //           //get input value
  //           let taskTitle = $("#task-title").val();
  //           let taskDescription = $("#task-details").val();

  //           // get colors chosen for categories and append to new card
  //           let chosenColorsTask = [];
  //           $("#task-form")
  //             .find(".chosen-tag")
  //             .find(".color-div-md")
  //             .each((index, element) => {
  //               let catColor = $(element).css("background-color");
  //               chosenColorsTask.push(catColor);
  //             });

  //           // clear all inputs and hide task form
  //           $("#task-form")[0].reset();
  //           $("#add-tasks").hide();

  //           // send info to api?
  //           user.todoInfo.todoTasks.push({
  //             title: taskTitle,
  //             description: taskDescription,
  //             colors: chosenColorsTask,
  //             done: false,
  //           });
  //           // add to local storage//post to api
  //           localStorage.setItem("todo-users", JSON.stringify(todoUsers));
  //         }
  //       });

  //       // once category is selected assign class chosen-color
  //       $(document).on("click", ".chosen-color", function () {
  //         $(this).toggleClass("chosen-tag");
  //       });

  //       // edit and delete toggle buttons
  //       $(document).on("click", ".dropdown-edit-delete-icon", function () {
  //         $(this).next().toggle();
  //       });

  //       // delete item maybe a post request to remove item
  //       $(document).on("click", ".delete", function () {
  //         $(this).parent().parent().parent().hide();
  //         let id = $(this).parent().parent().parent().data("id");
  //         //make an api request here to remove item
  //         user.todoInfo.todoTasks.splice(id, 1);
  //         localStorage.setItem("todo-users", JSON.stringify(todoUsers));
  //         location.reload(true);
  //       });

  //       // edit item maybe a post request to update item
  //       $(document).on("click", ".edit", function () {
  //         $(this).parent().hide();
  //         $("#add-tasks").show();
  //         $("#task-title").val(
  //           $(this).parents(".dropdown-edit-delete").next().text()
  //         );
  //         $("#task-details").val(
  //           $(this).parents(".dropdown-edit-delete").next().next().text()
  //         );

  //         // make an api request here to edit and update
  //       });

  //       // striking through finished tasks
  //       $(document).on("click", ".check-task", function () {
  //         // get id of card and apply styles to text
  //         let id = $(this).closest(".task-card").data("id");

  //         $(this)
  //           .closest(".task-card")
  //           .find(".task-title")
  //           .toggleClass("strike-through");
  //         $(this)
  //           .closest(".task-card")
  //           .find(".task-description")
  //           .toggleClass("strike-through");
  //         // make api post request
  //         // find trageted and set todo-checked to true and update

  //         user.todoInfo.todoTasks.forEach((todo, i) => {
  //           if (i == id) {
  //             if (this.checked) {
  //               todo.done = true;
  //             } else {
  //               todo.done = false;
  //             }
  //           }
  //         });
  //         localStorage.setItem("todo-users", JSON.stringify(todoUsers));
  //       });

  //       // check for done tasks and hide the tags
  //       $(document).on("click", "#done-tasks", function () {
  //         for (var i of $(".task-card").find(".check-task")) {
  //           if (i.checked) {
  //             $(i).closest(".task-card").toggleClass("display-none");
  //           }
  //         }
  //       });
  //     }
  //   });

  $("#logout-btn").click(() => {
    window.location.href = "index.html";
  });
});
