const LEVELS = {
  easy: 3,
  medium: 4,
  hard: 4,
};

const MAX_QUESTIONS = 50;
const TIME_LIMIT_SECONDS = 60;
const AUTO_NEXT_DELAY_MS = 1200;

const state = {
  mode: "EN_TO_PL",
  level: "easy",
  questionCount: 10,
  questions: [],
  index: 0,
  score: 0,
  timerId: null,
  autoNextId: null,
  timeLeft: TIME_LIMIT_SECONDS,
  answered: false,
  currentQuestion: null,
};

const elements = {
  setupScreen: document.getElementById("setup-screen"),
  gameScreen: document.getElementById("game-screen"),
  resultScreen: document.getElementById("result-screen"),
  modeInputs: document.querySelectorAll('input[name="mode"]'),
  levelInputs: document.querySelectorAll('input[name="level"]'),
  questionCountInput: document.getElementById("question-count"),
  questionCountValue: document.getElementById("question-count-value"),
  setupError: document.getElementById("setup-error"),
  startBtn: document.getElementById("start-btn"),
  restartBtn: document.getElementById("restart-btn"),
  exitBtn: document.getElementById("exit-btn"),
  progressText: document.getElementById("progress-text"),
  scoreText: document.getElementById("score-text"),
  modeBanner: document.getElementById("mode-banner"),
  modeText: document.getElementById("mode-text"),
  modeFlag: document.getElementById("mode-flag"),
  timerText: document.getElementById("timer-text"),
  timerBar: document.getElementById("timer-bar"),
  promptLabel: document.getElementById("prompt-label"),
  promptText: document.getElementById("prompt-text"),
  options: document.getElementById("options"),
  feedback: document.getElementById("feedback"),
  nextBtn: document.getElementById("next-btn"),
  resultText: document.getElementById("result-text"),
};

function shuffle(array) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return arr;
}

function sample(array, count) {
  return shuffle(array).slice(0, count);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function getCheckedRadioValue(radioNodeList, fallbackValue) {
  const selected = [...radioNodeList].find((input) => input.checked);
  return selected ? selected.value : fallbackValue;
}

function uniqueTexts(words, key) {
  return [...new Set(words.map((w) => w[key]))];
}

function buildQuestion(word, mode, optionsCount) {
  const isEnToPl = mode === "EN_TO_PL";
  const prompt = isEnToPl ? word.en : word.pl;
  const correctAnswer = isEnToPl ? word.pl : word.en;
  const optionField = isEnToPl ? "pl" : "en";

  const optionPool = uniqueTexts(window.WORDS, optionField).filter(
    (text) => text !== correctAnswer
  );

  const distractors = sample(optionPool, Math.max(0, optionsCount - 1));
  const options = shuffle([correctAnswer, ...distractors]).map((text) => ({
    text,
    isCorrect: text === correctAnswer,
  }));

  return {
    prompt,
    correctAnswer,
    options,
    englishForTts: word.en,
  };
}

function showScreen(name) {
  elements.setupScreen.classList.toggle("hidden", name !== "setup");
  elements.gameScreen.classList.toggle("hidden", name !== "game");
  elements.resultScreen.classList.toggle("hidden", name !== "result");
}

function resetTimer() {
  if (state.timerId) {
    clearInterval(state.timerId);
    state.timerId = null;
  }
}

function resetAutoNext() {
  if (state.autoNextId) {
    clearTimeout(state.autoNextId);
    state.autoNextId = null;
  }
}

function scheduleAutoNext() {
  resetAutoNext();
  state.autoNextId = setTimeout(() => {
    state.autoNextId = null;
    goToNextQuestion();
  }, AUTO_NEXT_DELAY_MS);
}

function updateTimerUi() {
  elements.timerText.textContent = `Czas: ${state.timeLeft}s`;
  const progress = Math.max(0, state.timeLeft / TIME_LIMIT_SECONDS);
  elements.timerBar.style.transform = `scaleX(${progress})`;
}

function disableAllOptionButtons() {
  const buttons = elements.options.querySelectorAll("button.option-btn");
  buttons.forEach((button) => {
    button.disabled = true;
  });
}

function revealCorrectAnswer() {
  const buttons = elements.options.querySelectorAll("button.option-btn");
  buttons.forEach((button) => {
    if (button.dataset.correct === "true") {
      button.classList.add("correct");
    }
  });
}

function startTimer() {
  resetTimer();
  state.timeLeft = TIME_LIMIT_SECONDS;
  updateTimerUi();

  state.timerId = setInterval(() => {
    state.timeLeft -= 1;
    updateTimerUi();

    if (state.timeLeft <= 0) {
      resetTimer();
      onTimeUp();
    }
  }, 1000);
}

function updateTopBar() {
  elements.progressText.textContent = `Pytanie ${state.index + 1}/${state.questionCount}`;
  elements.scoreText.textContent = `Punkty: ${state.score}`;
}

function getTtsAvailability() {
  return typeof window.speechSynthesis !== "undefined";
}

function speakEnglish(text) {
  if (!getTtsAvailability() || !text) {
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.95;
  window.speechSynthesis.speak(utterance);
}

function applyModeTheme(mode) {
  document.body.classList.remove("theme-en-pl", "theme-pl-en");
  elements.modeBanner.classList.remove("mode-en-pl", "mode-pl-en");
  elements.modeFlag.classList.remove("uk", "pl");

  if (mode === "EN_TO_PL") {
    document.body.classList.add("theme-en-pl");
    elements.modeBanner.classList.add("mode-en-pl");
    elements.modeFlag.classList.add("uk");
    elements.modeText.textContent = "Tryb EN -> PL";
    return;
  }

  document.body.classList.add("theme-pl-en");
  elements.modeBanner.classList.add("mode-pl-en");
  elements.modeFlag.classList.add("pl");
  elements.modeText.textContent = "Tryb PL -> EN";
}

function resetToSetup() {
  resetTimer();
  resetAutoNext();
  if (getTtsAvailability()) {
    window.speechSynthesis.cancel();
  }
  showScreen("setup");
}

function renderOptions(question) {
  elements.options.innerHTML = "";

  question.options.forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "option-btn";
    button.textContent = option.text;
    button.dataset.correct = option.isCorrect ? "true" : "false";

    button.addEventListener("click", () => {
      if (state.answered) {
        return;
      }
      onAnswer(button, option.isCorrect);
    });

    elements.options.appendChild(button);
  });
}

