var defaultThemeColors = Survey
    .StylesManager
    .ThemeColors["modern"];
defaultThemeColors["$main-color"] = "#3da5b6";
defaultThemeColors["$main-hover-color"] = "#656869";
defaultThemeColors["$text-color"] = "#4a4a4a";
defaultThemeColors["$header-color"] = "#3da5b6";

defaultThemeColors["$header-background-color"] = "#4a4a4a";
defaultThemeColors["$body-container-background-color"] = "#f8f8f8";

Survey
    .StylesManager
    .applyTheme("modern");

// Survey
//     .JsonObject
//     .metaData
//     .addProperty("question", {
//         name: "score:number",
//     });

Survey
    .Serializer
    .addProperty("question", "score:number");

Survey.JsonObject.metaData.addProperty("itemvalue", {name: "score:number"});

var json = {
    title: "How Inclusive is your project?",
    showProgressBar: "bottom",
  //  showTimerPanel: "top",
   // maxTimeToFinishPage: 10,
 //   maxTimeToFinish: 25,
    firstPageIsStarted: true,
    startSurveyText: "Find out!",
    showCompletedPage: false,
    pages: [
        {
            questions: [
                {
                    type: "html",
                    html: "Answer a few questions and..."
                }
            ]
        }, {
            questions: [
                {
                    type: "radiogroup",
                    name: "districtPlan",
                    title: "Does your project match the goals for your neighborhood in the District Plan [link]?",
                    choices: [
                        {
                            value:"Yes", 
                            score: 2
                        },
                        {
                            value: "No",
                            score: 0
                        }
                    ],
                }
            ]
        }, {
            questions: [
                {
                    type: "radiogroup",
                    name: "communityGroups",
                    title: "Will you meet with community groups to discuss your project?",
                    choices: [
                        {
                            value: "Yes",
                            score: 1
                        },
                        {
                            value: "No",
                            score: 0
                        }
                    ],
                }
            ]
        }, {
            questions: [
                {
                    type: "checkbox",
                    name: "willYourProject",
                    title: "Will your project...? (Check all that apply)",
                    colCount:2,
                    choices: [
                        {
                            value: "Provide support or a space for existing local businesses?",
                            score: 1
                        },
                        {
                            value: "Hire Philadelphians to work on its construction?",
                            score: 1
                        },
                        {
                            value: "Include new affordable housing units?",
                            score: 2
                        },
                        {
                            value: "Use or sell locally sourced goods and materials?",
                            score: 1
                        },
                        {
                            value: "Create a new public amenity or provide a service for your community?",
                            score: 1
                        },
                        {
                            value: "Create permanent new jobs that pay a living wage?",
                            score: 2
                        }
                    ],
                }
            ]
        }

    ],
    completedHtml: "I'm lame and won't say what i'm supposed to"
};

window.survey = new Survey.Model(json);
function calcScore(model) {
    var score = 0;
    var data = model.getPlainData();
    data.forEach((q) => {
      if (typeof model.getQuestionByName(q.name).score !== 'undefined') {
        score += model.getQuestionByName(q.name).score;
      }
      if (typeof model.getQuestionByName(q.name).choices !== 'undefined') {
        model.getQuestionByName(q.name).choices.forEach((c) => {
          if (typeof c.score !== 'undefined' && q.value.indexOf(c.itemValue) !== -1) {
            score += c.score;
          }
        });
      }
    });
    return score;
  }
  
  survey
      .onComplete
      .add(function (result) {
          finalScore = calcScore(result)
          console.log(calcScore(result));
          if (finalScore >4){
              reportBack = "This sounds like an exciting and inclusive project! Let's talk about how we can highlight and support it."
            }
            else if (finalScore >2){
                reportBack = "You're off to a good start.  We can help you make this project more inclusive AND make it a reality."
            }
            else {
                reportBack = "It doesn't sound like this is a very inclusive project…yet. We can help you make this project more inclusive AND make it a reality."
            }
            document
              .querySelector('#surveyResult')
              //.textContent = "Result JSON:\n" + JSON.stringify(result.data, null, 3);
              .textContent = reportBack
      });
  

// survey
//     .onComplete
//     .add(function (result) {
//         var plainData = survey.getPlainData({
//         calculations: [{ propertyName: "score" }]
//         });
//         document
//             .querySelector('#surveyResult')
//             .textContent = "Score: " + JSON.stringify(plainData.reduce(function(sum, questionAnswerData) { return sum + questionAnswerData.score; }, 0));
//     });

// survey
//     .onComplete
//     .add(function (survey) {
//        var totalScore = 0;
//        var data = survey.data;
        
//        Object.keys(data).forEach(function(qName) {
//           var question = survey.getQuestionByName(qName);
//           var qValue = data[qName];
          
//           if (question.choices) {
//             question.choices.forEach(function(choice) {
//               if (choice.value === qValue) {
//                 totalScore += +choice.score;
//               }
//             });
//           } else {
//             totalScore += +question.score;
//           }
          
//         });
//         console.log(survey)
//         document
//             .querySelector('#surveyResult')
//             .innerHTML = "total score: " + JSON.stringify(totalScore);
//     });

$("#surveyElement").Survey({model: survey});

// survey
//     .onComplete
//     .add(function (result) {
//         var modifiedData=Object.keys(result.data).map(function(qName){
//             console.log(result)
//             return {
//                // value: result.data[qName],
//                 score: result.getQuestionByName(qName).score
//             }
//         });
//         document
//             .querySelector('#surveyResult')
//             .innerHTML = "results: " + JSON.stringify(modifiedData)
//             //.textContent = "Result JSON:\n" + JSON.stringify(result.data, null, 3);
// });

// $("#surveyElement").Survey({model: survey});