$(document).ready(function() {
    let gameObject = {
        questions: [],
        correctAnswers: 0,
        incorrectAnswers: 0,
        generateQuestions() {
            $.ajax({
                url: `https://opentdb.com/api.php?amount=10&category=20&type=multiple`,
                method: "GET"
            }).then(function(response) {
                this.questions = response.results;
            })
        },
        runTimer(startingTime, afterFunction) {
            $("#main-header").html(startingTime);
            let time = startingTime - 1;
            let intervalId = setInterval(function () {
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
        }
    };
    gameObject.generateQuestions();   
})