function renderQuestion() {
  state.answered = false;
  state.currentQuestion = buildQuestion(
    state.questions[state.index],
    state.mode,
    LEVELS[state.level]
  );

  updateTopBar();

  elements.promptLabel.textContent =
    state.mode === "EN_TO_PL" ? "Przetlumacz na polski:" : "Przetlumacz na angielski:";
  elements.promptText.textContent = state.currentQuestion.prompt;
  elements.feedback.textContent = "";
  elements.nextBtn.classList.add("hidden");

  renderOptions(state.currentQuestion);

  // W trybie 1 czytaj od razu; w trybie 2 czytaj dopiero po odpowiedzi.
  if (state.mode === "EN_TO_PL") {
    speakEnglish(state.currentQuestion.englishForTts);
  }

  startTimer();
}

function onAnswer(button, isCorrect) {
  state.answered = true;
  resetTimer();
  disableAllOptionButtons();

  if (isCorrect) {
    state.score += 1;
    button.classList.add("correct");
    elements.feedback.textContent = "Dobrze!";
  } else {
    button.classList.add("wrong");
    revealCorrectAnswer();
    elements.feedback.textContent = "Niestety, to nie ta odpowiedz.";
  }

  updateTopBar();
  elements.nextBtn.classList.remove("hidden");

  if (state.mode === "PL_TO_EN") {
    speakEnglish(state.currentQuestion.correctAnswer);
  }

  scheduleAutoNext();
}

function onTimeUp() {
  state.answered = true;
  disableAllOptionButtons();
  revealCorrectAnswer();
  elements.feedback.textContent = "Czas minal. Poprawna odpowiedz zaznaczona na zielono.";
  elements.nextBtn.classList.remove("hidden");

  if (state.mode === "PL_TO_EN") {
    speakEnglish(state.currentQuestion.correctAnswer);
  }

  scheduleAutoNext();
}

function endGame() {
  resetTimer();
  resetAutoNext();
  showScreen("result");
  elements.resultText.textContent = `Wynik: ${state.score}/${state.questionCount}`;
}

function goToNextQuestion() {
  resetAutoNext();

  if (state.index >= state.questionCount - 1) {
    endGame();
    return;
  }

  state.index += 1;
  renderQuestion();
}

function startGame() {
  resetAutoNext();
  const requestedCount = Number(elements.questionCountInput.value);
  const safeRequested = Number.isFinite(requestedCount) ? requestedCount : 25;

  state.mode = getCheckedRadioValue(elements.modeInputs, "EN_TO_PL");
  state.level = getCheckedRadioValue(elements.levelInputs, "easy");

  const maxAllowed = Math.min(MAX_QUESTIONS, window.WORDS.length);
  state.questionCount = clamp(Math.trunc(safeRequested), 10, maxAllowed);

  if (!window.WORDS.length) {
    elements.setupError.textContent = "Brak slowek do gry.";
    return;
  }

  elements.setupError.textContent = "";
  elements.questionCountInput.value = state.questionCount;
  elements.questionCountValue.textContent = String(state.questionCount);

  state.questions = sample(window.WORDS, state.questionCount);
  state.index = 0;
  state.score = 0;

  applyModeTheme(state.mode);
  showScreen("game");
  renderQuestion();
}

function init() {
  elements.questionCountInput.addEventListener("input", () => {
    elements.questionCountValue.textContent = elements.questionCountInput.value;
  });
  elements.startBtn.addEventListener("click", startGame);
  elements.restartBtn.addEventListener("click", resetToSetup);
  elements.exitBtn.addEventListener("click", resetToSetup);
  elements.nextBtn.addEventListener("click", goToNextQuestion);

  elements.questionCountValue.textContent = elements.questionCountInput.value;
  applyModeTheme("EN_TO_PL");
  showScreen("setup");
}

init();

