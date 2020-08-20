import datetime
from flask import Blueprint, render_template
from BOFS.util import *
from BOFS.globals import db
from BOFS.admin.util import verify_admin

# The name of this variable must match the folder's name.
my_blueprint = Blueprint('my_blueprint', __name__,
                         static_url_path='/my_blueprint',
                         template_folder='templates',
                         static_folder='static')


@my_blueprint.route("/ishihara", methods=['POST', 'GET'])
@verify_correct_page
@verify_session_valid
def color_test():
    incorrect = None

    if request.method == 'POST':
        log = db.emphasis()
        log.participantID = session['participantID']
        log.vision = request.form['vision']
        log.vissioncomment = request.form['vissioncomment']
        log.deficiency = request.form['deficiency']
        log.deficiencyText = request.form['deficiencyText']
        log.response07 = request.form['response07']
        log.response01 = request.form['response01']
        log.response08 = request.form['response08']
        log.response06 = request.form['response06']
        log.response10 = request.form['response10']


        db.session.add(log)
        db.session.commit()
#or log.response10.lower() != "5"
        if log.response01.lower() != "12":
            incorrect = True
            return render_template("eligibility.html", example="This is example text.")
        else:
            return redirect("/redirect_next_page")
        #if log.one.lower() == "74" and log.two.lower() == "12" and log.three.lower() == "6" and log.four.lower() == "15":
        #    return redirect("/redirect_next_page")
        #else:
        #    incorrect = True
        #    return render_template("eligibility.html", example="This is example text.")


    return render_template("ishihara.html", example="This is example text.", incorrect=incorrect)



@my_blueprint.route("/eligibility", methods=['POST', 'GET'])
@verify_correct_page
@verify_session_valid
def eligibility():
    incorrect = None

    return render_template("eligibility.html", example="This is example text.")

@my_blueprint.route("/pre-study", methods=['POST', 'GET'])
@verify_correct_page
@verify_session_valid
def pre_study():


    return render_template("pre-study.html", example="This is example text.")



@my_blueprint.route("/practice", methods=['POST', 'GET'])
@verify_correct_page
@verify_session_valid
def practice_results():
    incorrect = None

    return render_template("practice.html", example="This is example text.")

@my_blueprint.route("/debrief", methods=['POST', 'GET'])
@verify_correct_page
@verify_session_valid
def debrief():
    incorrect = None

    return render_template("debrief.html", example="This is example text.")


@my_blueprint.route("/study", methods=['POST', 'GET'])
@verify_correct_page
@verify_session_valid
def study_results():
    if request.method == 'POST':
        log = db.emphasis()
        log.participantID = session['participantID']
        log.trialStart = request.form['trialStart']
        log.trialEnd = request.form['trialEnd']
        log.trialTime = request.form['trialTime']
        log.stimuli = request.form['stimuli']
        #log.stimuliColor = request.form['stimuliColor']
        log.userRating = request.form['userRating']
        log.level = request.form['level']
        log.targetPresent = request.form['targetPresent']
        log.targetShape = request.form['targetShape']
        log.targetSize = request.form['targetSize']
        log.targetX = request.form['targetX']
        log.targetY = request.form['targetY']
        log.distanceFromCenter = request.form['distanceFromCenter']
        log.distractorBlur = request.form['distractorBlur']
        log.distractorOpacity = request.form['distractorOpacity']
        log.response = request.form['response']
        log.correct = request.form['correct']


        db.session.add(log)
        db.session.commit()

    return render_template("study.html", example="This is example text.")



@my_blueprint.route("/analysis")
@verify_admin
def analysis():
    results = db.session.query(
            db.Participant.participantID,
            db.func.count(db.MyTable.ID).label('tries')
        ).\
        join(db.MyTable, db.MyTable.participantID == db.Participant.participantID).\
        filter(db.Participant.finished).\
        group_by(db.MyTable.participantID)

    return render_template("analysis.html", results=results)
