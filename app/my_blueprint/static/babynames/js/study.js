var trialStartTime;
var qOrder = 0;
var currentQuestions = studyQuestions['no-snapshot'];

// trigger information box
Swal.fire({
    title: "The study will now begin.",
    confirmButtonText: 'START',
    showCancelButton: false,
    allowOutsideClick: false,
}).then(() => { showQuestion() })

// handle answering
$("#study-trigger").on('click', function() {
    if ($("#study-trigger").text() == 'ANSWER') {
        Swal.fire({
            title: currentQuestions[qOrder].label,
            input: 'text',
            confirmButtonText: 'SUBMIT',
            showCancelButton: true,
            allowOutsideClick: true,
            inputValidator: (value) => {
                if (!value) {
                    return 'You answer cannot be empty'
                }
                if (currentQuestions[qOrder].type == 'boolean' && (value.toLocaleLowerCase() != 'yes' && value.toLocaleLowerCase() != 'no')) {
                    return "You must answer in yes or no"
                }
            }
        }).then((response) => {
            if (response.isConfirmed) { logResponse(response.value) }
        })
    } else { showQuestion() }
})

var logResponse = function(user_answer) {
    $("#study-trigger").text('Loading...');
    // get end time
    var endTime = new Date();
    // formulate json to store in DB.
    var trialResult = {
        trialStart: trialStartTime,
        trialEnd: endTime,
        trialTime: endTime - trialStartTime,
        studyMode: 'study',
        questionNumber: qOrder + 1,
        response: user_answer,
        correct: checkAnswer(user_answer),
        snapshotMode: 'nosnap',
        nameSearchCount: countOfNameSearch
    };
    console.log("logging response for study question - ", qOrder);
    $.post("#", trialResult).then(function() {
        // after results are posted 
        $("#study-trigger").text('ANSWER');
        qOrder += 1;
        if (qOrder == 15) {
            alert('Your study round is complete. This page will now automatically close and you will be redirected to the debriefing page.');
            window.location.href = "/redirect_next_page";
        } else {
            showQuestion();
        }
    })
};


var showQuestion = function() {
    trialStartTime = new Date();
    countOfNameSearch = 0;
    $('#study-question').text(currentQuestions[qOrder].label);
    $("#study-trigger").text('ANSWER');
}

var checkAnswer = function(value) {
    return value.trim().toLocaleLowerCase() == currentQuestions[qOrder].answer;
}