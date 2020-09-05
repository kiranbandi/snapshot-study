var trialStartTime;
var qOrder = 0;
var currentQuestions = studyQuestions['snapshot'];

countOfAllSnapshots = 0;
countOfSnapshotClick = 0;
countOfSnapshotCreated = 0;
countOfSnapshotDeleted = 0;
countOfWrongAnswers = 0;

// hide other unused snapshot toggles
$("#snapshot-mode-checkbox").hide();
$("label[for='snapshot-mode-checkbox']").hide();
// fire of the snapshot study and hide the other controls
$('.snapshot-trigger').click();
$('.snapshot-trigger').hide();

// trigger information box
Swal.fire({
    title: "The study will now begin. Consider using the snapshot panel to answer questions about repeated names.",
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

                if (!checkAnswer(value)) {
                    countOfWrongAnswers += 1;
                    // After 5 attempts let the user through
                    if (countOfWrongAnswers == 3) {
                        return '';
                    } else {
                        return 'That is not the correct answer please try again';
                    }

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
        snapshotMode: 'autosnap',
        nameSearchCount: countOfNameSearch,
        snapshotCreatedCount: countOfSnapshotCreated,
        snapshotDeletedCount: countOfSnapshotDeleted,
        snapshotRecalledCount: countOfSnapshotClick,
        snapshotAllCount: countOfAllSnapshots,
        wrongAttemptCount: countOfWrongAnswers
    };
    console.log("logging response for study question - ", qOrder);
    $.post("#", trialResult).then(function() {
        // after results are posted 
        $("#study-trigger").text('ANSWER');
        qOrder += 1;
        if (qOrder == 23) {
            alert('Your study round is complete. This page will now automatically close and you will be redirected to the next page to answer some questions.');
            window.location.href = "/redirect_next_page";
        } else {
            showQuestion();
        }
    })
};


var showQuestion = function() {
    trialStartTime = new Date();
    clearCount();
    $('#study-question').text(currentQuestions[qOrder].label);
    $("#study-trigger").text('ANSWER');
}

var checkAnswer = function(value) {
    return value.trim().replace(/\s/g, '').toLocaleLowerCase() == currentQuestions[qOrder].answer;
}


function deleteSnapshotTriggered() {
    countOfSnapshotDeleted = countOfSnapshotDeleted + 1;
    countOfAllSnapshots = countOfAllSnapshots - 1;
}

function storeSnapshotTriggered(snapshotData) {
    countOfSnapshotCreated = countOfSnapshotCreated + 1;
    countOfAllSnapshots = countOfAllSnapshots + 1;
}

function recallSnapshotTriggered() {
    countOfSnapshotClick = countOfSnapshotClick + 1;
}

function clearCount() {
    countOfNameSearch = 0;
    countOfSnapshotClick = 0;
    countOfSnapshotCreated = 0;
    countOfSnapshotDeleted = 0;
    countOfWrongAnswers = 0;
}