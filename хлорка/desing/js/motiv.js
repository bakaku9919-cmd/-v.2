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

const questions = [
  "Я внимательно читаю каждую книгу, прежде чем вернуть ее в библиотеку.",
  "Я не испытываю колебаний, когда кому-нибудь нужно помочь в беде.",
  "Я всегда внимательно слежу за тем, как я одет.",
  "Дома я веду себя за столом так же, как в столовой.",
  "Я никогда не испытываю ни к кому сильных симпатий.",
  "Был(и) случай(и), когда я бросил что-то делать, потому что не был уверен в своих силах.",
  "Иногда я люблю позлословить об отсутствующих.",
  "Я всегда внимательно слушаю собеседника, кто бы он ни был.",
  "Был случай, когда я придумал вескую причину, чтобы оправдаться.",
  "Случалось, я пользовался оплошностью человека.",
  "Я всегда охотно признаю свои ошибки.",
  "Иногда вместо того, чтобы простить человека, я стараюсь отплатить ему тем же.",
  "Были случаи, когда я настаивал на том, чтобы делали по-моему.",
  "У меня не возникает внутреннего протеста, когда меня просят оказать услугу.",
  "У меня никогда не возникает досады, когда высказывают мнение, противоположное моему.",
  "Перед длительной поездкой я всегда тщательно продумываю, что с собой взять.",
  "Были случаи, когда я завидовал удаче других.",
  "Иногда меня раздражают люди, которые обращаются ко мне с просьбой.",
  "Когда у людей неприятности, я иногда думаю, что они получили по заслугам.",
  "Я никогда с улыбкой не говорил неприятных вещей."
];

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
  console.log("%cШкала мотивации одобрения загружена (новая версия)", "color: #4f46e5; font-weight: bold");
  loadQuestion();
});

function loadQuestion() {
  document.getElementById('question-text').innerHTML = 
    `<span class="text-indigo-600 font-medium">${currentQuestion + 1}.</span> ${questions[currentQuestion]}`;

  document.getElementById('current-question').textContent = currentQuestion + 1;

  const optionsDiv = document.getElementById('options');
  optionsDiv.innerHTML = `
    <div onclick="selectAnswer(true)" class="answer-option text-center py-3">Да</div>
    <div onclick="selectAnswer(false)" class="answer-option text-center py-3">Нет</div>
  `;

  updateProgress();
}

function selectAnswer(value) {
  answers[currentQuestion] = value;

  document.querySelectorAll('.answer-option').forEach(el => {
    el.classList.remove('selected', 'border-indigo-600', 'bg-indigo-50', 'shadow-md');
    if ((el.textContent === "Да" && value === true) || (el.textContent === "Нет" && value === false)) {
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
  }, 350);
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
  let score = 0;

  // Ключ Марлоу-Краун (индексы с 0)
  const positive = [0, 1, 2, 3, 4, 7, 10, 13, 14, 15, 19];
  const negative = [5, 6, 8, 9, 11, 12, 16, 17, 18];

  positive.forEach(i => { if (answers[i] === true) score++; });
  negative.forEach(i => { if (answers[i] === false) score++; });

  let level = "", description = "";

  if (score >= 13) {
    level = "Высокий уровень";
    description = "Высокая потребность в социальном одобрении. Вы сильно зависите от мнения окружающих, чувствительны к оценкам и стараетесь соответствовать ожиданиям других.";
  } else if (score >= 10) {
    level = "Средний уровень";
    description = "Умеренная потребность в одобрении. Вы в целом независимы, но иногда ориентируетесь на мнение окружающих.";
  } else {
    level = "Низкий уровень";
    description = "Низкая потребность в одобрении. Вы независимы, собственные убеждения для вас важнее, чем чужое мнение. Мало подвержены социальному влиянию.";
  }

  return { score, maxScore: 20, level, description };
}

async function finishTest() {
  const result = calculateResult();
  document.getElementById('test-screen').classList.add('hidden');

  document.getElementById('result-score').innerHTML = `${result.score} <span class="text-2xl text-gray-500">из ${result.maxScore}</span>`;
  document.getElementById('result-level').textContent = result.level;
  document.getElementById('result-description').innerHTML = `<p>${result.description}</p>`;

  document.getElementById('result-screen').classList.remove('hidden');
  await saveToGoogleSheets(result);
}

async function saveToGoogleSheets(result) {
  const scriptURL = "https://script.google.com/macros/s/AKfycbxaH8oWEE0mkKv89nnS-IMU4BkfVX9G0MGzcnnc_pUJImb3WO1e0XtdRwKJbUUc4KmuXw/exec";
  const formData = new FormData();

  formData.append("participant_id", participantId);
  formData.append("test_name", "Шкала мотивации одобрения (Марлоу-Краун)");
  formData.append("gender", gender);
  formData.append("age", age);
  formData.append("education", education);
  formData.append("total_score", result.score);
  formData.append("max_score", result.maxScore);
  formData.append("level", result.level);

  try {
    await fetch(scriptURL, { method: "POST", body: formData, mode: "no-cors" });
    console.log("✅ Результат 'Марлоу-Краун' отправлен в Google Sheets");
  } catch (e) {
    console.error("❌ Ошибка отправки:", e);
  }
}

function restartTest() {
  location.reload();
}

// === ПЕРЕХОД К СЛЕДУЮЩЕМУ ТЕСТУ (ЗАВЕРШЕНИЕ) ===
function goToNextTest() {
  const result = calculateResult();
  const testResults = JSON.parse(localStorage.getItem('testResults') || '[]');
  const currentIndex = parseInt(localStorage.getItem('currentTestIndex') || '0');
  
  testResults[currentIndex] = {
    id: testSequence[currentIndex]?.id || "motiv",
    name: testSequence[currentIndex]?.title || "Шкала мотивации одобрения (Марлоу-Краун)",
    totalScore: result.score,
    level: result.level,
    timestamp: new Date().toISOString()
  };
  localStorage.setItem('testResults', JSON.stringify(testResults));
  
  // Это последний тест, переходим на страницу завершения
  window.location.href = "../complete.html";
}