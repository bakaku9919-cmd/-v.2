// === ЗАГРУЗКА ДАННЫХ ИЗ АНКЕТЫ ===
let gender = "";
let age = "";
let education = "";
let participantId = localStorage.getItem('participantId') || "";

try {
  const participantData = JSON.parse(localStorage.getItem('participantData') || '{}');
  gender = participantData.gender || "";
  age = participantData.age || "";
  education = participantData.education || "";
  console.log("✅ Данные анкеты загружены:", { gender, age, education });
} catch (e) {
  console.warn("⚠️ Нет данных анкеты, используются пустые значения");
}

// === СОСТОЯНИЕ ТЕСТА ===
let currentQuestion = 0;
let answers = [];

// === ВОПРОСЫ ===
const questions = [
  "Я выполняю свои обещания",
  "Я надежный человек",
  "Я поступаю справедливо и праведно",
  "Я совершаю добродетельные поступки",
  "Я сохраняю верность другим людям",
  "Я великодушный/ая",
  "Я обладаю мудростью",
  "Я контролирую себя",
  "Я проявляю твердость и терпеливость",
  "Я проявляю смирение",
  "Я полон/полна доброты",
  "Я стремлюсь к чистоте в мыслях и поступках",
  "Я обладаю выдержкой",
  "Я искренний/яя",
  "Я вижу все хорошее",
  "Я придерживаюсь прямого пути",
  "Я правдивый человек",
  "Мне свойственны вежливость и хорошие манеры",
  "Я обладаю духовной силой",
  "Я удовлетворенный жизнью человек",
  "Я проявляю сострадание",
  "Я обладаю чувством священного",
  "Я стараюсь проявлять жизнестойкость",
  "Я проявляю милосердие в отношении других",
  "Я живу не только для себя, но и для других",
  "Я могу сохранять спокойствие, встречаясь с невзгодами",
  "Для меня важно поддерживать справедливость",
  "Я способен прощать"
];

// === ШКАЛЫ (индексы с 0) ===
const scales = {
  "Высокая нравственность и мудрость": [3, 5, 6, 10, 11, 20, 21],
  "Самоконтроль": [7, 8, 9, 12, 25],
  "Надежность и ответственность": [0, 1, 2, 4],
  "Духовность отношений": [13, 17, 22, 23, 24, 26, 27],
  "Правдивость и удовлетворенность": [14, 15, 16, 18, 19]
};

// === ПОРЯДОК ТЕСТОВ (ПРАВИЛЬНЫЙ) ===
const testSequence = [
  { id: "spiritual-orientation", title: "Духовная ориентация личности", file: "spirit-orient.html" },
  { id: "spiritual-personality", title: "Духовная личность", file: "spirit-person.html" },
  { id: "altruism", title: "Альтруистические установки", file: "altruism.html" },
  { id: "sjo", title: "Тест смысложизненных ориентаций", file: "sjo.html" },
  { id: "wisdom", title: "Методика диагностики мудрости", file: "wisdom.html" },
  { id: "reflex", title: "Дифференциальный тест рефлексивности", file: "reflex.html" },
  { id: "self-inter", title: "Шкала металичностной самоинтерпретации", file: "self-inter.html" },
  { id: "life-prod", title: "Продуктивная жизнедеятельность и самотрансценденция", file: "life-prod.html" },
  { id: "pfoo", title: "Пятифакторный опросник осознанности", file: "pfoo.html" },
  { id: "motiv", title: "Шкала мотивации одобрения (Марлоу-Краун)", file: "motiv.html" }
];

// === ЗАГРУЗКА ПЕРВОГО ВОПРОСА ===
document.addEventListener('DOMContentLoaded', () => {
  console.log("%cОпросник «Духовная личность» загружен (новая версия)", "color: #4f46e5; font-weight: bold");
  document.getElementById('total-questions').textContent = questions.length;
  loadQuestion();
});

function loadQuestion() {
  const q = questions[currentQuestion];
  
  document.getElementById('question-text').innerHTML = 
    `<span class="text-indigo-600 font-medium">${currentQuestion + 1}.</span> ${q}`;

  document.getElementById('current-question').textContent = currentQuestion + 1;

  const optionsDiv = document.getElementById('options');
  optionsDiv.innerHTML = `
    <div class="grid grid-cols-1 gap-3">
      <div onclick="selectAnswer(5)" class="answer-option">5 — Полностью согласен</div>
      <div onclick="selectAnswer(4)" class="answer-option">4 — Согласен</div>
      <div onclick="selectAnswer(3)" class="answer-option">3 — Нейтрально</div>
      <div onclick="selectAnswer(2)" class="answer-option">2 — Не согласен</div>
      <div onclick="selectAnswer(1)" class="answer-option">1 — Полностью не согласен</div>
    </div>
  `;

  updateProgress();
}

