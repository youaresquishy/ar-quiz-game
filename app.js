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

const stampLabels = {
  quiz: "Quiz Master",
  social: "Followed Visa",
  vee: "Found VEE"
};

let participantName = "";
let currentQuestion = 0;
let correctCount = 0;
let startTime = null;
let arCreated = false;
let challengeCompleted = false;
let nextAfterStamp = "passportAfterQuiz";

const stamps = {
  quiz: false,
  social: false,
  vee: false
};

const homeScreen = document.getElementById("homeScreen");
const passportIntroScreen = document.getElementById("passportIntroScreen");
const quizScreen = document.getElementById("quizScreen");
const stampScreen = document.getElementById("stampScreen");
const passportProgressScreen = document.getElementById("passportProgressScreen");
const socialScreen = document.getElementById("socialScreen");
const cameraIntroScreen = document.getElementById("cameraIntroScreen");
const arScreen = document.getElementById("arScreen");
const completeScreen = document.getElementById("completeScreen");

const startBtn = document.getElementById("startBtn");
const beginQuizBtn = document.getElementById("beginQuizBtn");
const participantInput = document.getElementById("participantName");
const nameError = document.getElementById("nameError");

const passportIntroCard = document.getElementById("passportIntroCard");
const passportProgressCard = document.getElementById("passportProgressCard");
const passportProgressMessage = document.getElementById("passportProgressMessage");
const passportContinueBtn = document.getElementById("passportContinueBtn");

const questionCounter = document.getElementById("questionCounter");
const participantLabel = document.getElementById("participantLabel");
const quizStampDots = document.getElementById("quizStampDots");
const questionText = document.getElementById("questionText");
const answersContainer = document.getElementById("answersContainer");
const feedbackBox = document.getElementById("feedbackBox");
const feedbackIcon = document.getElementById("feedbackIcon");
const feedbackTitle = document.getElementById("feedbackTitle");
const feedbackExplanation = document.getElementById("feedbackExplanation");
const nextBtn = document.getElementById("nextBtn");

const stampTitle = document.getElementById("stampTitle");
const stampMessage = document.getElementById("stampMessage");
const stampContinueBtn = document.getElementById("stampContinueBtn");

const followedBtn = document.getElementById("followedBtn");

const openCameraBtn = document.getElementById("openCameraBtn");
const cameraError = document.getElementById("cameraError");
const collectPanel = document.getElementById("collectPanel");
const collectBtn = document.getElementById("collectBtn");
const arMount = document.getElementById("arMount");

const completionHeadline = document.getElementById("completionHeadline");
const finalPassportCard = document.getElementById("finalPassportCard");
const finalName = document.getElementById("finalName");
const finalTime = document.getElementById("finalTime");
const completionMessage = document.getElementById("completionMessage");

function showScreen(screen) {
  document.querySelectorAll(".screen").forEach((item) => {
    item.classList.remove("active");
  });

  screen.classList.add("active");
  window.scrollTo(0, 0);
}

function stampCount() {
  return Object.values(stamps).filter(Boolean).length;
}

function vibrateTiny() {
  if ("vibrate" in navigator) {
    navigator.vibrate(30);
  }
}

function renderPassport(container) {
  const count = stampCount();

  container.innerHTML = `
    <div class="passport-title">
      <span>🛂 VEE Passport</span>
      <span class="stamp-count">${count} / 3 Stamps</span>
    </div>

    <div class="stamp-grid">
      ${renderStamp("quiz")}
      ${renderStamp("social")}
      ${renderStamp("vee")}
    </div>
  `;
}

function renderStamp(key) {
  const earned = stamps[key];

  return `
    <div class="passport-stamp ${earned ? "earned" : ""}">
      <div class="stamp-circle">${earned ? "✓" : ""}</div>
      <div class="stamp-label">${stampLabels[key]}</div>
    </div>
  `;
}

