let studyDatasets = ['chord-sample', 'sankey-sample', 'chord-space', 'sankey-space', 'chord-debt', 'sankey-debt', 'chord-phone', 'sankey-phone'];

let currentIndex = 0;

$('#next').click(() => {

    if (currentIndex >= studyDatasets.length) {
        alert('study done');
    }

    else {
        let value = studyDatasets[currentIndex];
        let [studyType, datasetName] = value.split('-');

        if (studyType == 'chord') {
            createChord(datasetName);
        }
        else {
            createSankey(datasetName);
        }
        currentIndex += 1;
    }
});

