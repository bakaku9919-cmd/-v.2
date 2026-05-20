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

// === Вопросы ===
const questions = [
  "Я обычно задумываюсь о причинах того, что со мной происходит",
  "Иногда внимание к собственным переживаниям отвлекает меня от дел",
  "Я люблю мечтать о том, чего в моей жизни нет",
  "Анализируя собственные действия, я узнаю о себе что-то новое",
  "Я склонен долго переживать по поводу происходящего",
  "Я могу замечтаться и забыть обо всем",
  "Изучение других людей помогает мне лучше понимать самого себя",
  "Когда у меня что-то идет не так, мне трудно от этого отвлечься",
  "Я люблю пофантазировать",
  "Часто полезно остановиться, чтобы лучше понять ситуацию в целом",
  "Мне бывает трудно перейти от размышлений к действию",
  "Мне интересно представлять себя в разных ситуациях",
  "В случае конфликта полезно попытаться увидеть ситуацию глазами оппонента",
  "Приступая к какому-либо делу, я долго беспокоюсь о том, что получится в результате",
  "Я люблю представлять в своем воображении случайные встречи",
  "Самопознание помогает понимать других людей",
  "Когда я замечаю, что тревожусь о чем-то, я начинаю переживать еще сильнее",
  "Занимаясь чем-то, я нередко мысленно переношусь совсем в другое место",
  "Чтобы понять ситуацию, нужно уметь соотносить свои чувства с тем, что их вызывает",
  "Нередко я не могу отделаться от мыслей о моих текущих проблемах",
  "Мне нравится мысленно путешествовать по местам, где я еще не был",
  "Больше всего я узнаю о себе, когда анализирую то, что сделал или делаю",
  "Порой я настолько сильно переживаю свои ошибки, что не в состоянии ничего сделать, чтобы их исправить",
  "Я часто фантазирую о том, как моя жизнь могла бы сложиться иначе",
  "Расхождение взглядов других людей с моими служит для меня источником ценной информации",
  "Я постоянно думаю о своих неудачах",
  "Мне легко увлечься посторонними мыслями",
  "Я обращаю внимание на то, как я реагирую на людей и события",
  "Когда в моей жизни происходит что-то необычное, я вижу в этом повод задуматься",
  "Во многих ситуациях бывает полезно сначала разобраться в собственных желаниях и чувствах"
];

// === Шкалы (индексы с 0) ===
// Системная рефлексия: вопросы 1,4,7,10,13,16,19,22,25,28,29,30
const systemicReflection = [0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 28, 29];
// Интроспекция: 2,5,8,11,14,17,20,23,26
const introspection = [1, 4, 7, 10, 13, 16, 19, 22, 25];
// Квазирефлексия: 3,6,9,12,15,18,21,24,27
const quasiReflection = [2, 5, 8, 11, 14, 17, 20, 23, 26];

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
  console.log("%cДифференциальный тест рефлексивности загружен (новая версия)", "color: #4f46e5; font-weight: bold");
  loadQuestion();
});

function loadQuestion() {
  const q = questions[currentQuestion];
  document.getElementById('question-text').textContent = `${currentQuestion + 1}. ${q}`;

  document.getElementById('current-question').textContent = currentQuestion + 1;
  updateProgress();
  renderOptions();
}

function renderOptions() {
  const container = document.getElementById('options');
  const labels = [
    "1 — Нет",
    "2 — Скорее нет",
    "3 — Скорее да",
    "4 — Да"
  ];

  let html = '';
  labels.forEach((label, i) => {
    const value = i + 1;
    html += `
      <div class="answer-option flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition"
           onclick="selectAnswer(${value})">
        <div id="opt-${value}"
             class="w-6 h-6 border-2 border-gray-400 rounded-full flex items-center justify-center">
          ${answers[currentQuestion] === value ? '<div class="w-3 h-3 bg-indigo-600 rounded-full"></div>' : ''}
        </div>
        <span class="text-gray-700">${label}</span>
      </div>`;
  });

  container.innerHTML = html;
  highlightSelected();
}

function selectAnswer(value) {
  answers[currentQuestion] = value;
  highlightSelected();

  setTimeout(() => {
    if (currentQuestion < questions.length - 1) {
      currentQuestion++;
      loadQuestion();
    } else {
      finishTest();
    }
  }, 300);
}

