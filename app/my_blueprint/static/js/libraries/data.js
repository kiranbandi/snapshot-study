var global_names = {
    'sample': ["Country-A", "Country-B", "Country-C", "Country-D"],
    'immigration': ["Africa", "East-Asia", "Europe", "Latin-America", "North-America", "Oceania", "South-Asia", "South-East-Asia", "Soviet-Union", "West-Asia"],
    'phone': ["Apple", "HTC", "Huawei", "LG", "Nokia", "Samsung", "Sony", "Other"],
    'debt': ["France", "Britain", "Greece", "Italy", "Portugal", "USA", "Germany", "Ireland", "Japan", "Spain"],
    'space': ["Space-Angels", "Accion-Systems", "Analytical-Space", "Isotropic-Systems", "Leo-Labs", "Made-in-Space", "Planet", "SpaceX", "Hempisphere-Ventures", "Akash-Systems", "Lynk", "DCVC", "RRE-Ventures", "Lux-Capital", "Marcbell", "Founders-Fund"]
};

var data_name_list = Object.keys(global_names).filter((d)=>d!='sample');


var global_data = {
    'sample': [[0, 2, 1, 4], [1, 0, 2, 1], [2, 0.5, 0, 0.5], [1, 3, 0.25, 0]],
    'immigration': [[3.142471, 0, 2.107883, 0, 0.540887, 0.155988, 0, 0, 0, 0.673004], [0, 1.630997, 0.601265, 0, 0.97306, 0.333608, 0, 0.380388, 0, 0.869311], [0, 0, 2.401476, 0, 0, 0, 0, 0, 0, 0], [0, 0, 1.762587, 0.879198, 3.627847, 0, 0, 0, 0, 0], [0, 0, 1.215929, 0.276908, 0, 0, 0, 0, 0, 0], [0, 0, 0.17037, 0, 0, 0.190706, 0, 0, 0, 0], [0, 0.525881, 1.390272, 0, 1.508008, 0.34742, 1.307907, 0, 0, 4.902081], [0, 0.145264, 0.468762, 0, 1.057904, 0.278746, 0, 0.781316, 0, 0], [0, 0, 0.60923, 0, 0, 0, 0, 0, 1.870501, 0], [0, 0, 0.449623, 0, 0.169274, 0, 0, 0, 0, 0.927243]],
    'phone': [[9.6899, 0.1107, 0.0554, 0.0554, 0.2215, 1.1628, 0.0554, 0.2215], [0.8859, 1.8272, 0.2769, 0.1107, 0.443, 2.6024, 0.4983, 0.7198], [0.0554, 0, 0.2215, 0.0554, 0, 0, 0, 0], [0.443, 0.4983, 0.2215, 1.2182, 0.2769, 1.3843, 0.3322, 0.3322], [2.5471, 1.1074, 0.3876, 1.1628, 10.4097, 8.7486, 0.443, 1.6611], [2.4363, 1.052, 0.8306, 0.6645, 1.2182, 16.8328, 0.8859, 1.495], [0.5537, 0.2215, 0.0554, 0.4983, 0.4983, 1.7165, 1.7719, 0.1107], [2.5471, 0.4983, 0.3322, 1.052, 2.8239, 5.5925, 0.443, 5.4264]],
    'debt': [[0, 22.4, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 321, 12, 28.2, 326], [53.9, 0.55, 0, 3.22, 10.1, 3.1, 19.3, 0.34, 1.37, 0.78], [366, 26, 0, 0, 0, 3.16, 0, 0, 38.8, 9.79], [18.3, 19.4, 0, 0.87, 0, 0, 32.5, 0, 2.18, 62], [322, 345, 0, 0, 0.52, 0, 324, 0, 796, 163], [53.8, 0, 0, 111, 0, 0, 0, 0, 88.5, 0], [17.3, 0, 0, 2.83, 3.77, 11.1, 48.9, 0, 18.9, 0], [7.73, 0, 0, 0, 0, 0, 0, 0, 0, 0], [118, 0, 0, 0, 0, 0, 57.6, 6.38, 25.9, 0]],
    'space': [[0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0], [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0]]
};

var condition_map = {
    '1': ['chord-A', 'sankey-B'],
    '2': ['chord-B', 'sankey-A'],
    '3': ['sankey-A', 'chord-B'],
    '4': ['sankey-B', 'chord-A']
}

var studyQuestions = {
    'practice': [{
        "questionType": "existence",
        "label": "Is there a link from Country A to Country B?",
        "type": "multichoice",
        "choices": ["Yes", "No"],
        "answer": 'Yes'
    }, {
        "questionType": "find-element",
        "label": "Which country is the end of the largest link starting at Country A?",
        "type": "multichoice",
        "choices": ["Country A", "Country B", "Country C", "Country D"],
        "answer": "Country D"
    }, {
        "questionType": "compare-magnitude",
        "label": "Which link is larger: Country A to Country B, or Country D to Country A?",
        "type": "multichoice",
        "choices": ["Country A to Country B", "Country D to Country A"],
        "answer": "Country A to Country B"
    }, {
        "questionType": "min-max",
        "label": "What country exports the largest total amount (including all destinations)?",
        "type": "multichoice",
        "choices": ["Country A", "Country B", "Country C", "Country D"],
        "answer": "Country D"
    }, {
        "questionType": "count-links",
        "label": "How many countries does Country C export to?",
        "type": "multichoice",
        "choices": ["2", "3", "4", "5"],
        "answer": "3"
    }],
    'immigration-A': [
        // questions here similar to above
    ],
    'phone-A': [
        // questions here similar to above
    ],
    'debt-A': [
        // questions here similar to above
    ],
    'space-A': [
        // questions here similar to above
    ],
    'immigration-B': [
        // questions here similar to above
    ],
    'phone-B': [
        // questions here similar to above
    ],
    'debt-B': [
        // questions here similar to above
    ],
    'space-B': [
        // questions here similar to above
    ]
};
