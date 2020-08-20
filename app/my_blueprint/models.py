def create(db):
    class emphasis(db.Model):
        __tablename__ = "snapshotV01"
        ID = db.Column(db.Integer, primary_key=True, autoincrement=True)
        participantID = db.Column(db.Integer, db.ForeignKey('participant.participantID'))
        answeredOn = db.Column(db.DateTime, nullable=False, default=db.func.now())
        trialStart = db.Column(db.String)
        trialEnd = db.Column(db.String)
        trialTime = db.Column(db.String)
        stimuli = db.Column(db.String)
        userRating = db.Column(db.String)
        level = db.Column(db.String)
        targetPresent = db.Column(db.String)
        targetShape = db.Column(db.String)
        targetSize = db.Column(db.String)
        targetX = db.Column(db.String)
        targetY = db.Column(db.String)
        distractorBlur = db.Column(db.String)
        distractorOpacity = db.Column(db.String)
        distanceFromCenter = db.Column(db.String)
        response = db.Column(db.String)
        correct = db.Column(db.String)
        vision = db.Column(db.String)
        vissioncomment = db.Column(db.String)
        deficiency = db.Column(db.String)
        deficiencyText = db.Column(db.String)


    return emphasis