function selectAnswer(value) {
  answers[currentQuestion] = value;

  document.querySelectorAll('.answer-option').forEach(el => {
    el.classList.remove('selected', 'border-indigo-600', 'bg-indigo-50', 'shadow-md');
    const match = el.getAttribute('onclick')?.match(/\d+/);
    if (match && parseInt(match[0]) === value) {
      el.classList.add('selected', 'border-indigo-600', 'bg-indigo-50', 'shadow-md');
    }
  });

  setTimeout(() => {
    if (currentQuestion < questions.length - 1) {
      currentQuestion++;
      loadQuestion();
    } else {
      finishTest();
    }
  }, 380);
}

function updateProgress() {
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const progressBar = document.getElementById('progress-bar');
  const progressText = document.getElementById('progress-text');
  if (progressBar) progressBar.style.width = `${progress}%`;
  if (progressText) progressText.textContent = `${Math.round(progress)}%`;
}

function prevQuestion() {
  if (currentQuestion > 0) {
    currentQuestion--;
    loadQuestion();
  }
}

function calculateResult() {
  const totalScore = answers.reduce((sum, val) => sum + val, 0);
  const maxScore = questions.length * 5;
  const percentage = Math.round((totalScore / maxScore) * 100);

  let scaleResults = {};
  let scaleHTML = "<h3 class='text-xl font-medium mt-8 mb-4'>Результаты по шкалам:</h3>";

  Object.keys(scales).forEach(scaleName => {
    const indices = scales[scaleName];
    let score = 0;
    indices.forEach(idx => {
      if (answers[idx]) score += answers[idx];
    });
    const max = indices.length * 5;
    const percent = Math.round((score / max) * 100);
    scaleResults[scaleName] = { score, max, percent };
    scaleHTML += `<p><strong>${scaleName}:</strong> ${score} из ${max} (${percent}%)</p>`;
  });

  let level = "", description = "";
  if (percentage >= 80) {
    level = "Очень высокий уровень";
    description = "Вы обладаете ярко выраженными духовно-нравственными качествами личности.";
  } else if (percentage >= 65) {
    level = "Высокий уровень";
    description = "Хорошо развитые духовные качества. Вы стремитесь жить в соответствии с высокими нравственными стандартами.";
  } else if (percentage >= 50) {
    level = "Средний уровень";
    description = "Умеренно выраженные качества духовной личности.";
  } else if (percentage >= 35) {
    level = "Ниже среднего";
    description = "Духовные качества выражены относительно слабо.";
  } else {
    level = "Низкий уровень";
    description = "Низкая выраженность духовно-нравственных качеств.";
  }

  return { totalScore, maxScore, percentage, level, description, scaleHTML, scaleResults };
}

async function finishTest() {
  document.getElementById('test-screen').classList.add('hidden');
  const result = calculateResult();

  document.getElementById('result-score').innerHTML = `${result.totalScore} <span class="text-2xl text-gray-500">из ${result.maxScore} (${result.percentage}%)</span>`;
  document.getElementById('result-level').textContent = result.level;
  document.getElementById('result-description').innerHTML = `
    <p>${result.description}</p>
    ${result.scaleHTML}
  `;

  document.getElementById('result-screen').classList.remove('hidden');
  await saveToGoogleSheets(result);
}

async function saveToGoogleSheets(result) {
  const scriptURL = "https://script.google.com/macros/s/AKfycbxaH8oWEE0mkKv89nnS-IMU4BkfVX9G0MGzcnnc_pUJImb3WO1e0XtdRwKJbUUc4KmuXw/exec";
  const formData = new FormData();
  
  formData.append("participant_id", participantId);
  formData.append("test_name", "Духовная личность");
  formData.append("gender", gender);
  formData.append("age", age);
  formData.append("education", education);
  formData.append("total_score", result.totalScore);
  formData.append("percentage", result.percentage);
  formData.append("level", result.level);

  Object.keys(result.scaleResults).forEach(key => {
    formData.append(`scale_${key.toLowerCase().replace(/\s+/g, '_')}`, result.scaleResults[key].score);
  });

  try {
    await fetch(scriptURL, { method: "POST", body: formData, mode: "no-cors" });
    console.log("✅ Результат 'Духовная личность' отправлен в Google Sheets");
  } catch (e) {
    console.error("❌ Ошибка отправки:", e);
  }
}

function restartTest() {
  location.reload();
}

// === ПЕРЕХОД К СЛЕДУЮЩЕМУ ТЕСТУ ===
function goToNextTest() {
  const result = calculateResult();
  const testResults = JSON.parse(localStorage.getItem('testResults') || '[]');
  const currentIndex = parseInt(localStorage.getItem('currentTestIndex') || '0');
  
  testResults[currentIndex] = {
    id: testSequence[currentIndex]?.id || "spiritual-personality",
    name: testSequence[currentIndex]?.title || "Духовная личность",
    totalScore: result.totalScore,
    percentage: result.percentage,
    level: result.level,
    scaleResults: result.scaleResults,
    timestamp: new Date().toISOString()
  };
  localStorage.setItem('testResults', JSON.stringify(testResults));
  
  const nextIndex = currentIndex + 1;
  if (nextIndex < testSequence.length) {
    localStorage.setItem('currentTestIndex', nextIndex);
    window.location.href = testSequence[nextIndex].file;
  } else {
    window.location.href = "../complete.html";
  }
}