var trialStartTime;
var qOrder = 0;
countOfNameSearch = 0;

var currentQuestions = [{
        "label": "Was the girl's name AMANDA popular(ranked in top 10) in the year 2005? (answer with yes or no)",
        "type": "boolean",
        "answer": "no"
    }, {
        "label": "In the year 1940 what was the rank of boy's name JOHN?",
        "type": "number",
        "answer": "3"
    }, {
        "label": "In the decade between 1940 and 1950 what was the most popular boy's name?",
        "type": "number",
        "answer": "james"
    }, {
        "label": "In the year 1990 what was the rank of girl's name AMANDA?",
        "type": "number",
        "answer": "4"
    },
    {
        "label": "What was the highest rank ever achieved by the girl's name CAROL? (where 1 is the highest rank and 10 the lowest)",
        "type": "boolean",
        "answer": "4"
    }
]

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
        text: 'First explore the chart then after you are ready, click on the red coloured "START PRACTICE" button in the top right corner. ',
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
                logResponse(response.value);
            }
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
        snapshotMode: 'nosnap',
        nameSearchCount: countOfNameSearch
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
    trialStartTime = new Date();
    countOfNameSearch = 0;
    $('#study-question').text(currentQuestions[qOrder].label);
    $("#study-trigger").text('ANSWER');
}

var checkAnswer = function(value) {
    return value.trim().toLocaleLowerCase() == currentQuestions[qOrder].answer;
}