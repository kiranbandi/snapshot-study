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
        log = db.snapshot()
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
