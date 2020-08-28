var trialStartTime;
var qOrder = 0;
countOfNameSearch = 0;

countOfAllSnapshots = 0;

countOfSnapshotClick = 0;
countOfSnapshotCreated = 0;
countOfSnapshotDeleted = 0;

var waitingMode = 'store-snapshot';

// First hide the snapshot panel 
$(".snapshot-custom-wrapper").hide();

var currentQuestions = [{
    "label": "Was the girl's name AMANDA popular(ranked in top 10) in the year 2005? (answer with yes or no)",
    "type": "boolean",
    "answer": "no"
}, {
    "label": "In the year 1940 what was the rank of boy's name JOHN?",
    "type": "number",
    "answer": "3"
}, {
    "label": "In the decade between 1940 and 1950 what was the most popular boy's name (rank number 1)?",
    "type": "number",
    "answer": "james"
}, {
    "label": "In the year 1990 what was the rank of girl's name AMANDA. (use the snapshot you created for AMANDA to quickly switch instead of searching for AMANDA again)?",
    "type": "number",
    "answer": "4"
}, {
    "label": "What was the highest rank ever achieved by the girl's name CAROL? (where 1 is the highest rank and 10 the lowest)",
    "type": "boolean",
    "answer": "4"
}]

// trigger information box
Swal.mixin({
    confirmButtonText: 'Next &rarr;',
    showCancelButton: false,
    allowOutsideClick: false,
    progressSteps: ['1', '2', '3', '4', '5', '6']
}).queue([{
        title: '10 Popular Baby Names in US',
        text: 'This chart shows the 10 most popular baby names per year since 1880 in USA.'
    },
    {
        text: 'You can search for over 50 plus unique boy and girl names that have entered the top 10 in the last 135 years and see their rise and fall. '
    },
    {
        text: 'Every name is represented by a line and line thickness stands for the highest rank ever reached by a name'
    },
    {
        text: 'Click on a name line or search for it to see its full reign in the top 10. To cancel your selection click the reset button.'
    },
    {
        text: 'You can toggle between the genders and use the small overview at the bottom to select a particular time period.'
    },
    {
        text: 'Play around with the chart by searching for names, toggling the gender buttons and changing the year selector at the bottom.'
    }
]).then(() => {
    Swal.fire({
        text: 'First explore the chart then after you are ready, click on the red coloured "NEXT" button in the top right corner. ',
        confirmButtonText: 'Explore the chart'
    })
})

$("#study-trigger").on('click', function() {
    if ($("#study-trigger").text() == 'ANSWER') {
        Swal.fire({
            title: currentQuestions[qOrder].label,
            input: 'text',
            confirmButtonText: 'SUBMIT',
            showCancelButton: true,
            allowOutsideClick: true,
            inputValidator: (value) => {
                if (!checkAnswer(value)) {
                    return 'That is not the correct answer please try again';
                }
            }
        }).then((response) => {
            if (response.isConfirmed) {

                if (qOrder == 0) {
                    Swal.fire({
                        text: 'Now that you have searched for AMANDA. click on the snapshot button to create a snapshot so that it can be used when a question regarding AMANDA comes up again.',
                        confirmButtonText: 'OK'
                    })
                }
                logResponse(response.value);
            }
        })

    } else if ($("#study-trigger").text() == 'NEXT') {

        // show the snapshot panel
        $(".snapshot-custom-wrapper").show();

        // trigger information box
        Swal.mixin({
            confirmButtonText: 'Next &rarr;',
            showCancelButton: false,
            allowOutsideClick: false,
            progressSteps: ['1', '2', '3', '4']
        }).queue([{
                title: 'Snapshot Panel',
                text: 'This is a special panel that can be found in the top left corner of the page. You can move it to wherever you want by clicking on it and dragging it.'
            },
            {
                text: 'When you interact with the visualization by clicking on a line or searching for a name you have performed a unique action'
            },
            {
                text: 'The snapshot panel tracks these actions and can be used to create snapshots of the visualization at that point in time. You can then click on these snapshots to recreate your action.'
            },
            {
                text: 'For example, searching for the name EMMA or clicking on the line representing the name EMMA is an action. After you have done this once, you can then click on the snapshot button and it will create a saved snapshot of that action.'
            },
            {
                text: "Then in future when you need to search for EMMA again you dont need to type in EMMA in the search bar but can instead simply click on the snapshot EMMA and the system will automatically recreate the snapshot for you."
            }
        ]).then(() => {
            Swal.fire({
                text: 'Lets try this out. First click on any line in the chart. Then after you are done, click on the snapshot button.',
                confirmButtonText: 'Go'
            });
            // hide question box
            $('#study-question').text("Lets try this out. First click on any line in the chart. Then after you are done, click on the snapshot button.");
            $("#study-trigger").hide();

        })
    } else {
        showQuestion();
    }
})

