$(document).ready(() => {

    $('#signup').click(function() {
        $('#landingpage').slideUp();
        $('#signup-page').css('z-index', 1);
    });

    $('#login').click(function() {
        $('#landingpage').slideUp();
        $('#login-page').css('z-index', 1);
    });

    $('#login-link').click(function() {
        $('#signup-page').slideUp(function() {
            $('#login-page').css('z-index', 1);
        });
    });

    $('#signup-link').click(function() {
        $('#signup-page').hide()
        $('#login-page').css('z-index', -1);
        $('#signup-page').slideDown()
    });



    //validate fields

    let emailValidated = false;
    let passwordValidated = false;
    let emptyInput = false;
    let passwordConfirmed = false;

    function result() {
        return emailValidated && passwordValidated && emptyInput && passwordConfirmed
    }

    function validateEmail() {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if ($('#email').val() !== '') {
            emailRegex.test($('#email').val()) ?
                ($('#email').removeClass('wrong-format'),
                    $('#email').siblings().hide(),
                    emailValidated = true,
                    console.log(result())) :
                ($('#email').addClass('wrong-format'),
                    $('#email').siblings().show())

        } else {
            $('#email').removeClass('wrong-format')
            $('#email').siblings().hide()
        }

    }

    function validatePassword() {
        const passwordRegex = /^[a-zA-Z0-9]{8}$/;
        if ($('#password').val() !== '') {
            passwordRegex.test($('#password').val()) ?
                ($('#password').removeClass('wrong-format'),
                    $('#password').siblings().hide(),
                    passwordValidated = true,
                    console.log(result()),
                    confirmPassword()) :
                ($('#password').addClass('wrong-format'),
                    $('#password').siblings().show())

        } else {
            $('#password').removeClass('wrong-format')
            $('#password').siblings().hide()
        }
    }

    function confirmPassword() {
        if ($('#confirm-password').val() !== '') {
            $('#password').val() !== $('#confirm-password').val() ?
                ($('#confirm-password').addClass('wrong-format'),
                    $('#confirm-password').siblings().show()) :
                ($('#confirm-password').removeClass('wrong-format'),
                    $('#confirm-password').siblings().hide(),
                    passwordConfirmed = true,
                    console.log(result()))
        }
    }

    function validateEmpty() {
        if ($(this).val() === '') {
            $(this).addClass('wrong-format')
                // $('#empty-field').show()
        } else {
            $(this).removeClass('wrong-format')
                // $('#empty-field').hide()
        }
    }

    function validateAll() {

        let numEmptyFields = 0
        let inputArray = document.getElementById('registration-form').getElementsByTagName('input')
        for (var i of inputArray) {
            if (i.value === '') {
                $(i).addClass('wrong-format');

                numEmptyFields++
            } else {
                $(i).removeClass('wrong-format');

            }
        }
        if (numEmptyFields === 0) {
            emptyInput = true;
            $('#empty-field').hide();

        } else {
            $('#empty-field').show();
        }
        console.log(numEmptyFields)
        console.log('final result is: ' + result())
        if (result()) {
            $('#signup-page').html(`<h1>Success</h1>`)
            setTimeout(()=>{
                $('#signup-page').slideUp(function() {
                    $('#login-page').css('z-index', 1);
                });
            }, 1000)             
            
        } else {
            console.log('something went wrong')
        }
    }


    function validateLogin(){
        let numEmptyFields = 0
        let loginInputArray = document.getElementById('login-form').getElementsByTagName('input')
        for (var i of loginInputArray) {
            if (i.value === '') {
                $(i).addClass('wrong-format');
                numEmptyFields++
            } else {
                $(i).removeClass('wrong-format');

            }
        }

        if (numEmptyFields === 0) {
            emptyInput = true;
            $('#empty-field-login').hide();

        } else {
            $('#empty-field-login').show();
        }

        //get items from api and validate
        let validatedCredentials = true // change this later
        if (validatedCredentials){
            window.location.href = 'home.html'
        }
    }

    $('#name').on('change', validateEmpty)
    $('#username').on('change', validateEmpty)
    $('#email').on('change', validateEmail)
    $('#password').on('input', validatePassword)
    $('#confirm-password').on('change', confirmPassword)
    $('#register').on('click', validateAll)


    $('#login-btn').on('click', validateLogin)
    $('#login-username').on('change', validateEmpty)
    $('#login-password').on('change', validateEmpty)


})