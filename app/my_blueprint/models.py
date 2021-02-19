def create(db):
    class emphasis(db.Model):
        __tablename__ = "emphasisV2"
        ID = db.Column(db.Integer, primary_key=True, autoincrement=True)
        participantID = db.Column(db.Integer, db.ForeignKey('participant.participantID'))
        answeredOn = db.Column(db.DateTime, nullable=False, default=db.func.now())
        trialStart = db.Column(db.String)
        trialEnd = db.Column(db.String)
        trialTime = db.Column(db.String)
        stage = db.Column(db.String)
        condition = db.Column(db.String)
        vis_type = db.Column(db.String)
        target = db.Column(db.String)
        anchor = db.Column(db.String)
        targetX = db.Column(db.String)
        targetY = db.Column(db.String)
        errorCount = db.Column(db.String)
        hoverCount = db.Column(db.String)



    class visionTest(db.Model):
        __tablename__ = "visionTestLog"
        ID = db.Column(db.Integer, primary_key=True, autoincrement=True)
        participantID = db.Column(db.Integer, db.ForeignKey('participant.participantID'))
        answeredOn = db.Column(db.DateTime, nullable=False, default=db.func.now())
        vissioncomment = db.Column(db.String)
        deficiency = db.Column(db.String)
        deficiencyText = db.Column(db.String)

    class tutorial(db.Model):
        __tablename__ = "tutorialLogV1"
        ID = db.Column(db.Integer, primary_key=True, autoincrement=True)
        participantID = db.Column(db.Integer, db.ForeignKey('participant.participantID'))
        answeredOn = db.Column(db.DateTime, nullable=False, default=db.func.now())
        trialStart = db.Column(db.String)
        trialEnd = db.Column(db.String)
        trialTime = db.Column(db.String)
        condition = db.Column(db.String)
        image = db.Column(db.String)
        image_type = db.Column(db.String)
        description = db.Column(db.String)

    class encoding(db.Model):
        __tablename__ = "encodingLog"
        ID = db.Column(db.Integer, primary_key=True, autoincrement=True)
        participantID = db.Column(db.Integer, db.ForeignKey('participant.participantID'))
        answeredOn = db.Column(db.DateTime, nullable=False, default=db.func.now())
        trialStart = db.Column(db.String)
        trialEnd = db.Column(db.String)
        trialTime = db.Column(db.String)
        condition = db.Column(db.String)
        image = db.Column(db.String)
        image_type = db.Column(db.String)
        description = db.Column(db.String)

    class recognition(db.Model):
        __tablename__ = "recognitionLog"
        ID = db.Column(db.Integer, primary_key=True, autoincrement=True)
        participantID = db.Column(db.Integer, db.ForeignKey('participant.participantID'))
        answeredOn = db.Column(db.DateTime, nullable=False, default=db.func.now())

    class recall(db.Model):
        __tablename__ = "recallLog"
        ID = db.Column(db.Integer, primary_key=True, autoincrement=True)
        participantID = db.Column(db.Integer, db.ForeignKey('participant.participantID'))
        answeredOn = db.Column(db.DateTime, nullable=False, default=db.func.now())

    return emphasis, encoding, recognition, recall, visionTest, tutorial
