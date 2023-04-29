$(() => {
    let questions, answers, submitted, index;

    initialize().then(function () {
        $(".nav-btn").click(function () {
            change($(this).attr('id') == 'prev' ? -1 : 1);
        });

        $(".option").click(function () {
            $(".option").css({
                border: 'none',
                boxShadow: 'none'
            });
            $(this).css({
                border: '4px solid #55a9d6',
                boxShadow: '0 0 10px #55a9d6'
            });

            answers.set(index, $(this).index());
        });

        $('.question-btn').click(function () {
            index = $(this).index();
            show();
        });

        $('#submit').click(function () {
            $(this).text(submitted ? 'Submit' : 'Try again');
            submitted ? reset() : submit();
        });
    });

    async function initialize() {
        let response = await fetch('content/quiz.json');
        let json = await response.json();

        index = 0;
        submitted = false;
        answers = new Map();
        questions = json.questions;

        shuffleArray(questions);

        let code = "";

        for (let i = 0; i < questions.length; i++) {
            code += `<button class='question-btn'>${i + 1}</button>`;
            shuffleArray(questions[i].options);
        }

        $("#questions").html(code);

        show();
    }

    function submit() {
        for (let i = 0; i < questions.length; i++) {
            let wrong = false;
            let answer = answers.get(i);

            if (answer == undefined || questions[i].options[answer] != questions[i].answer) wrong = true;

            $($('#questions').children()[i])
                .html(wrong ? '<i class="fa-solid fa-xmark fa-2xl"></i>' : '<i class="fa-solid fa-check fa-2xl"></i>')
                .toggleClass(wrong ? 'wrong-answer' : 'true-answer');
        }

        let answer = answers.get(index);

        for (let i = 0; i < questions[index].options.length; i++) {
            if (questions[index].options[i] == questions[index].answer) {
                if (answer != undefined && answer != i) $($("#options").children()[answer]).css({
                    border: 'none',
                    boxShadow: 'none'
                }).toggleClass('wrong-answer');
                $($("#options").children()[i]).css({
                    border: 'none',
                    boxShadow: 'none'
                }).toggleClass('true-answer');
                break;
            } 
        }

        submitted = true;
    }

    function reset() {
        index = 0;
        submitted = false;
        answers = new Map();

        $("#options").children().each(function() {
            $(this).removeClass().addClass('option');
        });
        
        for (let i = 0; i < questions.length; i++) {
            $($('#questions').children()[i]).text(i + 1).toggleClass().addClass('question-btn');
            shuffleArray(questions[i].options);
        }

        shuffleArray(questions);

        show();
    }

    function change(direction) {
        if (index + direction < 0 || index + direction >= questions.length) return;

        index += direction;

        show();
    }

    function show() {
        $("#question-number").text(`Question ${index + 1} of ${questions.length}`);
        $("#question").text(questions[index].question);

        $("#options").children().each(function () {
            $(this).animate({ opacity: 0 }, 200, function () {
                $(this).css({
                    border: 'none',
                    boxShadow: 'none'
                }).text(questions[index].options[$(this).index()]);

                if (submitted) {
                    if ($(this).hasClass('wrong-answer')) $(this).toggleClass('wrong-answer');
                    else if ($(this).hasClass('true-answer')) $(this).toggleClass('true-answer');
                }
            });
        });

        let answer = answers.get(index);
        let wrongAnswer, trueAnswer;

        if (submitted) {
            for (let i = 0; i < questions[index].options.length; i++) {
                if (questions[index].options[i] == questions[index].answer) {
                    if (answer != undefined && answer != i) wrongAnswer = answer;
                    trueAnswer = i;
                    break;
                } 
            }
        }

        new Promise(function (resolve, reject) {
            $($("#options").children()[0]).animate({ opacity: 1 }, 200, function () {
                if (answer == 0 && !submitted) $(this).css({
                    border: '4px solid #55a9d6',
                    boxShadow: '0 0 10px #55a9d6'
                });
                else if (trueAnswer == 0) $(this).toggleClass('true-answer');
                else if (wrongAnswer == 0) $(this).toggleClass('wrong-answer');
                resolve("done");
            });
        }).then(function () {
            return new Promise(function (resolve, reject) {
                $($("#options").children()[1]).animate({ opacity: 1 }, 200, function () {
                    if (answers == 1 && !submitted) $(this).css({
                        border: '4px solid #55a9d6',
                        boxShadow: '0 0 10px #55a9d6'
                    });
                    else if (trueAnswer == 1) $(this).toggleClass('true-answer');
                    else if (wrongAnswer == 1) $(this).toggleClass('wrong-answer');
                    resolve("done");
                });
            })
        }).then(function () {
            return new Promise(function (resolve, reject) {
                $($("#options").children()[2]).animate({ opacity: 1 }, 200, function () {
                    if (answer == 2 && !submitted) $(this).css({
                        border: '4px solid #55a9d6',
                        boxShadow: '0 0 10px #55a9d6'
                    });
                    else if (trueAnswer == 2) $(this).toggleClass('true-answer');
                    else if (wrongAnswer == 2) $(this).toggleClass('wrong-answer');
                    resolve("done");
                });
            })
        }).then(function () {
            return new Promise(function (resolve, reject) {
                $($("#options").children()[3]).animate({ opacity: 1 }, 200, function () {
                    if (answer == 3 && !submitted) $(this).css({
                        border: '4px solid #55a9d6',
                        boxShadow: '0 0 10px #55a9d6'
                    });
                    else if (trueAnswer == 3) $(this).toggleClass('true-answer');
                    else if (wrongAnswer == 3) $(this).toggleClass('wrong-answer');
                    resolve("done");
                });
            })
        });

        $(".question-btn").css("opacity", ".5");
        $(".question-btn").eq(index).css("opacity", "1");
    }

    function shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }
});
