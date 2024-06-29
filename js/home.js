$(document).ready(() => {

  // creating new category
  $("#category-form").on("submit", function(e) {
      e.preventDefault();

      if ($("#category-input").val() === '') {
          $('#cat-error').css('display', 'block')
          $("#category-input").addClass('wrong-format')
      } else {
          $('#cat-error').css('display', 'none')
          $("#category-input").removeClass('wrong-format')

          // make post request here after getting values
          let category = $("#category-input").val();
          let color = $("#color-picker").val();

          // make get request to populate 
          $(
              "#chosen-colors"
          ).append(` <div class="chosen-color flex-col align-center">
                      <div class="color-div-sm" style="background-color: ${color};"></div>
                      <p id="category-name-sm">${category}</p>
                  </div>`);

          $("#category-list").append(`
      <div class="color-div" style="background-color: ${color};"></div>
      <p id="category-name">${category}</p>
  `);

          $("#add-new-task").css("display", "flex");

          $(
              "#availiable-categories"
          ).append(`<div class="chosen-color flex align-center gap-10">
      <div class="color-div-sm" style="background-color: ${color};"></div>
      <p id="category-name-sm">${category}</p>
      <input type="checkbox" name="checkbox" class="selected-cat" />
  </div>`);

          $("#category-form")[0].reset();

          // send info to api?
      }

  });

  // filtering through categories may need api


  //open and close new categories and new tasks
  $("#close").on("click", function() {
      $("#add-categories").hide();
  });

  $("#open-cat").click(function() {
      $("#add-categories").show();
  });

  $("#add-new-task").click(function() {
      $("#add-tasks").show();
  });

  $("#close-task").on("click", function() {
      $("#add-tasks").hide();
  });


  // adding new todo sticky notes
  $("#task-form").on("submit", function(e) {
      e.preventDefault();


      if ($("#task-title").val() === '') {
          $("#task-title").addClass('wrong-format')
          $('#add-task-error').text('Enter a title')
          $('#add-task-error').css('display', 'block')
      } else if ($("#task-details").val() === '') {
          $("#task-details").addClass('wrong-format')
          $("#task-title").removeClass('wrong-format')
          $('#add-task-error').text('Enter a Description')
          $('#add-task-error').css('display', 'block')
      } else {
          $("#task-title").removeClass('wrong-format')
          $("#task-details").removeClass('wrong-format')

          // make post request here after getting values
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
      `)

          // make get request here
          $("#todo-items").append(newCard);

          for (var i of $("#task-form").find('.selected-cat')) {
              if (i.checked) {
                  let colors = i.previousSibling.previousSibling.previousSibling.previousSibling.style.backgroundColor
                  newCard.find('.color-list-chosen').append(`
                      <div class="color-div-md" style="background-color: ${colors}"></div>`)
              }
          }

          $("#task-form")[0].reset();
          $("#add-tasks").hide();
          // send info to api?

      }
  });


  // get selected tag value can be sent to api
  // $(document).on('click', '.selected-cat', function() {
  //     if ($(this)[0].checked) {
  //         let chosenCat = $(this).prev().prev().css('background-color')
  //         console.log(chosenCat)

  //     }
  // });


  // edit and delete toggle buttons

  $(document).on('click', '.dropdown-edit-delete-icon', function() {
      $(this).next().toggle();
  });


  // delete item maybe a post request to remove item

  // edit item maybe a post request to update item
  // testing for editing

  $(document).on('click', '.edit', function() {
          $(this).parent().hide()
          $("#add-tasks").show();
          $("#task-title").val($(this).parents('.dropdown-edit-delete').next().text())
          $("#task-details").val($(this).parents('.dropdown-edit-delete').next().next().text())
      })
      ///


  // striking through finished tasks
  $(document).on("click", ".check-task", function() {
      if (this.checked) {
          $(this)
              .closest(".task-card")
              .find(".task-title")
              .css("text-decoration", "line-through");
          $(this)
              .closest(".task-card")
              .find(".task-description")
              .css("text-decoration", "line-through");
      } else {
          $(this)
              .closest(".task-card")
              .find(".task-title")
              .css("text-decoration", "none");
          $(this)
              .closest(".task-card")
              .find(".task-description")
              .css("text-decoration", "none");
      }
  });

  // hide all done tasks
  // api might do this job

  $(document).on("click", "#done-tasks", function() {
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