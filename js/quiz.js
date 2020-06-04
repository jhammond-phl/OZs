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

Survey
    .Serializer
    .addProperty("question", "score:number");

Survey.JsonObject.metaData.addProperty("itemvalue", {name: "score:number"});

var json = {
    title: "How Inclusive is your project?",
    showProgressBar: "bottom",
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
              reportBack = "Great! Your project is in line with the City's goals for building in an Opportunity Zone. Looks like it will be a great addition to the community. Please <a href='mailto:opportunityzones@phila.gov' target='_top' style='text-decoration: underline'>contact us</a> to find out how we can help make it happen."
            }
            else if (finalScore >2){
                reportBack = "Great start! Your project meets some of the City’s goals.  Please <a href='mailto:opportunityzones@phila.gov' target='_top' style='text-decoration: underline'>contact us</a> to find out how you can do even more."
            }
            else {
                reportBack = "Let's work on this! Opportunity Zones create a chance to be inclusive and meet the needs of the existing community while making your project a success. Please <a href='mailto:opportunityzones@phila.gov' target='_top' style='text-decoration: underline'>contact us</a> to find out how to improve this score."
            }
            document
              .querySelector('#surveyResult')
              .innerHTML = reportBack
      });


$("#surveyElement").Survey({model: survey});

