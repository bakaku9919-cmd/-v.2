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
    "Доброта – одно из моих главных качеств",
    "Необходимость сделать что-то сложное и важное тяготит меня",
    "Я не считаю, что в споре может быть только одна правильная точка зрения",
    "Мне достаточно легко дается усвоение новых знаний",
    "Я часто действую необдуманно",
    "Я хорошо разбираюсь в жизни",
    "Обычно мне несложно перейти от замыслов к делу",
    "Мне бывает сложно понять, что я чувствую в данный момент",
    "Мне легко найти выход из сложной ситуации",
    "Я считаю себя терпеливым человеком",
    "Мне нравится заботиться о других людях",
    "Я умею признавать свои ошибки",
    "Прежде чем принять решение, я задумываюсь о его возможных последствиях",
    "В критических ситуациях мне очень сложно сдерживать эмоции",
    "Я доброжелательно отношусь к людям",
    "Приняв решение, я не отступаю от своей цели",
    "Обычно мне не сложно понять других людей и их поступки",
    "Обычно я не жалею о том, что уже сделано",
    "Меня легко раздражают люди, которые спорят со мной",
    "Я не боюсь препятствий в достижении цели",
    "Я принимаю жизнь такой, какая она есть",
    "Мне не сложно принять мнение другого человека, даже если оно отлично от моего собственного",
    "Я часто ссорюсь с людьми по различным причинам",
    "Обычно я стараюсь понять причину того или иного события, поступка",
    "Я во многом недоволен своей жизнью",
    "Когда я озадачен проблемой, одно из первых, что я делаю, это анализ всей имеющейся информации",
    "Если я вижу, что человеку нужна помощь, я пытаюсь ему помочь",
    "Я могу найти общий язык с большинством людей",
    "Обычно я стараюсь утешить и успокоить человека, когда тот нуждается в этом",
    "Обычно мне не сложно сконцентрироваться на главном, не отвлекаясь по пустякам",
    "Я всегда пытаюсь рассмотреть проблему со всех сторон",
    "Обычно я не могу долго таить зла на человека и прощаю его, даже если он меня сильно обидел"
];

// === Шкалы (индексы с 0) ===
const scaleK = [2, 11, 12, 16, 21, 23, 25, 30];        // Когнитивная
const scaleP = [3, 5, 6, 8, 15, 17, 19, 27, 29];       // Поведенческие
const scaleG = [0, 9, 10, 14, 20, 26, 28, 31];         // Гуманистическая
const scaleSReverse = [1, 4, 7, 13, 18, 22, 24];       // Спонтанность (обратная)

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
  console.log("%cМетодика диагностики мудрости загружена (новая версия)", "color: #4f46e5; font-weight: bold");
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
    "1 — абсолютно не согласен, это не про меня",
    "2 — скорее нет, чем да",
    "3 — нечто среднее",
    "4 — скорее да, чем нет",
    "5 — абсолютно согласен, точно про меня"
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
    el.innerHTML = '';
    const num = parseInt(el.id.split('-')[1]);
    if (value === num) {
      el.classList.add('border-indigo-600', 'bg-indigo-50');
      el.innerHTML = '<div class="w-3 h-3 bg-indigo-600 rounded-full"></div>';
    } else {
      el.classList.remove('border-indigo-600', 'bg-indigo-50');
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
  // Прямые шкалы
  const K = scaleK.reduce((sum, idx) => sum + (answers[idx] || 0), 0);
  const P = scaleP.reduce((sum, idx) => sum + (answers[idx] || 0), 0);
  const G = scaleG.reduce((sum, idx) => sum + (answers[idx] || 0), 0);

  // Обратная шкала S: 1↔5, 2↔4, 3→3
  const S = scaleSReverse.reduce((sum, idx) => {
    const val = answers[idx] || 0;
    return sum + (6 - val);
  }, 0);

  const total = K + P + G + S;
  const maxScore = 32 * 5;
  const percentage = Math.round((total / maxScore) * 100);

  let level, description;
  if (percentage >= 80) {
    level = "Очень высокий уровень мудрости";
    description = "Вы обладаете зрелым мышлением, эмоциональной устойчивостью и гуманистической направленностью.";
  } else if (percentage >= 65) {
    level = "Высокий уровень мудрости";
    description = "Вы склонны к рефлексии, сопереживанию и взвешенным решениям.";
  } else if (percentage >= 50) {
    level = "Средний уровень мудрости";
    description = "У вас есть потенциал к мудрости, но требуется больше осознанности и принятия жизни.";
  } else if (percentage >= 35) {
    level = "Ниже среднего";
    description = "Мудрость выражена слабо. Возможно, преобладают импульсивность и критичность.";
  } else {
    level = "Низкий уровень мудрости";
    description = "Преобладают эмоциональная неустойчивость, непринятие неопределённости и замкнутость.";
  }

  return {
    K, P, G, S, total, maxScore, percentage, level, description
  };
}

async function finishTest() {
  const result = calculateResult();
  document.getElementById('test-screen').classList.add('hidden');

  const scaleDetails = `
    <h3 class='text-xl font-medium mt-8 mb-4'>По компонентам мудрости:</h3>
    <ul class='space-y-2 text-left'>
      <li><strong>Когнитивная сфера (К):</strong> ${result.K}</li>
      <li><strong>Поведенческие проявления (П):</strong> ${result.P}</li>
      <li><strong>Гуманистическая направленность (Г):</strong> ${result.G}</li>
      <li><strong>Эмоциональная устойчивость (С):</strong> ${result.S} (инвертирована)</li>
    </ul>
  `;

  document.getElementById('result-score').innerHTML = 
    `${result.total} <span class="text-2xl text-gray-500">из ${result.maxScore}</span>`;
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
  formData.append("test_name", "Методика диагностики мудрости");
  formData.append("gender", gender);
  formData.append("age", age);
  formData.append("education", education);
  formData.append("total_score", result.total);
  formData.append("percentage", result.percentage);
  formData.append("level", result.level);
  formData.append("K", result.K);
  formData.append("P", result.P);
  formData.append("G", result.G);
  formData.append("S", result.S);

  try {
    await fetch(scriptURL, { method: "POST", body: formData, mode: "no-cors" });
    console.log("✅ Результат 'Методика диагностики мудрости' отправлен в Google Sheets");
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
    id: testSequence[currentIndex]?.id || "wisdom",
    name: testSequence[currentIndex]?.title || "Методика диагностики мудрости",
    totalScore: result.total,
    percentage: result.percentage,
    level: result.level,
    K: result.K,
    P: result.P,
    G: result.G,
    S: result.S,
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