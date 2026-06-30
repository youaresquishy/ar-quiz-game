// ======================================================
// VISA FIRESIDE CHAT
// app.js
// PART 1
// ======================================================

const quiz = [
{
question: "Q1. What makes consumers feel most rewarded today?",
answers: [
"Earning more points",
"Bigger cashback percentages",
"Relevant offers at the right moment",
"Luxury reward catalogues"
],
correct: 2,
reveal:
"Consumers increasingly value relevance and immediacy over accumulating rewards they'll redeem later. Loyalty is shifting from rewards programs to engagement ecosystems."
},

{
question: "Q2. Which is hardest for issuers to build themselves?",
answers: [
"Campaign reporting",
"Points management",
"A scaled merchant offer ecosystem",
"Customer communications"
],
correct: 2,
reveal:
"Building and maintaining thousands of merchant relationships and offers at scale requires a large ecosystem and continuous content refresh."
},

{
question: "Q3. Which statement is most likely to be true in 2030?",
answers: [
"Points will disappear",
"Cashback will replace loyalty programs",
"Loyalty will become increasingly invisible and embedded",
"Consumers will join fewer programs"
],
correct: 2,
reveal:
"Loyalty is evolving from standalone rewards programs to always-on engagement embedded across everyday experiences, moving from cost to a monetisation driver."
}
];

let participantName = "";
let currentQuestion = 0;
let startTime = null;
let markerFound = false;

// ----------------------------
// HOME
// ----------------------------

const homeScreen = document.getElementById("homeScreen");
const quizScreen = document.getElementById("quizScreen");
const cameraIntroScreen = document.getElementById("cameraIntroScreen");
const arScreen = document.getElementById("arScreen");
const completeScreen = document.getElementById("completeScreen");

const startBtn = document.getElementById("startBtn");
const participantInput = document.getElementById("participantName");
const nameError = document.getElementById("nameError");

// ----------------------------
// QUIZ
// ----------------------------

const questionCounter =
document.getElementById("questionCounter");

const progressFill =
document.getElementById("progressFill");

const participantLabel =
document.getElementById("participantLabel");

const questionText =
document.getElementById("questionText");

const answersContainer =
document.getElementById("answersContainer");

const feedbackBox =
document.getElementById("feedbackBox");

const feedbackIcon =
document.getElementById("feedbackIcon");

const feedbackTitle =
document.getElementById("feedbackTitle");

const feedbackExplanation =
document.getElementById("feedbackExplanation");

const nextBtn =
document.getElementById("nextBtn");

// ----------------------------
// CAMERA
// ----------------------------

const openCameraBtn =
document.getElementById("openCameraBtn");

const collectPanel =
document.getElementById("collectPanel");

const collectBtn =
document.getElementById("collectBtn");

const marker =
document.getElementById("hiroMarker");

const vee =
document.getElementById("veeObject");

// ----------------------------
// COMPLETE
// ----------------------------

const finalName =
document.getElementById("finalName");

const finalTime =
document.getElementById("finalTime");

// ----------------------------
// HELPERS
// ----------------------------

function showScreen(screen){

document
.querySelectorAll(".screen")
.forEach(s=>s.classList.remove("active"));

screen.classList.add("active");

}

function updateProgress(){

const pct =
((currentQuestion) / quiz.length) * 100;

progressFill.style.width = pct + "%";

}

// ----------------------------
// START
// ----------------------------

startBtn.addEventListener("click", ()=>{

participantName =
participantInput.value.trim();

if(participantName===""){

nameError.textContent =
"Please enter your name.";

return;

}

nameError.textContent="";

participantLabel.textContent =
participantName;

startTime = new Date();

currentQuestion = 0;

showScreen(quizScreen);

updateProgress();

renderQuestion();

});
// ======================================================
// PART 2
// QUIZ LOGIC
// ======================================================

function renderQuestion(){

  const q = quiz[currentQuestion];

  questionCounter.textContent =
  "Question " + (currentQuestion + 1) + " of " + quiz.length;

  questionText.textContent = q.question;

  answersContainer.innerHTML = "";

  feedbackBox.classList.add("hidden");
  feedbackBox.classList.remove("correct", "wrong");

  feedbackIcon.textContent = "";
  feedbackTitle.textContent = "";
  feedbackExplanation.textContent = "";

  nextBtn.classList.add("hidden");

  q.answers.forEach((answer, index)=>{

    const btn = document.createElement("button");

    btn.className = "answer-btn";
    btn.type = "button";
    btn.textContent =
    String.fromCharCode(97 + index) + ". " + answer;

    btn.addEventListener("click", ()=>{
      handleAnswer(index);
    });

    answersContainer.appendChild(btn);

  });

}

function handleAnswer(selectedIndex){

  const q = quiz[currentQuestion];

  const answerButtons =
  document.querySelectorAll(".answer-btn");

  answerButtons.forEach((btn, index)=>{

    btn.classList.add("disabled");

    if(index === q.correct){
      btn.classList.add("correct");
      btn.textContent = "✓ " + btn.textContent;
    }

    if(index === selectedIndex && selectedIndex !== q.correct){
      btn.classList.add("wrong");
      btn.textContent = "✕ " + btn.textContent;
    }

  });

  const isCorrect =
  selectedIndex === q.correct;

  feedbackBox.classList.remove("hidden");

  if(isCorrect){

    feedbackBox.classList.add("correct");
    feedbackIcon.textContent = "✓";
    feedbackTitle.textContent = "Correct";

  } else {

    feedbackBox.classList.add("wrong");
    feedbackIcon.textContent = "✕";
    feedbackTitle.textContent = "Not quite";

  }

  feedbackExplanation.textContent = q.reveal;

  nextBtn.classList.remove("hidden");

}

nextBtn.addEventListener("click", ()=>{

  currentQuestion++;

  updateProgress();

  if(currentQuestion < quiz.length){

    renderQuestion();

  } else {

    progressFill.style.width = "100%";
    showScreen(cameraIntroScreen);

  }

});
// ======================================================
// PART 3
// AR LOGIC + COMPLETION
// ======================================================

openCameraBtn.addEventListener("click", () => {
  markerFound = false;
  collectPanel.classList.add("hidden");
  showScreen(arScreen);
});

marker.addEventListener("markerFound", () => {
  markerFound = true;
  collectPanel.classList.remove("hidden");
});

marker.addEventListener("markerLost", () => {
  markerFound = false;
});

vee.addEventListener("click", () => {
  completeChallenge();
});

collectBtn.addEventListener("click", () => {
  completeChallenge();
});

function completeChallenge() {
  const endTime = new Date();
  const totalSeconds = Math.floor((endTime - startTime) / 1000);

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const formattedTime =
    minutes + ":" + String(seconds).padStart(2, "0");

  finalName.textContent = participantName;
  finalTime.textContent = formattedTime;

  showScreen(completeScreen);
}
