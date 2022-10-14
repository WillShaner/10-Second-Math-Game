var response;
var randNum = function(size) {
    return Math.floor(Math.random() * size);
}
function getHighscore() {
    $.ajax({
        type: 'GET',
        url: 'https://fewd-todolist-api.onrender.com/tasks/133?api_key=21',
        dataType: 'json',
        success: function (response, textStatus) {
            var highScore = response.task
            highScore = highScore.content
            $('#HSval').html(highScore)

        },
        error: function (request, textStatus, errorMessage) {
          console.log(errorMessage);
        }
      });
}
var newHighscore = function () {
    $.ajax({
      type: 'PUT',
      url: 'https://fewd-todolist-api.onrender.com/tasks/133?api_key=21',
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify({
        task: {
          content: $('#score').text()
        }
      }),
      success: function (response, textStatus) {
        getHighscore()
    },
      error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
      }
    });
  }

$(document).ready(function() {
    getHighscore()
    var checkHighscore = function() {
        var currentHS = Number($('#HSval').html())
        if(score > currentHS) {
            newHighscore()
        }
      }
    var currentQuestion;
    var sec = 10;
    var score = 0;
    var interval;
    var gameLive;
    var startGame = function() {
        if(gameLive) {
            $('.startGame').removeAttr("id")
            $('.timerMin').html("seconds remaining!")
        if(!interval) {
            if(sec === 0) {
                updateSeconds(10)
                updateScore(-score)
            }
            interval = setInterval(function() {
                updateSeconds(-1)
                if(sec === 0) {
                    $("#timer").text("TIMES UP!")
                    $('.timerMin').html("Your score:  " + score)
                    $('.startGame').text("CLICK TO PLAY AGAIN")
                    clearInterval(interval)
                    interval = undefined
                    gameLive = false
                    checkHighscore()
                }
            }, 1000);
        }
        }

    }
    var updateScore = function(amount) {
        score += amount;
        $('#score').text(score);
    }

    function checkDif() {
        var empty = [];
        if($('#add').is(":checked")) {
            empty.push('+')
        }
        if($('#sub').is(":checked")) {
            empty.push('-')
        }
        if($('#mult').is(":checked")) {
            empty.push('*')
        }
        if($('#div').is(":checked")) {
            empty.push('/')
        }
        if(empty.length === 0) {
            gameLive = false
            console.log(gameLive)
        }
        return empty
    }

    var question = function() {
        var max = Number(($("#slider").val()))
        var arr = checkDif()
        var question = {}
        var a = randNum(max) + 1
        var b = randNum(max) + 1
        var rand = randNum(arr.length)
        var symbol = arr[rand]
        var prod = a * b
        question.value = 1

        if(max >= 20) {
            question.value += 3
        }
        if(max >= 30) {
            question.value += 4
        }
        if(max >= 40) {
            question.value += 5
        }
        if(max == 50) {
            question.value += 7
        }

        console.log(a, b, symbol)
        switch(symbol) {
            case '+':
                console.log("add")
                question.equation = a + symbol + b
                question.answer =  a + b
                break
            case '-':
                if(a < b) {
                    console.log("sub")
                    question.answer =  b - a
                    question.equation = b + symbol + a
                    break
                }
                console.log("sub2")
                question.equation = a + symbol + b
                question.answer = a - b
                break
            case '*':
                console.log("mult")
                question.equation = a + symbol + b
                question.answer = a * b
                question.value += 2
                break
            case '/':
                console.log("div")
                question.equation = prod + symbol + a
                question.answer =  prod / a
                question.value += 3
                break
}
    console.log(question.equation, question.answer, question.value)
    return question
    }
    var checkAnswer = function(userInput, answer) {
        console.log(userInput, answer)

        if(gameLive) {
             if(userInput === answer) {

                $('#answer').val("")
                newQuestion()
                updateSeconds(+1)
                updateScore(+Number(currentQuestion.value))
                $('#grade').text("correct")
            }
            else {
                $('#grade').text("incorrect")
            }
        }
    }

    function newQuestion() {
        currentQuestion = question()
        console.log(currentQuestion)
        $('#problem').html(currentQuestion.equation)
    }
    
    var updateSeconds = function(amount) {
        sec += amount
        $("#timer").text(sec)
    }

    $('#answer').on('keyup', function() {
        if(gameLive) {
            checkAnswer(Number($(this).val()), currentQuestion.answer);
        }
    })
    $('.startGame').on("click", function() {
        gameLive = true;
        getHighscore();
        $("#timer").text(sec);
        checkDif();
        startGame();
        newQuestion();
    })

    $("#slider").on("input", function() {
        $("#value").html($("#slider").val());
    })
})
