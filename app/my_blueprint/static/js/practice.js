// First get the condition 
var condition = getCond();
// Then get the corresponding map based on the condition 
var condition_set = condition_map[condition];

// Start Iterator
let currentIndex = 0;
// Show first chart 
let value = condition_set[currentIndex];
let [studyType] = value.split('-');
if (studyType == 'chord') { createChord('sample') }
else { createSankey('sample') }
currentIndex += 1;

$('#next').click(() => {
    if (currentIndex >= condition_set.length) {
        window.location.href = "/redirect_next_page";
    }
    else {
        let value = condition_set[currentIndex];
        let [studyType] = value.split('-');
        if (studyType == 'chord') { createChord('sample') }
        else { createSankey('sample') }
        currentIndex += 1;
    }
});




