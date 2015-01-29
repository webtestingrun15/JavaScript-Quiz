$(function() {
    /* NOTE CODE MUST BE RUN IN A SERVER FOR SESSIONSTORAGE*/


    var count = 0; // counter for #next click click
    var countMatch = 0; // counts the matches between questions and correctAnswer
    var $choices = $('#choices'); // Select choices id
    var $next = $('#next'); //cache next button
    var $finish = $('#finish'); // The finish button
    var $answers = $('#answers'); // answer choices for each question
    var $quizForm = $('#quizForm'); //quizform
    var $error = $('#error'); //error messages
    var $header = $('header p'); // The header
    var $previous = $('#previous'); //next button
    var $startForm = $('#startForm'); //the login form
    var $username = $('#username'); //entered username
    var $password = $('#password'); //entered password
    var $remember = $('#remember'); // Checked box
    var $intro = $('#intro'); //intro div
    var $register = $('#register');
    var $account = $('#account'); //create account button
    var $accountForm = $('#accountForm'); // the new account form
    var $hello = $('#hello'); //header hello
    var $cusername = $('#cusername'); // created username
    var $cpassword = $('#password'); // created password
    var $firstName = $('#firstName'); //created firstName
    var $lastName = $('#lastName'); //created lastName

    $register.hide();
    $quizForm.hide();

    quizScores = [];

    //Match Login to localstorage
    $startForm.submit(function(event) {
        event.preventDefault();
        $quizForm.show();
        $intro.hide();
        // Add elements username/password firstname last name to localstorage
        if (window.localStorage) {
            for (var i = 0; i < localStorage.length; i++) {
                var key = localStorage.key(i);
                var userObj = JSON.parse(localStorage.getItem(key));
                if ($username.val() === userObj.username) {
                    $hello.text('Hello ' + userObj.firstName);
                }
            }
        }
    });

    // Remember User
    if (window.localStorage) {
        $remember.click(function() {
            if ($remember.is(':checked')) {
                localStorage.username = $username.val();
                localStorage.password = $password.val();
                localStorage.checked = $remember.val();
            } else {
                localStorage.username = '';
                localStorage.password = '';
                localStorage.checked = '';
            }
        });

        if (localStorage.checked && localStorage.checked !== '') {
            $remember.attr('checked', 'checked');
            $username.val(localStorage.username);
            $password.val(localStorage.password);
        } else {
            $remember.removeAttr('checked');
            $username.val('');
            $password.val('');
        }
    }

    //Goes to register page when account button clicked
    $account.click(function() {
        $register.show();
        $intro.hide();
    });
    //stores the account information in local storage
    $accountForm.submit(function(event) {
        event.preventDefault();
        var counter = 0;

        $quizForm.show();
        $register.hide();
        if (window.localStorage) {
            // var userdata = [];
            // function User(username,password,firstName,lastName) {
            //      this.username = username,
            //      this.password = password,
            //      this.firstName = firstName,
            //      this.lastName = lastName,
            // }

            localStorage.setItem(counter + 1, JSON.stringify({
                username: $cusername.val(),
                password: $cpassword.val(),
                firstName: $firstName.val(),
                lastName: $lastName.val()
            }));
            var key = localStorage.key(counter);
            var userObj = JSON.parse(localStorage.getItem(key));
            $hello.text('Hello ' + userObj.firstName);
        }
    });

    var allQuestions; //JSON with data
    $.getJSON('data/questions.json')
        .done(function(data) {
            allQuestions = data; //json applied
            $previous.hide(); // hide previous button
            $error.text(' Please select a city to continue'); //error message added
            $finish.hide(); // hides the finish button
            $choices.text(allQuestions.allQuestions[0].question); // Shows the first choice
            document.getElementById('next').disabled = true; // disabled next button
            if (sessionStorage !== undefined) {
                sessionStorage.clear(); //clears the session  on every reset
            }

            // LOOPS AND ADDS EACH CHOICES ITEM FROM THE FIRST ARRAY TO THE ANSWERS FIELD WITH A LABEL
            // function radioloop() {

            // }

            // for (var i = 0; i < 4; i++) {
            //     var radioBtn = $('<input type="radio" name="answers"/>'); // create a radio input
            //     var labelFor = $('<label>' + allQuestions.allQuestions[0].choices[i] + '</label>'); //applies a label
            //     var radioChoice = radioBtn.prop('value', allQuestions.allQuestions[0].choices[i]); // adds value attribute with
            //     var radioLabel = labelFor.prepend(radioChoice);
            //     radioLabel.appendTo($answers);
            // }

            var radioData = [{
                value: allQuestions.allQuestions[0].choices[0],
                label: allQuestions.allQuestions[0].choices[0]
            }, {
                value: allQuestions.allQuestions[0].choices[1],
                label: allQuestions.allQuestions[0].choices[1]
            }, {
                value: allQuestions.allQuestions[0].choices[2],
                label: allQuestions.allQuestions[0].choices[2]
            }, {
                value: allQuestions.allQuestions[0].choices[3],
                label: allQuestions.allQuestions[0].choices[3]
            }];
            var template = $("#answers-template").html();
            var templateScript = Handlebars.compile(template);
            $answers.append(templateScript(radioData));


            $('input:radio').change(function() {
                //checks if the radio button matches the correct answer
                if ($('input:radio[name="answers"]:checked').val() === allQuestions.allQuestions[0].correctAnswer) {
                    //if matched countMatch + 1
                    countMatch++;
                }

                if (sessionStorage !== undefined) {
                    sessionStorage.setItem(0, $('input[type=radio]:checked').val()); // Session saved
                }
                // enable next cities selected
                if ($('input:radio[name="answers"]:checked').length > 0) {
                    //Is Valid
                    document.getElementById('next').disabled = false; //next enabled
                    $error.html(''); //error message removed
                }
            });


            $next.on('click', function() {
                // $answers.fadeOut(500);
                count = (count + 1) % allQuestions.allQuestions.length;
                $choices.text(allQuestions.allQuestions[count].question);
                $previous.show();

                if (count >= 4) {
                    $next.hide();
                    $finish.show();


                }
                $answers.html(""); // clears the choice of cities in answers
                document.getElementById('next').disabled = true; // disable next button
                document.getElementById('finish').disabled = true; // disable finish button
                $error.text('Please select a city to continue'); //error message added
                // LOOPS AND ADDS EACH CHOICES ITEM FROM THE OTHER ARRAYS TO THE ANSWERS FIELD WITH A LABEL
                // for (var i = 0; i < 4; i++) {
                //     var radioBtn = $('<input type="radio" name="answers" />');
                //     var labelFor = $('<label for="">' + allQuestions.allQuestions[count].choices[i] + '</label>');
                //     var radioChoice = radioBtn.attr('value', allQuestions.allQuestions[count].choices[i]);
                //     var radioLabel = labelFor.prepend(radioChoice).fadeIn(500);
                //     radioLabel.appendTo($answers);
                // }

                var radioData = [{
                    value: allQuestions.allQuestions[count].choices[0],
                    label: allQuestions.allQuestions[count].choices[0]
                }, {
                    value: allQuestions.allQuestions[count].choices[1],
                    label: allQuestions.allQuestions[count].choices[1]
                }, {
                    value: allQuestions.allQuestions[count].choices[2],
                    label: allQuestions.allQuestions[count].choices[2]
                }, {
                    value: allQuestions.allQuestions[count].choices[3],
                    label: allQuestions.allQuestions[count].choices[3]
                }];
                var template = $("#answers-template").html();
                var templateScript = Handlebars.compile(template);
                $answers.append(templateScript(radioData));
                if (sessionStorage !== undefined) {
                    $('input:radio[name="answers"]').val([sessionStorage.getItem(count)]);
                }


                if ($('input:radio[name="answers"]:checked').length > 0) {
                    //Check if a button is selected
                    document.getElementById('next').disabled = false; //next enabled
                    document.getElementById('finish').disabled = false; // disable finish button
                    $error.html(''); //error message removed
                }

                // http://jsfiddle.net/RhnvU/ https://stackoverflow.com/questions/596351/how-can-i-get-which-radio-is-selected-via-jquery
                $('input:radio').change(function() {
                    //checks if the radio button matches the correct answer
                    if (sessionStorage !== undefined) {
                        if ($('input:radio[name="answers"]:checked').val() === allQuestions.allQuestions[count].correctAnswer && $('input:radio[name="answers"]:checked').val() !== sessionStorage.getItem(count)) {
                            countMatch++;
                        } else if (count === 4 && $('input:radio[name="answers"]:checked').val() !== allQuestions.allQuestions[count].correctAnswer) {
                            countMatch--;
                        }
                    }

                    // enable next cities selected
                    if ($('input:radio[name="answers"]:checked').length > 0) {
                        //Is Valid
                        document.getElementById('next').disabled = false; //next enabled
                        document.getElementById('finish').disabled = false; // disable finish button
                        $error.html(''); //error message removed
                    }

                    if (sessionStorage !== undefined) {
                        sessionStorage.removeItem(count);
                        sessionStorage.setItem([count], $('input[type=radio]:checked').val()); //session saved
                    }

                    // if (sessionStorage.getItem([count]) !== undefined) {
                    //     $('input:radio[name="answers"]').val([sessionStorage.getItem(count)]);
                    //     document.getElementById('next').disabled = false; //next enabled
                    //     document.getElementById('finish').disabled = false; // disable finish button
                    //     $error.html(''); //error message removed
                    // }

                });
            });

            $previous.on('click', function() {
                count = (count - 1) % allQuestions.allQuestions.length;
                $choices.text(allQuestions.allQuestions[count].question);
                $previous.show();

                $answers.html(""); // clears the choice of cities in answers

                if (count < 1) {
                    $previous.hide();
                    $finish.hide();
                    $next.show();
                }

                if (count > 1) {
                    $next.show();
                    $finish.hide();
                }

                // // LOOPS AND ADDS EACH CHOICES ITEM FROM THE OTHER ARRAYS TO THE ANSWERS FIELD WITH A LABEL
                // for (var i = 0; i < 4; i++) {
                //     var radioBtn = $('<input type="radio" name="answers" />');
                //     var labelFor = $('<label>' + allQuestions.allQuestions[count].choices[i] + '</label>');
                //     var radioChoice = radioBtn.attr('value', allQuestions.allQuestions[count].choices[i]);
                //     var radioLabel = labelFor.prepend(radioChoice);
                //     radioLabel.appendTo($answers);

                //     // var $selected = $('input:radio[name="answers"]:checked').val();
                //     // $selected.attr('checked', true);

                // }

                var radioData = [{
                    value: allQuestions.allQuestions[count].choices[0],
                    label: allQuestions.allQuestions[count].choices[0]
                }, {
                    value: allQuestions.allQuestions[count].choices[1],
                    label: allQuestions.allQuestions[count].choices[1]
                }, {
                    value: allQuestions.allQuestions[count].choices[2],
                    label: allQuestions.allQuestions[count].choices[2]
                }, {
                    value: allQuestions.allQuestions[count].choices[3],
                    label: allQuestions.allQuestions[count].choices[3]
                }];
                var template = $("#answers-template").html();
                var templateScript = Handlebars.compile(template);
                $answers.append(templateScript(radioData));
                if (sessionStorage !== undefined) {
                    $('input:radio[name="answers"]').val([sessionStorage.getItem(count)]);
                }

                // TODO: IE NOT SELECTING THE RADIO BUTTON
                if (sessionStorage !== undefined) {
                    $('input:radio[name="answers"]').val([sessionStorage.getItem(count)]);
                }


                // if (sessionStorage.getItem([count]) == $('input:radio[name="answers"]:checked').val()) {

                // }
                $('input:radio').change(function() {
                    if (sessionStorage !== undefined) {
                        sessionStorage.removeItem(count);
                        sessionStorage.setItem([count], $('input[type=radio]:checked').val());
                    }

                    if ($('input:radio[name="answers"]:checked').val() !== allQuestions.allQuestions[count].correctAnswer) {
                        countMatch--;
                    } else if ($('input:radio[name="answers"]:checked').val() === allQuestions.allQuestions[count].correctAnswer) {
                        countMatch++;
                    }
                });



                // $('input:radio').change(function() {
                //checks if the radio button matches the correct answer
                if (sessionStorage !== undefined) {
                    if ($('input:radio[name="answers"]:checked').val() === allQuestions.allQuestions[count].correctAnswer && $('input:radio[name="answers"]:checked').val() !== sessionStorage.getItem(count)) {
                        countMatch++;
                    }
                }


                // // enable next cities selected
                // if ($('input:radio[name="answers"]:checked').length > 0) {
                //     //Is Valid
                document.getElementById('next').disabled = false; //next enabled
                document.getElementById('finish').disabled = false; // disable finish button
                $error.html(''); //error message removed
                //   }
                // });

            });

            function correctCount(number) {
                var totalQ = 5; // total questions
                var total = (number / totalQ) * 100;
                saveScore(total);
                return total;
            }

            function saveScore(score) {
                quizScores.push(score);
                localStorage.quizScores = JSON.stringify(quizScores);
            }

            $finish.on('click', function() {
                // e.preventDefault();
                $quizForm.hide(); // hides quiz form
                $finish.hide();
                $previous.hide();
                $header.text(""); // Clears current header form
                $header.append('You got ' + countMatch + ' right.' + ' Which is ' + correctCount(countMatch) + '%.');
            });
        });
});
