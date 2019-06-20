$(document).ready(function() {
    "use strict"
    var intervalId;
    let gameObject = {
        questions: [],
        correctAnswersCount: 0,
        incorrectAnswersCount: 0,
        questionIndex: 0,
        generateQuestions() {
            $.ajax({
                url: `https://opentdb.com/api.php?amount=20&category=20&type=multiple`,
                method: "GET"
            }).then(function(response) {
                gameObject.questions = response.results.sort(function() { return 0.5 - Math.random() });
            })
        },
        runTimer(startingTime, afterFunction) {
            $("#main-header").html(startingTime);
            let time = startingTime - 1;
            intervalId = setInterval(function () {
                if (time === 0) {
                    clearInterval(intervalId);
                    afterFunction();
                    return;
                }
                else {
                    $("#main-header").html(time);
                    time--;
                }
            }, 1000)
        },
        writeQuestion() {
            let activeQuestion = this.questions[this.questionIndex];
            $("#main-text").html(this.questionIndex+1+". "+activeQuestion.question);
            let correctAnswerIndex = Math.floor(Math.random() * 4);
            let incorrectAnswers = activeQuestion.incorrect_answers.sort(function() { return .5 - Math.random()})
            let incorrectAnswerIndex = 0;
            $("#main-buttons").empty();
            for (let i = 0; i < 4; i++) {
                if (i === correctAnswerIndex) {
                    $("#main-buttons").append(`<button class="button-answer" value="true">${activeQuestion.correct_answer}</button>`)
                }
                else {
                    $("#main-buttons").append(`<button class="button-answer" value="false">${incorrectAnswers[incorrectAnswerIndex]}</button>`)                    
                    incorrectAnswerIndex++
                }
            }
            this.questionIndex++;
            this.runTimer(10, function() { gameObject.evaluateAnswer("false", activeQuestion) })
            $(".button-answer").click(function() {
                clearInterval(intervalId);
                if (gameObject.questionIndex === 20) {
                    gameObject.endGame()
                    gameObject.questionIndex = 0;
                }
                else {
                    gameObject.evaluateAnswer($(this).attr("value"), activeQuestion);
                }
            })
        },
        evaluateAnswer(answerValue, questionObject) {
            $("#main-buttons").html("<button id='next'>Next Question?</button>");
            if (answerValue === "true") {
                $("#main-text").html("You are correct!")
                this.correctAnswersCount++
            }
            else {
                $("#main-text").html(`Sorry! The correct answer was "${questionObject.correct_answer}"`)
                this.incorrectAnswersCount++
            }
            this.runTimer(5, function () { gameObject.writeQuestion() })
            $("#next").click(function() {
                clearInterval(intervalId);
                gameObject.writeQuestion();
            })
        },
        endGame() {
            $("#main-header").html("Finished!")
            $("#main-text").html(`You got ${this.correctAnswersCount} correct and ${this.incorrectAnswersCount} incorrect!`)
            $("#main-buttons").html("<button id='play-again'>Play Again?</button>")
            $("#play-again").click(function() {
                gameObject.generateQuestions();
                gameObject.runTimer(5, function() { gameObject.writeQuestion() })
            })
        }
    };
    gameObject.generateQuestions();  
    
    $("#play").click(function() { gameObject.writeQuestion() });
})