var logResponse = function(user_answer) {

    $("#study-trigger").text('Loading...');

    var endTime = new Date();

    // formulate json to store in DB.
    var trialResult = {
        trialStart: trialStartTime,
        trialEnd: endTime,
        trialTime: endTime - trialStartTime,
        studyMode: 'practice',
        questionNumber: qOrder + 1,
        response: user_answer,
        correct: checkAnswer(user_answer),
        snapshotMode: 'snap',
        nameSearchCount: countOfNameSearch,
        snapshotCreatedCount: countOfSnapshotCreated,
        snapshotDeletedCount: countOfSnapshotDeleted,
        snapshotRecalledCount: countOfSnapshotClick,
        snapshotAllCount: countOfAllSnapshots
    };

    console.log("logging response for practice question - ", qOrder);
    $.post("#", trialResult).then(function() {
        // after results are posted 
        $("#study-trigger").text('ANSWER');
        qOrder += 1;
        if (qOrder == 5) {
            alert('Your practice round is complete. This page will now automatically close and you will be redirected to the study page.');
            window.location.href = "/redirect_next_page";
        } else {
            showQuestion();
        }
    })
};



var showQuestion = function() {
    // show question box if it is hidden
    $(".study-trigger").show();
    trialStartTime = new Date();
    clearCount();
    $('#study-question').text(currentQuestions[qOrder].label);
    $("#study-trigger").text('ANSWER');
}

var checkAnswer = function(value) {
    return value.trim().toLocaleLowerCase() == currentQuestions[qOrder].answer;
}



function deleteSnapshotTriggered() {
    countOfSnapshotDeleted = countOfSnapshotDeleted + 1;
    countOfAllSnapshots = countOfAllSnapshots - 1;
}

function storeSnapshotTriggered(snapshotData) {

    countOfSnapshotCreated = countOfSnapshotCreated + 1;
    countOfAllSnapshots = countOfAllSnapshots + 1;

    if (waitingMode == 'store-snapshot' && !!snapshotData.name) {
        // trigger information box
        Swal.fire({
            'text': "Perfect, you have created your first snapshot. You can click on it to go that state. Now reset the chart by clicking the reset button. Then click on the snapshot that you created earlier inside the snapshot panel. ",
            confirmButtonText: 'Next &rarr;',
            showCancelButton: false,
            allowOutsideClick: false
        });
        waitingMode = 'recall-snapshot';

        $('#study-question').text("Now first reset the chart by clicking the reset button, then click on the snapshot that you created earlier inside the snapshot panel.");
    }
}

function recallSnapshotTriggered() {

    countOfSnapshotClick = countOfSnapshotClick + 1;

    if (waitingMode == 'recall-snapshot') {

        waitingMode = '';
        // trigger information box
        setTimeout(function() {
            // trigger information box
            Swal.mixin({
                confirmButtonText: 'Next &rarr;',
                showCancelButton: false,
                allowOutsideClick: false,
                progressSteps: ['1', '2', '3', '4', '5']
            }).queue([{
                    text: 'Perfect, you have now switched back to the state of the visualization stored in the snapshot you just clicked.'
                },
                {
                    text: 'You will now begin your practice round. You will be asked 5 questions. You can only proceed to the actual experiment once you answer them all correctly.'
                },
                {
                    text: "Each question will be based around a boy or a girl's name. When you search for a name to answer a question. Create a snapshot of the system."
                },
                {
                    text: 'This snapshot can then be used when a question regarding the same name comes up again.'
                },
                {
                    text: "Also note that the snapshot panel can be dragged around the screen by clicking on the mouse button anywhere on the panel and then dragging it"
                }
            ]).then(() => {
                Swal.fire({
                    text: 'Before we get started with the practice round. Try dragging the snapshot panel. Place it in a position that you prefer the most. Then click on the start practice button.',
                    confirmButtonText: 'OK'
                });
                $("#study-trigger").show();
                $('#study-question').text("Drag the snapshot panel by clicking on it and then dragging your mouse. Move it to a place that you prefer the most.  Then click on the start practice button.");
                $("#study-trigger").text('START PRACTICE');
            })
        }, 1000);
    }
}


function clearCount() {
    countOfNameSearch = 0;
    countOfSnapshotClick = 0;
    countOfSnapshotCreated = 0;
    countOfSnapshotDeleted = 0;
}