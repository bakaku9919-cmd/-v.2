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
  "Когда я иду, я специально обращаю внимание на ощущения моего тела в движении",
  "Я легко подбираю слова для описания своих чувств",
  "Я критикую себя за неразумные или неуместные эмоции",
  "Я осознаю свои чувства и эмоции, но не реагирую на них",
  "Когда я делаю что-нибудь, я думаю о чем-то другом и легко отвлекаюсь",
  "Когда я моюсь в душе или принимаю ванну, я прислушиваюсь к ощущению воды на своем теле",
  "Я легко могу выразить словами свои убеждения, мнения и ожидания",
  "Я не обращаю внимание на то, чем занимаюсь, потому что фантазирую, беспокоюсь или отвлечен чем-то еще",
  "Я наблюдаю за своими чувствами, не погружаясь в них",
  "Я говорю себе, что не должен чувствовать то, что чувствую",
  "Я замечаю, как еда и напитки влияют на мои мысли, телесные ощущения и эмоции",
  "Мне трудно подобрать слова, чтобы описать то, о чем я думаю",
  "Я легко отвлекаюсь",
  "Я считаю некоторые свои мысли ненормальными или плохими, и полагаю, что не должен думать подобным образом",
  "Я обращаю внимание на еле заметные ощущения, например, чувствую дуновение ветра в волосах и тепло от солнечных лучей на моем лице",
  "Я испытываю трудности, пытаясь подобрать правильные слова для выражения своих чувств по тому или иному поводу",
  "Я сужу о том, хороши или плохи мои мысли",
  "Мне сложно сосредоточится на том, что происходит в данный момент",
  "Когда меня тревожит какие-то мысли и образы, я абстрагируюсь и смотрю на них «со стороны», а не позволяю им поглотить себя",
  "Я обращаю внимание на звуки, такие как тиканье часов, щебетание птиц, звук проезжающей машины",
  "Я наблюдаю за своими чувствами, но они не поглощают меня",
  "Когда у меня возникают ощущения в теле, мне трудно их описать, так как не могу найти нужные слова",
  "Кажется, что я действую «на автопилоте», не особо отдавая себе отчета в своих действиях",
  "Когда меня посещают тревожные мысли и образы, я воспринимаю это как данность и не реагирую на них",
  "Я говорю себе, что не должен думать так, как я думаю",
  "Я замечаю окружающие меня запахи и ароматы",
  "Даже когда я ужасно расстроен, я могу подобрать слова для описания моего состояния",
  "Я мечусь от одного дела к другому, по-настоящему не уделяя им внимания",
  "Когда у меня возникают тревожные мысли и образы, я склонен отмечать их, но не реагировать",
  "Я считаю некоторые свои эмоции плохими или неподобающими, и что мне не следовало их испытывать",
  "Я отмечаю визуальные элементы в искусстве и природе, такие как цвета, формы, текстуры, игра света и тени",
  "Я склонен переносить свои переживания в слова",
  "Когда меня посещают тревожные мысли и образы, я просто отмечаю их и даю им уйти",
  "Я выполняю работу или задания машинально, не осознавая того, что я делаю",
  "Когда у меня возникают тревожные мысли и образы, я оцениваю себя как хорошего или плохого, в зависимости от того, о чем была эта мысль/образ",
  "Я обращаю внимание на то, как мои эмоции влияют на мои мысли и поведение",
  "Обычно я могу детально описать, как я чувствую себя в данный момент",
  "Я обнаруживаю, что делаю что-то, не сосредоточивая на этом внимания",
  "Я осуждаю себя когда мне приходят в голову неразумные мысли"
];

// === Шкалы (1-based индексы) ===
const scales = {
  "Наблюдение": [1, 6, 11, 15, 20, 26, 31, 36],
  "Описание": [2, 7, 12, 16, 22, 27, 32, 37],
  "Осознанная активность": [5, 8, 13, 18, 23, 28, 34, 38],
  "Безоценочное отношение": [3, 10, 14, 17, 25, 30, 35, 39],
  "Нереагирование": [4, 9, 19, 21, 24, 29, 33]
};

// Обратные пункты (1-based)
const reverseItems = [3, 5, 8, 10, 12, 13, 14, 16, 17, 18, 22, 23, 25, 28, 30, 34, 35, 38, 39];

// === ПОРЯДОК ТЕСТОВ ===
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
  console.log("%cПятифакторный опросник осознанности загружен", "color: #4f46e5; font-weight: bold");
  loadQuestion();
});

function loadQuestion() {
  const q = questions[currentQuestion];
  document.getElementById('question-text').innerHTML = 
    `<span class="text-indigo-600 font-medium">${currentQuestion + 1}.</span> ${q}`;

  document.getElementById('current-q').textContent = currentQuestion + 1;
  renderOptions();
  updateProgress();
}

