var isSnapshot = true;


var trialStartTime;
var qOrder = 0;
var currentQuestions = studyQuestions[isSnapshot ? 'snapshot' : 'no-snapshot'];
var answers = [];

if (!isSnapshot) {
    // hide snapshot
    $('.snapshot-custom-wrapper').hide();

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
            text: 'Every name is represented by a line and line thickness stands for the highest position ever reached by a name'
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
            text: 'First explore the chart for a minute then after you are done exploring, click the red coloured next button in the top right corner. ',
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
                allowOutsideClick: false,
                inputValidator: (value) => {
                    if (!value) {
                        return 'You answer cannot be empty'
                    }
                    if (currentQuestions[qOrder].type == 'boolean' && (value.toLocaleLowerCase() != 'yes' && value.toLocaleLowerCase() != 'no')) {
                        return "You must answer in yes or no"
                    }

                }
            }).then((response) => {
                if (response.isConfirmed) {
                    answers.push(response.value);
                    qOrder += 1;
                    if (qOrder == 15) {
                        alert('study complete');
                        console.log(answers);
                    } else {
                        trialStartTime = new Date();
                        $('#study-question').text(currentQuestions[qOrder].label);
                    }
                }
            })

        } else {
            trialStartTime = new Date();
            $('#study-question').text(currentQuestions[qOrder].label);
            $("#study-trigger").text('ANSWER');
        }
    })
} else {
    // hide snapshot
    $('.snapshot-custom-wrapper').show();

    // trigger information box
    Swal.mixin({
        confirmButtonText: 'Next &rarr;',
        showCancelButton: false,
        allowOutsideClick: false,
        progressSteps: ['1', '2', '3', '4', '5', '6']
    }).queue([{
            title: '10 Popular Baby Names in US - SNAPSHOT',
            text: 'This chart shows the 10 most popular baby names per year since 1880 in USA.'
        },
        {
            text: 'You can search for over 50 plus unique boy and girl names that have entered the top 10 in the last 135 years and see their rise and fall. '
        },
        {
            text: 'Every name is represented by a line and line thickness stands for the highest position ever reached by a name'
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
            text: 'First explore the chart for a minute then after you are done exploring, click the red coloured next button in the top right corner. ',
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
                allowOutsideClick: false,
                inputValidator: (value) => {
                    if (!value) {
                        return 'You answer cannot be empty'
                    }
                    if (currentQuestions[qOrder].type == 'boolean' && (value.toLocaleLowerCase() != 'yes' && value.toLocaleLowerCase() != 'no')) {
                        return "You must answer in yes or no"
                    }

                }
            }).then((response) => {
                if (response.isConfirmed) {

                    postResponseValues(response.value);


                }
            })

        } else {
            $('#study-question').text(currentQuestions[qOrder].label);
            $("#study-trigger").text('ANSWER');
        }
    })
}

function urlParam(name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)')
        .exec(window.location.search);

    return (results !== null) ? results[1] || 0 : false;
}


var postResponseValues = function(user_answer, questionNumber, snapshotMode = false, correct = true) {


    $("#study-trigger").text('Loading...');

    endTime = new Date();

    var trialResult = {
        trialStart: trialStartTime,
        trialEnd: endTime,
        trialTime: endTime - trialStartTime,
        snapshotMode: snapshotMode,
        questionNumber: questionNumber,
        response: user_answer,
        correct: correct
    };

    $.post("#", trialResult).then(function() {
        $("#study-trigger").text('ANSWER');
        // after results are posted 
        qOrder += 1;
        if (qOrder == 15) {
            alert('study complete');

        } else {
            $('#study-question').text(currentQuestions[qOrder].label);

        }
    })
};