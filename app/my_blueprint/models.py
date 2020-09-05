def create(db):
    class snapshot(db.Model):
        __tablename__ = "snapshotV07"
        ID = db.Column(db.Integer, primary_key=True, autoincrement=True)
        participantID = db.Column(db.Integer, db.ForeignKey('participant.participantID'))
        answeredOn = db.Column(db.DateTime, nullable=False, default=db.func.now())
        trialStart = db.Column(db.String)
        trialEnd = db.Column(db.String)
        trialTime = db.Column(db.String)
        studyMode = db.Column(db.String)
        questionNumber = db.Column(db.String)
        response = db.Column(db.String)
        correct = db.Column(db.String)
        snapshotMode = db.Column(db.String)
        nameSearchCount = db.Column(db.String)
        snapshotCreatedCount = db.Column(db.String)
        snapshotDeletedCount = db.Column(db.String)
        snapshotRecalledCount = db.Column(db.String) 
        snapshotAllCount = db.Column(db.String)
        wrongAttemptCount = db.Column(db.String)
    return snapshot






