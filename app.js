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
    reveal: "Consumers increasingly value relevance and immediacy over accumulating rewards they'll redeem later. Loyalty is shifting from rewards programs to engagement ecosystems."
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
    reveal: "Building and maintaining thousands of merchant relationships and offers at scale requires a large ecosystem and continuous content refresh."
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
    reveal: "Loyalty is evolving from standalone rewards programs to always-on engagement embedded across everyday experiences, moving from cost to a monetisation driver."
  }
];

let participantName = "";
let currentQuestion = 0;
let startTime = null;
let arCreated = false;
let challengeCompleted = false;

const homeScreen = document.getElementById("homeScreen");
const quizScreen = document.getElementById("quizScreen");
const cameraIntroScreen = document.getElementById("cameraIntroScreen");
const arScreen = document.getElementById("arScreen");
const completeScreen = document.getElementById("completeScreen");

const startBtn = document.getElementById("startBtn");
const participantInput = document.getElementById("participantName");
const nameError = document.getElementById("nameError");

const questionCounter = document.getElementById("questionCounter");
const progressFill = document.getElementById("progressFill");
const participantLabel = document.getElementById("participantLabel");
const questionText = document.getElementById("questionText");
const answersContainer = document.getElementById("answersContainer");
const feedbackBox = document.getElementById("feedbackBox");
const feedbackIcon = document.getElementById("feedbackIcon");
const feedbackTitle = document.getElementById("feedbackTitle");
const feedbackExplanation = document.getElementById("feedbackExplanation");
const nextBtn = document.getElementById("nextBtn");

const openCameraBtn = document.getElementById("openCameraBtn");
const collectPanel = document.getElementById("collectPanel");
const collectBtn = document.getElementById("collectBtn");
const arMount = document.getElementById("arMount");

const finalName = document.getElementById("finalName");
const finalTime = document.getElementById("finalTime");

function showScreen(screen) {
  document.querySelectorAll(".screen").forEach((item) => {
    item.classList.remove("active");
  });

  screen.classList.add("active");
  window.scrollTo(0, 0);
}

function updateProgress() {
  const progress = (currentQuestion / quiz.length) * 100;
  progressFill.style.width = progress + "%";
}

function renderQuestion() {
  const q = quiz[currentQuestion];

  questionCounter.textContent = "Question " + (currentQuestion + 1) + " of " + quiz.length;
  questionText.textContent = q.question;
  answersContainer.innerHTML = "";

  feedbackBox.classList.add("hidden");
  feedbackBox.classList.remove("correct", "wrong");
  feedbackIcon.textContent = "";
  feedbackTitle.textContent = "";
  feedbackExplanation.textContent = "";
  nextBtn.classList.add("hidden");

  q.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.className = "answer-btn";
    button.type = "button";
    button.textContent = String.fromCharCode(97 + index) + ". " + answer;

    button.addEventListener("click", () => {
      handleAnswer(index);
    });

    answersContainer.appendChild(button);
  });
}

function handleAnswer(selectedIndex) {
  const q = quiz[currentQuestion];
  const answerButtons = document.querySelectorAll(".answer-btn");
  const isCorrect = selectedIndex === q.correct;

  answerButtons.forEach((button, index) => {
    button.classList.add("disabled");

    if (index === q.correct) {
      button.classList.add("correct");
      button.textContent = "✓ " + button.textContent;
    }

    if (index === selectedIndex && selectedIndex !== q.correct) {
      button.classList.add("wrong");
      button.textContent = "✕ " + button.textContent;
    }
  });

  feedbackBox.classList.remove("hidden");
  feedbackBox.classList.toggle("correct", isCorrect);
  feedbackBox.classList.toggle("wrong", !isCorrect);

  feedbackIcon.textContent = isCorrect ? "✓" : "✕";
  feedbackTitle.textContent = isCorrect ? "Correct" : "Not quite";
  feedbackExplanation.textContent = q.reveal;

  nextBtn.classList.remove("hidden");
}

function createArScene() {
  if (arCreated) {
    return;
  }

  arCreated = true;

  arMount.innerHTML = `
    <a-scene
      id="arScene"
      embedded
      vr-mode-ui="enabled: false"
      renderer="logarithmicDepthBuffer: true; alpha: true"
      arjs="sourceType: webcam; debugUIEnabled: false;"
    >
      <a-assets>
        <img id="veeTexture" src="vee.gif">
      </a-assets>

      <a-marker id="hiroMarker" preset="hiro">
        <a-plane
          id="veeObject"
          src="#veeTexture"
          position="0 0.05 0"
          rotation="-90 0 0"
          width="1.4"
          height="1.4"
          transparent="true"
          material="transparent: true; alphaTest: 0.1;"
        ></a-plane>
      </a-marker>

      <a-entity camera cursor="rayOrigin: mouse"></a-entity>
    </a-scene>
  `;

  const marker = document.getElementById("hiroMarker");
  const vee = document.getElementById("veeObject");

  marker.addEventListener("markerFound", () => {
    collectPanel.classList.remove("hidden");
  });

  marker.addEventListener("markerLost", () => {
    if (!challengeCompleted) {
      collectPanel.classList.add("hidden");
    }
  });

  vee.addEventListener("click", () => {
    completeChallenge();
  });
}

function completeChallenge() {
  if (challengeCompleted) {
    return;
  }

  challengeCompleted = true;

  const endTime = new Date();
  const totalSeconds = Math.max(0, Math.floor((endTime - startTime) / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const formattedTime = minutes + ":" + String(seconds).padStart(2, "0");

  finalName.textContent = participantName;
  finalTime.textContent = formattedTime;

  showScreen(completeScreen);
}

startBtn.addEventListener("click", () => {
  participantName = participantInput.value.trim();

  if (participantName === "") {
    nameError.textContent = "Please enter your name.";
    participantInput.focus();
    return;
  }

  nameError.textContent = "";
  participantLabel.textContent = participantName;
  startTime = new Date();
  currentQuestion = 0;
  challengeCompleted = false;

  showScreen(quizScreen);
  updateProgress();
  renderQuestion();
});

participantInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    startBtn.click();
  }
});

nextBtn.addEventListener("click", () => {
  currentQuestion++;
  updateProgress();

  if (currentQuestion < quiz.length) {
    renderQuestion();
    return;
  }

  progressFill.style.width = "100%";
  showScreen(cameraIntroScreen);
});

openCameraBtn.addEventListener("click", () => {
  collectPanel.classList.add("hidden");
  showScreen(arScreen);
  createArScene();
});

collectBtn.addEventListener("click", () => {
  completeChallenge();
});
