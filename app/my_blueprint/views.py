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
        log = db.visionTest()
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

        if log.response01.lower() != "12":
            incorrect = True
            return render_template("eligibility.html", example="This is example text.")
        else:
            return redirect("/redirect_next_page")


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
    if request.method == 'POST':
        log = db.tutorial()
        log.participantID = session['participantID']
        log.trialStart = request.form['trialStart']
        log.trialEnd = request.form['trialEnd']
        log.trialTime = request.form['trialTime']
        log.condition = request.form['condition']
        log.image = request.form['image']
        log.image_type = request.form['image_type']
        log.description = request.form['description']

        db.session.add(log)
        db.session.commit()

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
def selections_emph():
    if request.method == 'POST':
        log = db.encoding()


        db.session.add(log)
        db.session.commit()

    return render_template("study.html", example="This is example text.")



@my_blueprint.route("/studyNoEmph", methods=['POST', 'GET'])
@verify_correct_page
@verify_session_valid
def selections_NoEmph():
    if request.method == 'POST':
        log = db.encoding()


        db.session.add(log)
        db.session.commit()

    return render_template("studyNoEmph.html", example="This is example text.")


@my_blueprint.route("/studyChanging", methods=['POST', 'GET'])
@verify_correct_page
@verify_session_valid
def selections_Changing():
    if request.method == 'POST':
        log = db.encoding()


        db.session.add(log)
        db.session.commit()

    return render_template("studyChanging.html", example="This is example text.")

@my_blueprint.route("/studyTaskChanging", methods=['POST', 'GET'])
@verify_correct_page
@verify_session_valid
def study_results4():
    if request.method == 'POST':
        log = db.emphasis()
        log.participantID = session['participantID']
        log.trialStart = request.form['trialStart']
        log.trialEnd = request.form['trialEnd']
        log.trialTime = request.form['trialTime']
        log.stage = request.form['study']
        log.condition = request.form['condition']
        log.emphasis_type = request.form['emph_type']
        log.vis_type = request.form['vis_type']
        log.target = request.form['target']
        log.anchor = request.form['anchor']
        log.targetX = request.form['targetX']
        log.targetY = request.form['targetY']
        log.errorCount = request.form['errorCount']
        log.hoverCount = request.form['hoverCount']

        db.session.add(log)
        db.session.commit()

    return render_template("studyTaskChanging.html", example="This is example text.")


@my_blueprint.route("/studyTaskEmph", methods=['POST', 'GET'])
@verify_correct_page
@verify_session_valid
def study_results2():
    if request.method == 'POST':
        log = db.emphasis()
        log.participantID = session['participantID']
        log.trialStart = request.form['trialStart']
        log.trialEnd = request.form['trialEnd']
        log.trialTime = request.form['trialTime']
        log.stage = request.form['study']
        log.condition = request.form['condition']
        log.emphasis_type = request.form['emph_type']
        log.vis_type = request.form['vis_type']
        log.target = request.form['target']
        log.anchor = request.form['anchor']
        log.targetX = request.form['targetX']
        log.targetY = request.form['targetY']
        log.errorCount = request.form['errorCount']
        log.hoverCount = request.form['hoverCount']

        db.session.add(log)
        db.session.commit()

    return render_template("studyTaskEmph.html", example="This is example text.")


@my_blueprint.route("/studyTaskNoEmph", methods=['POST', 'GET'])
@verify_correct_page
@verify_session_valid
def study_results3():
    if request.method == 'POST':
        log = db.emphasis()
        log.participantID = session['participantID']
        log.trialStart = request.form['trialStart']
        log.trialEnd = request.form['trialEnd']
        log.trialTime = request.form['trialTime']
        log.stage = request.form['study']
        log.condition = request.form['condition']
        log.emphasis_type = request.form['emph_type']
        log.vis_type = request.form['vis_type']
        log.target = request.form['target']
        log.anchor = request.form['anchor']
        log.targetX = request.form['targetX']
        log.targetY = request.form['targetY']
        log.errorCount = request.form['errorCount']
        log.hoverCount = request.form['hoverCount']

        db.session.add(log)
        db.session.commit()

    return render_template("studyTaskNoEmph.html", example="This is example text.")


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