function highlightSelected() {
  const value = answers[currentQuestion];
  document.querySelectorAll('[id^="opt-"]').forEach(el => {
    el.classList.remove('border-indigo-600', 'bg-indigo-50');
    const num = parseInt(el.id.split('-')[1]);
    if (value === num) {
      el.classList.add('border-indigo-600', 'bg-indigo-50');
    }
  });
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
  const sys = systemicReflection.reduce((sum, idx) => sum + (answers[idx] || 0), 0);
  const int = introspection.reduce((sum, idx) => sum + (answers[idx] || 0), 0);
  const qua = quasiReflection.reduce((sum, idx) => sum + (answers[idx] || 0), 0);

  const maxSys = 12 * 4;
  const maxInt = 9 * 4;
  const maxQua = 9 * 4;

  const percentSys = Math.round((sys / maxSys) * 100);
  const percentInt = Math.round((int / maxInt) * 100);
  const percentQua = Math.round((qua / maxQua) * 100);

  const totalScore = sys + int + qua;
  const totalMax = maxSys + maxInt + maxQua;
  const totalPercent = Math.round((totalScore / totalMax) * 100);

  let level, description;
  if (totalPercent >= 80) {
    level = "Высокая рефлексивность";
    description = "Вы склонны к глубокому анализу себя и ситуации. Преобладает системная рефлексия — это зрелая форма самопознания.";
  } else if (totalPercent >= 60) {
    level = "Средняя рефлексивность";
    description = "Вы способны к самоанализу, но иногда он переходит в чрезмерное переживание или мечтательность.";
  } else {
    level = "Низкая рефлексивность";
    description = "Склонность к рефлексии выражена слабо. Возможно, преобладают импульсивность или избегание внутреннего анализа.";
  }

  return {
    sys, int, qua,
    maxSys, maxInt, maxQua,
    percentSys, percentInt, percentQua,
    totalScore, totalMax, totalPercent,
    level, description
  };
}

async function finishTest() {
  const result = calculateResult();
  document.getElementById('test-screen').classList.add('hidden');

  const scaleDetails = `
    <h3 class='text-xl font-medium mt-8 mb-4'>По шкалам:</h3>
    <ul class='space-y-3 text-left'>
      <li>
        <strong>Системная рефлексия:</strong> ${result.sys} из ${result.maxSys} (${result.percentSys}%)
        <div class="w-full bg-gray-200 h-2 rounded mt-1">
          <div class="h-2 rounded bg-green-500" style="width: ${result.percentSys}%"></div>
        </div>
      </li>
      <li>
        <strong>Интроспекция:</strong> ${result.int} из ${result.maxInt} (${result.percentInt}%)
        <div class="w-full bg-gray-200 h-2 rounded mt-1">
          <div class="h-2 rounded bg-yellow-500" style="width: ${result.percentInt}%"></div>
        </div>
      </li>
      <li>
        <strong>Квазирефлексия:</strong> ${result.qua} из ${result.maxQua} (${result.percentQua}%)
        <div class="w-full bg-gray-200 h-2 rounded mt-1">
          <div class="h-2 rounded bg-blue-500" style="width: ${result.percentQua}%"></div>
        </div>
      </li>
    </ul>
  `;

  document.getElementById('result-score').innerHTML = 
    `${result.totalScore} <span class="text-2xl text-gray-500">из ${result.totalMax} (${result.totalPercent}%)</span>`;
  document.getElementById('result-level').textContent = result.level;
  document.getElementById('result-description').innerHTML = `
    <p>${result.description}</p>
    ${scaleDetails}
  `;

  document.getElementById('result-screen').classList.remove('hidden');
  await saveToGoogleSheets(result);
}

async function saveToGoogleSheets(result) {
  const scriptURL = "https://script.google.com/macros/s/AKfycbxaH8oWEE0mkKv89nnS-IMU4BkfVX9G0MGzcnnc_pUJImb3WO1e0XtdRwKJbUUc4KmuXw/exec";
  const formData = new FormData();

  formData.append("participant_id", participantId);
  formData.append("test_name", "ДТР (Дифференциальный тест рефлексивности)");
  formData.append("gender", gender);
  formData.append("age", age);
  formData.append("education", education);
  formData.append("total_score", result.totalScore);
  formData.append("percentage", result.totalPercent);
  formData.append("level", result.level);
  formData.append("systemic", result.sys);
  formData.append("introspection", result.int);
  formData.append("quasi", result.qua);

  try {
    await fetch(scriptURL, { method: "POST", body: formData, mode: "no-cors" });
    console.log("✅ Результат 'ДТР' отправлен в Google Sheets");
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
    id: testSequence[currentIndex]?.id || "reflex",
    name: testSequence[currentIndex]?.title || "Дифференциальный тест рефлексивности",
    totalScore: result.totalScore,
    percentage: result.totalPercent,
    level: result.level,
    systemic: result.sys,
    introspection: result.int,
    quasi: result.qua,
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