function renderOptions() {
  const container = document.getElementById('options');
  container.innerHTML = `
    <div class="grid grid-cols-1 gap-3">
      <div onclick="selectAnswer(1)" class="answer-option">1 — Никогда или очень редко</div>
      <div onclick="selectAnswer(2)" class="answer-option">2 — Редко</div>
      <div onclick="selectAnswer(3)" class="answer-option">3 — Иногда</div>
      <div onclick="selectAnswer(4)" class="answer-option">4 — Часто</div>
      <div onclick="selectAnswer(5)" class="answer-option">5 — Очень часто или всегда</div>
    </div>
  `;
  
  if (answers[currentQuestion] !== undefined) {
    document.querySelectorAll('.answer-option').forEach(el => {
      el.classList.remove('selected', 'border-indigo-600', 'bg-indigo-50', 'shadow-md');
      const match = el.getAttribute('onclick')?.match(/\d+/);
      if (match && parseInt(match[0]) === answers[currentQuestion]) {
        el.classList.add('selected', 'border-indigo-600', 'bg-indigo-50', 'shadow-md');
      }
    });
  }
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
  const scaleResults = {};
  let totalScore = 0;

  Object.keys(scales).forEach(scaleName => {
    const qNumbers = scales[scaleName];
    let score = 0;

    qNumbers.forEach(num => {
      const idx = num - 1;
      let value = answers[idx] || 3;

      if (reverseItems.includes(num)) {
        value = 6 - value;
      }
      score += value;
    });

    const max = qNumbers.length * 5;
    const percent = Math.round((score / max) * 100);

    scaleResults[scaleName] = { score, max, percent };
    totalScore += score;
  });

  const totalMax = 39 * 5;
  const totalPercent = Math.round((totalScore / totalMax) * 100);

  let level = "";
  if (totalPercent >= 80) level = "Очень высокий уровень осознанности";
  else if (totalPercent >= 70) level = "Высокий уровень осознанности";
  else if (totalPercent >= 55) level = "Средний уровень осознанности";
  else if (totalPercent >= 40) level = "Ниже среднего";
  else level = "Низкий уровень осознанности";

  return { scaleResults, totalScore, totalMax, totalPercent, level };
}

async function finishTest() {
  const result = calculateResult();
  document.getElementById('test-screen').classList.add('hidden');

  document.getElementById('result-score').innerHTML = 
    `${result.totalScore} <span class="text-2xl text-gray-500">из ${result.totalMax} (${result.totalPercent}%)</span>`;
  document.getElementById('result-level').textContent = result.level;

  let scaleHTML = "<h3 class='text-xl font-medium mt-8 mb-6'>Результаты по шкалам:</h3>";
  Object.keys(result.scaleResults).forEach(name => {
    const s = result.scaleResults[name];
    const barColor = s.percent > 70 ? 'bg-green-500' : s.percent > 50 ? 'bg-yellow-500' : 'bg-red-500';
    scaleHTML += `
      <div class="mb-6">
        <div class="flex justify-between mb-1">
          <strong>${name}</strong>
          <span>${s.score} из ${s.max} (${s.percent}%)</span>
        </div>
        <div class="w-full bg-gray-200 h-2 rounded">
          <div class="h-2 rounded ${barColor}" style="width: ${s.percent}%"></div>
        </div>
      </div>`;
  });

  document.getElementById('result-description').innerHTML = scaleHTML;
  document.getElementById('result-screen').classList.remove('hidden');
  await saveToGoogleSheets(result);
}

async function saveToGoogleSheets(result) {
  const scriptURL = "https://script.google.com/macros/s/AKfycbxaH8oWEE0mkKv89nnS-IMU4BkfVX9G0MGzcnnc_pUJImb3WO1e0XtdRwKJbUUc4KmuXw/exec";
  const formData = new FormData();
  
  formData.append("participant_id", participantId);
  formData.append("test_name", "Пятифакторный опросник осознанности (ПФОО)");
  formData.append("gender", gender);
  formData.append("age", age);
  formData.append("education", education);
  formData.append("total_score", result.totalScore);
  formData.append("percentage", result.totalPercent);
  formData.append("level", result.level);

  Object.keys(result.scaleResults).forEach(key => {
    formData.append(`scale_${key.toLowerCase().replace(/\s+/g, '_')}`, result.scaleResults[key].score);
  });

  try {
    await fetch(scriptURL, { method: "POST", body: formData, mode: "no-cors" });
    console.log("✅ Результат 'ПФОО' отправлен в Google Sheets");
  } catch (e) {
    console.error("❌ Ошибка отправки:", e);
  }
}

function restartTest() {
  location.reload();
}

function goToNextTest() {
  const result = calculateResult();
  const testResults = JSON.parse(localStorage.getItem('testResults') || '[]');
  const currentIndex = parseInt(localStorage.getItem('currentTestIndex') || '0');
  
  testResults[currentIndex] = {
    id: testSequence[currentIndex]?.id || "pfoo",
    name: testSequence[currentIndex]?.title || "Пятифакторный опросник осознанности",
    totalScore: result.totalScore,
    percentage: result.totalPercent,
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