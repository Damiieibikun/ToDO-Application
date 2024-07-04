$(document).ready(() => {
  // first make a get request
  const url = "http://todo.reworkstaging.name.ng/v1";
  // get current user and display welcome message
  let currentUser = JSON.parse(localStorage.getItem("logged-user"));
  $("#greeting-msg").text(`${currentUser.name}'s todos`);
  let userId = currentUser.id;

  // functions
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

    if (task.hidden) {
      newCard.addClass("display-none");
      $("#done-tasks")[0].checked = true;
    } else {
      newCard.removeClass("display-none");
    }
    return newCard;
  }

  function getTodos() {
    $.ajax({
      url: `${url}/tasks?user_id=${userId}`,
      method: "GET",
      success: function (data) {
        // console.log(data);
        console.log("Task data successfully retrieved");
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
  }

  function createCategories() {
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
          location.reload();
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
  }

  function editCategories(tagId) {
    if ($("#category-input").val() === "") {
      $("#cat-error").css("display", "block");
      $("#category-input").addClass("wrong-format");
    } else {
      $("#cat-error").css("display", "none");
      $("#category-input").removeClass("wrong-format");

      let category = $("#category-input").val().toLowerCase();
      let color = $("#color-picker").val();

      $.ajax({
        url: `${url}/tags/${tagId}`,
        method: "PUT",
        data: {
          title: category,
          color: color,
        },
        success: function (data) {
          console.log("Successfully edited Tag");
          location.reload();
          // console.log(data)
        },
        error: function (error) {
          console.log("Error");
          console.log("error: " + error);
        },
      });
    }
  }

  function createTask(tagId) {
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
          // console.log(data);
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
  }

  function editTask(taskId) {
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

      // get input value
      let taskTitle = $("#task-title").val();
      let taskDescription = $("#task-details").val();

      // send info to api
      $.ajax({
        url: `${url}/tasks/${taskId}`,
        method: "PUT",
        data: {
          title: taskTitle,
          content: taskDescription,
        },
        success: function (data) {
          console.log("Successfully Edited tasks");
          // console.log(data);
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
  }
  function deleteTask(taskId) {
    $.ajax({
      url: `${url}/tasks/${taskId}`,
      method: "DELETE",
      success: function (data) {
        console.log("Task deleted successfully");
        // console.log(data);
        location.reload();
      },
      error: function (data) {
        console.log(data);
      },
    });
  }

  // open and create a new category
  $("#open-cat").click(function () {
    // remove all error classes on open
    $("#add-categories").css("display", "flex");
    $("#cat-error").css("display", "none");
    $("#category-input").removeClass("wrong-format");

    $("#category-form").on("submit", function (e) {
      // attach an event handler to category form
      e.preventDefault();
      createCategories();
    });
  });

  //close categories
  $("#close").on("click", function () {
    $("#add-categories").hide();
  });

  // open and create a new task
  $("#add-new-task").click(function () {
    // remove all error classes on open
    $("#add-tasks").css("display", "flex");
    $("#list-of-tags").css({ display: "flex", "flex-direction": "column" });
    $("#task-title").removeClass("wrong-format");
    $("#task-details").removeClass("wrong-format");
    $("#add-task-error").css("display", "none");
    $(".chosen-color").removeClass("chosen-tag");

    $("#task-form").on("submit", function (e) {
      e.preventDefault();
      // get id for tag
      let tagId = $(this).find(".chosen-tag").data("id");
      createTask(tagId);
    });
  });

  // close tasks
  $("#close-task").on("click", function () {
    $("#add-tasks").hide();
  });

  // get and display tags
  displayCat();

  //populate page with tasks already created
  getTodos();

  // open delete tag modal
  $(document).on("click", ".delete-tag-icon", function () {
    let chosenID = $(this).prev().prev().prev().data("id");
    let selectedTag = $(this).prev().prev().text();
    let selectedColor = $(this).prev().prev().prev().css("background-color");
    $.ajax({
      url: `${url}/tags/tasks?tag_id=${chosenID}`,
      method: "GET",
      success: function (data) {
        // console.log(data);
        if (data.length > 0) {
          $("#delete-task").css("display", "flex");
          $("#delete-task-details-info").html(`
            <div id="error-delete-cat">
            <p class = "mb-30">Error</p>
            <p>Unable to delete <span id="delete-task-title">${selectedTag}.</span></p>
            <p>Please remove tasks already assigned to this tag.</p>
            </div>
            
            `);
        } else {
          $("#delete-categories").css("display", "flex");
          $("#delete-tag").text(selectedTag);
          $("#delete-tag-color").css("background-color", selectedColor);
        }
      },
      error: function (data) {
        console.log(data);
      },
    });
  });

  // close delete task modal
  $("#close-delete-task").on("click", function () {
    $("#delete-task").hide();
  });

  // close delete category modal
  $("#close-delete").on("click", function () {
    $("#delete-categories").hide();
  });

  // edit a tag
  $(document).on("click", ".edit-tag-icon", function () {
    $("#add-categories").css("display", "flex");
    let tagName = $(this).prev().text();
    let colorTag = $(this).prev().prev().css("background-color");
    let tagID = $(this).prev().prev().data("id");

    $("#category-input").val(`${tagName}`);
    $("#color-picker").val(`${$.Color(colorTag).toHexString()}`);

    $("#cat-error").css("display", "none");
    $("#category-input").removeClass("wrong-format");

    // attach new event handler to category form
    $("#category-form").on("submit", function (e) {
      e.preventDefault();
      editCategories(tagID);
    });
  });

  // delete a tag
  $("#delete-category-form").on("submit", function (e) {
    e.preventDefault();
    let tagToDelete = $(this).find("#delete-tag").text();
    $.ajax({
      url: `${url}/tags?user_id=${userId}`,
      method: "GET",
      success: function (data) {
        // console.log(data);
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

  // add class-style to chosen tag
  $(document).on("click", ".chosen-color", function () {
    $(".chosen-color").each((i, chosentag) => {
      if (chosentag === this) {
        chosentag.classList.add("chosen-tag");
      } else {
        chosentag.classList.remove("chosen-tag");
      }
    });
  });

  // filtering through by categories
  $(document).on("click", ".color-div", function () {
    $("#clear-filter").css("display", "flex");
    $(this).removeClass("opacity");
    $(this).next().removeClass("opacity");
    $(this).next().next().removeClass("opacity");
    $(this).next().next().next().removeClass("opacity");

    $(this).next().addClass("font-weight");
    $(this).next().siblings().addClass("opacity");
    $(this).next().siblings().removeClass("font-weight");

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

  // clear applied filter
  $("#clear-filter").click(function () {
    $("#clear-filter").css("display", "none");
    $("#category-list").children().removeClass("opacity");
    $("#category-list").children().removeClass("font-weight");
    $("#todo-items").empty();
    getTodos();
  });

  // edit and delete toggle buttons
  $(document).on("click", ".dropdown-edit-delete-icon", function () {
    $(this).next().toggle();
  });

  // edit a task
  $(document).on("click", ".edit", function () {
    $("#add-tasks").css("display", "flex");
    $("#list-of-tags").css("display", "none");
    let id = $(this).parent().parent().parent().data("id");
    let title = $(this).parent().parent().next().text();
    let content = $(this).parent().parent().next().next().text();

    $("#task-title").val(`${title}`);
    $("#task-details").val(`${content}`);
    $("#task-form").on("submit", function (e) {
      e.preventDefault();
      // get id for task
      editTask(id);
    });
  });

  // delete a task modal
  $(document).on("click", ".delete", function () {
    let id = $(this).parent().parent().parent().data("id");
    let title = $(this).parent().parent().next().text();
    $("#delete-task-title").text(title);
    $("#delete-task").css("display", "flex");
    $("#delete-task-form").on("submit", function (e) {
      e.preventDefault();
      deleteTask(id);
    });
  });

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
        // console.log(data);
      },
      error: function (data) {
        console.log(data);
      },
    });
  });

  // hide all completed tasks
  $(document).on("click", "#done-tasks", function () {
    let status = $(this)[0].checked;
    console.log(status);

    for (var i of $(".task-card").find(".check-task")) {
      if (i.checked) {
        let taskId = $(i).closest(".task-card").data("id");
        $.ajax({
          url: `${url}/tasks/${taskId}/set-hidden`,
          method: "PUT",
          data: {
            hidden: status,
          },
          success: function (data) {
            console.log("Task hidden successfully");
            location.reload();
          },
          error: function (data) {
            console.log(data);
          },
        });
      }
    }
  });

  //   $(document).click(function(e){
  //     // console.log(e.target.classList)
  // if(e.target.classList.contains('dropdown-edit-delete-icon') === false){
  //   $(e.target).next().addClass('display-none')

  // }
  // else{
  //   $(e.target).next().removeClass('display-none')
  // }
  //   })

  // dropdown menu for responsiveness
  $('#category-menu').click(function () {
    $('#categories').toggle('slow')
})


  // log out from todo
  $("#logout-btn").click(() => {
    window.location.href = "index.html";
  });
});
