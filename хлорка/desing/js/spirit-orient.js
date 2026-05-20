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
  "Проявлять бескорыстную любовь к людям",
  "Отстаивать истину, даже когда все вокруг против",
  "Ценить красоту человечности больше, чем материальную выгоду",
  "Радоваться успехам и достижениям других людей",
  "Признать ценность и смысл духовного саморазвития, важность улучшения себя",
  "Реализовывать в своем поведении стремление к высшим ценностям: истине, добру, справедливости, красоте",
  "Любить все живое",
  "Стремиться к самопознанию и открытию своей духовной сущности",
  "Не обижать других",
  "Совершать поступки, приносящие людям благо",
  "Стремиться к постижению тайны и высшего смысла бытия",
  "Помогать другим людям, не думая о вознаграждении",
  "Проявлять к окружающим дружелюбие",
  "Быть правдивым и честным даже в трудных ситуациях",
  "Проявлять отсутствие враждебности к кому бы то ни было",
  "Быть благодарным за то хорошее, что сделали ему люди",
  "Желать, чтобы другие были счастливы",
  "Принимать любую жизненную ситуацию, извлекая из нее опыт для саморазвития",
  "Жить и действовать в соответствии с совестью",
  "Видеть хорошее в людях",
  "Стремиться к высшим смыслам бытия: человечности и мудрости",
  "Не проявлять жадность",
  "Стремиться улучшить мир с помощью своей деятельности",
  "Проявлять великодушие в реальном поведении",
  "Стремиться к достижению высокой цели, несмотря ни на какие препятствия",
  "Видеть смысл в избавлении от эгоизма и проявлении любви к людям",
  "Проявлять сострадание в реальных жизненных ситуациях",
  "Стремиться к познанию высшей истины, к Божественному, Абсолюту",
  "Оказывать действенную помощь другим в экстренной ситуации",
  "Выполнять свои обязанности добросовестно",
  "Видеть свое предназначение в стремлении делать добро, помогать людям, совершенствовать мир",
  "Ценить то, что имеет",
  "Сохранять оптимизм даже в трудных ситуациях",
  "Слушать и понимать голос совести",
  "Проявлять добродетельное поведение в реальных жизненных ситуациях",
  "Видеть смысл не в накопительстве, а в развитии духовного потенциала",
  "Стойко переносить удары судьбы",
  "Признавать свои ошибки, при этом исправляя их",
  "Проявлять мужество, защищая справедливость",
  "Не поддаваться унынию"
];

// === ШКАЛЫ (индексы с 0) ===
const scales = {
  "Ценностно-смысловые устремления": [2, 4, 5, 7, 10, 20, 25, 27, 31, 35],
  "Высшие нравственные чувства": [0, 3, 6, 12, 14, 15, 16, 19, 26, 33],
  "Склонность к добродетельному поведению": [8, 9, 11, 18, 21, 22, 23, 29, 30, 34],
  "Моральная сила духа": [1, 13, 17, 24, 28, 32, 36, 37, 38, 39]
};

// === ПОРЯДОК ТЕСТОВ ===
const testSequence = [
  { id: "spiritual-orientation", title: "Духовная ориентация личности", file: "spirit-orient.html" },
  { id: "spiritual-personality", title: "Духовная личность", file: "spirit-person.html" },
  { id: "altruism", title: "Альтруистические установки", file: "altr.html" },
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
  console.log("%cОпросник «Духовная ориентация личности» загружен (новая версия)", "color: #4f46e5; font-weight: bold");
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
      <div onclick="selectAnswer(5)" class="answer-option">5 — Очень похож на меня</div>
      <div onclick="selectAnswer(4)" class="answer-option">4 — Похож на меня</div>
      <div onclick="selectAnswer(3)" class="answer-option">3 — Немного похож на меня</div>
      <div onclick="selectAnswer(2)" class="answer-option">2 — Не похож на меня</div>
      <div onclick="selectAnswer(1)" class="answer-option">1 — Совсем не похож на меня</div>
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

  // Расчёт по шкалам
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
  if (percentage >= 82) {
    level = "Очень высокий уровень";
    description = "Ярко выражена духовная ориентация личности. Высокая устремлённость к высшим ценностям, смыслам и самосовершенствованию.";
  } else if (percentage >= 70) {
    level = "Высокий уровень";
    description = "Хорошо развитая духовная ориентация. Духовные ценности играют значительную роль в жизни.";
  } else if (percentage >= 55) {
    level = "Средний уровень";
    description = "Умеренная духовная ориентация. Духовная сфера значима, но не всегда является ведущей.";
  } else if (percentage >= 40) {
    level = "Ниже среднего";
    description = "Слабая выраженность духовной ориентации. Рекомендуется больше внимания уделять духовному развитию.";
  } else {
    level = "Низкий уровень";
    description = "Низкая духовная ориентация личности.";
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
  formData.append("test_name", "Духовная ориентация личности");
  formData.append("gender", gender);
  formData.append("age", age);
  formData.append("education", education);
  formData.append("total_score", result.totalScore);
  formData.append("percentage", result.percentage);
  formData.append("level", result.level);

  // Отправка результатов по шкалам
  Object.keys(result.scaleResults).forEach(key => {
    formData.append(`scale_${key.toLowerCase().replace(/\s+/g, '_')}`, result.scaleResults[key].score);
  });

  try {
    await fetch(scriptURL, { method: "POST", body: formData, mode: "no-cors" });
    console.log("✅ Результат 'Духовная ориентация личности' отправлен в Google Sheets");
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
    id: testSequence[currentIndex]?.id || "spiritual-orientation",
    name: testSequence[currentIndex]?.title || "Духовная ориентация личности",
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