function renderStampDots() {
  quizStampDots.innerHTML = `
    <span class="stamp-dot ${stamps.quiz ? "earned" : ""}"></span>
    <span class="stamp-dot ${stamps.social ? "earned" : ""}"></span>
    <span class="stamp-dot ${stamps.vee ? "earned" : ""}"></span>
  `;
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

  renderStampDots();

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

  if (isCorrect) {
    correctCount++;
  }

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

function showStampEarned(key, message, nextStep) {
  stamps[key] = true;
  nextAfterStamp = nextStep;
  stampTitle.textContent = stampLabels[key] + " Stamp Earned!";
  stampMessage.textContent = message;
  vibrateTiny();
  showScreen(stampScreen);
}

function showPassportProgress(message, nextStep) {
  passportProgressMessage.textContent = message;
  passportContinueBtn.dataset.nextStep = nextStep;
  renderPassport(passportProgressCard);
  showScreen(passportProgressScreen);
}

function openNextStep(step) {
  if (step === "social") {
    showScreen(socialScreen);
    return;
  }

  if (step === "camera") {
    showScreen(cameraIntroScreen);
    return;
  }

  if (step === "complete") {
    completeChallenge();
  }
}

function createMindARScene() {
  if (arCreated) {
    return;
  }

  arCreated = true;

  arMount.innerHTML = `
    <a-scene
      id="arScene"
      mindar-image="imageTargetSrc: targets.mind; autoStart: true; uiScanning: no; uiLoading: no; filterMinCF: 0.0001; filterBeta: 0.001;"
      color-space="sRGB"
      renderer="colorManagement: true; alpha: true; antialias: true;"
      vr-mode-ui="enabled: false"
      device-orientation-permission-ui="enabled: false"
      embedded
    >
      <a-assets>
        <img id="veeTexture" src="vee.gif" crossorigin="anonymous">
      </a-assets>

      <a-camera
        position="0 0 0"
        look-controls="enabled: false"
        cursor="rayOrigin: mouse"
        raycaster="objects: .clickable"
      ></a-camera>

      <a-entity id="targetEntity" mindar-image-target="targetIndex: 0">
        <a-plane
          id="veeObject"
          class="clickable"
          src="#veeTexture"
          position="0 0 0.05"
          height="0.8"
          width="0.8"
          transparent="true"
          material="transparent: true; alphaTest: 0.1; side: double;"
        ></a-plane>
      </a-entity>
    </a-scene>
  `;

  const target = document.getElementById("targetEntity");
  const vee = document.getElementById("veeObject");

  target.addEventListener("targetFound", () => {
    collectPanel.classList.remove("hidden");
  });

  target.addEventListener("targetLost", () => {
    if (!challengeCompleted) {
      collectPanel.classList.add("hidden");
    }
  });

  vee.addEventListener("click", () => {
    showStampEarned("vee", "You found VEE and collected your final stamp.", "complete");
  });

  setTimeout(() => {
    document.querySelectorAll("video").forEach((video) => {
      video.setAttribute("playsinline", "");
      video.setAttribute("webkit-playsinline", "");
      video.muted = true;
      video.play().catch(() => {});
    });
  }, 1000);
}

function openAR() {
  openCameraBtn.disabled = true;
  openCameraBtn.textContent = "Opening camera...";
  cameraError.textContent = "";
  collectPanel.classList.add("hidden");
  showScreen(arScreen);

  setTimeout(() => {
    createMindARScene();
  }, 150);
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

  finalName.textContent = participantName;
  finalTime.textContent = minutes + ":" + String(seconds).padStart(2, "0");

  renderPassport(finalPassportCard);

  if (stampCount() === 3) {
    completionHeadline.textContent = "VEE Passport Completed!";
    completionMessage.textContent = "Show this screen to the facilitator. Fastest 5 participants with a completed VEE Passport win a prize.";
  } else {
    completionHeadline.textContent = stampCount() + " / 3 Stamps Collected";
    completionMessage.textContent = "Thanks for joining us! See you at the next Visa event.";
  }

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

  currentQuestion = 0;
  correctCount = 0;
  startTime = new Date();
  challengeCompleted = false;
  arCreated = false;
  arMount.innerHTML = "";
  openCameraBtn.disabled = false;
  openCameraBtn.textContent = "Open Camera";

  stamps.quiz = false;
  stamps.social = false;
  stamps.vee = false;

  renderPassport(passportIntroCard);
  showScreen(passportIntroScreen);
});

participantInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    startBtn.click();
  }
});

beginQuizBtn.addEventListener("click", () => {
  showScreen(quizScreen);
  renderQuestion();
});

nextBtn.addEventListener("click", () => {
  currentQuestion++;

  if (currentQuestion < quiz.length) {
    renderQuestion();
    return;
  }

  if (correctCount === quiz.length) {
    showStampEarned("quiz", "You answered all 3 questions correctly.", "passportAfterQuiz");
  } else {
    showPassportProgress(
      "Quiz completed. Your passport journey continues with the Social Stamp.",
      "social"
    );
  }
});

stampContinueBtn.addEventListener("click", () => {
  if (nextAfterStamp === "passportAfterQuiz") {
    showPassportProgress(
      "Great start. Next, collect your Social Stamp.",
      "social"
    );
    return;
  }

  if (nextAfterStamp === "passportAfterSocial") {
    showPassportProgress(
      "Almost there. Find VEE to collect your final stamp.",
      "camera"
    );
    return;
  }

  if (nextAfterStamp === "complete") {
    completeChallenge();
  }
});

passportContinueBtn.addEventListener("click", () => {
  openNextStep(passportContinueBtn.dataset.nextStep);
});

followedBtn.addEventListener("click", () => {
  showStampEarned("social", "Thanks for following Visa.", "passportAfterSocial");
});

openCameraBtn.addEventListener("click", () => {
  openAR();
});

collectBtn.addEventListener("click", () => {
  showStampEarned("vee", "You found VEE and collected your final stamp.", "complete");
});
