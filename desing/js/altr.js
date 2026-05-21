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

// === Вопросы теста на альтруизм (23 вопроса) ===
const questions = [
  "Я никогда не опаздываю на работу или очень важные встречи",
  "Я не встречал людей, которые бы мне не нравились",
  "Я не люблю помогать другим: пусть сами о себе позаботятся",
  "Если я вижу физические страдания другого (например, рану), я стараюсь чем-то помочь",
  "Прежде чем взяться за какую-либо работу, я спрашиваю, сколько за это заплатят",
  "Помогать другим - большая радость",
  "Тратить свое время и силы на помощь другим не имеет смысла: вряд ли они ответят тебе тем же",
  "Я придерживаюсь принципа: \"помоги другому, и добро к тебе вернется\"",
  "Помогать другим людям, как правило, дело бесполезное",
  "Мне бы хотелось иметь условия для того, чтобы приносить пользу людям",
  "Я считаю, что всякая работа должна оплачиваться, иначе не стоит ее предлагать",
  "В мире есть масса дел, которые стоит выполнять совершенно бескорыстно",
  "Я считаю, что никогда не следует участвовать в развлекательных мероприятиях",
  "Я думаю, нет такого понятия, как \"искреннее заблуждение\"",
  "Если мне предлагают что-то сделать на общественных началах, я задумываюсь, а что мне это даст",
  "Я хотел бы поучаствовать в волонтерской программе или как-то еще помогать людям",
  "Если мне предлагают что-то сделать на общественных началах, я обычно отказываюсь",
  "Я часто сперва берусь выполнить какую-то работу и не спрашиваю, какую выгоду это принесет лично мне",
  "Увидев на улице несчастный случай, я пройду мимо, это не мое дело",
  "Люди достаточно добры по своей природе, и если я окажусь в беде, то кто-то мне все же поможет",
  "Я не верю в то, что в случае беды хоть кто-то придет мне на помощь",
  "Я не могу спокойно смотреть на страдания (например, физические травмы) других",
  "Я никогда не обижал другого человека"
];

// Группы вопросов (индексы с 0)
const lieScaleIndices = [0, 1, 12, 13, 22];        // шкала лжи
const directScoreIndices = [3, 5, 7, 9, 11, 15, 17, 19, 21];   // прямые
const invertedScoreIndices = [2, 4, 6, 8, 10, 14, 16, 18, 20]; // обратные

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
  console.log("%cТест на альтруизм загружен (новая версия)", "color: #4f46e5; font-weight: bold");
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
      <div onclick="selectAnswer(3)" class="answer-option">3  Абсолютно верно</div>
      <div onclick="selectAnswer(2)" class="answer-option">2  Да, чаще всего</div>
      <div onclick="selectAnswer(1)" class="answer-option">1  Скорее верно</div>
      <div onclick="selectAnswer(0)" class="answer-option">0  Затрудняюсь ответить</div>
      <div onclick="selectAnswer(-1)" class="answer-option">-1  Скорее не верно</div>
      <div onclick="selectAnswer(-2)" class="answer-option">-2  Неверно</div>
      <div onclick="selectAnswer(-3)" class="answer-option">-3  Совсем, категорически не верно</div>
    </div>
  `;

  updateProgress();
}

function selectAnswer(value) {
  answers[currentQuestion] = value;

  document.querySelectorAll('.answer-option').forEach(el => {
    el.classList.remove('selected', 'border-indigo-600', 'bg-indigo-50', 'shadow-md');
    // Исправленное регулярное выражение для отрицательных чисел
    const match = el.getAttribute('onclick')?.match(/selectAnswer\((-?\d+)\)/);
    if (match && parseInt(match[1]) === value) {
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

// === Расчёт результата ===
function calculateResult() {
  // 1. Шкала лжи (нормализуем -3..+3 в 0..6)
  const lieScore = lieScaleIndices.reduce((sum, idx) => {
    const val = answers[idx] || 0;
    return sum + (val + 3); // Сдвигаем шкалу с [-3,3] на [0,6]
  }, 0);

  // Проверка: допустимое количество баллов — до 18
  if (lieScore > 18) {
    return { valid: false, lieScore: lieScore };
  }

  // === ПРЯМЫЕ БАЛЛЫ (оставляем как есть, от -3 до +3) ===
  const directScore = directScoreIndices.reduce((sum, idx) => sum + (answers[idx] || 0), 0);
  
  // 3. Обратные баллы 
  const invertedScore = invertedScoreIndices.reduce((sum, idx) => sum + (answers[idx] || 0), 0);

  // === ОБЩИЙ БАЛЛ АЛЬТРУИЗМА ===
  const totalAltruismRaw = directScore + invertedScore;  // диапазон от -54 до +54
  const totalAltruism = totalAltruismRaw + 54;  // переводим в 0..108
  const maxAltruism = 108;
  const percentage = Math.round((totalAltruism / maxAltruism) * 100);

  // === ИНТЕРПРЕТАЦИЯ ===
  let level = "", description = "";
  if (percentage >= 83) {
    level = "Очень высокий уровень альтруизма";
    description = "Вы склонны к бескорыстной помощи, состраданию и самопожертвованию. Для вас важно благополучие других.";
  } else if (percentage >= 65) {
    level = "Высокий уровень альтруизма";
    description = "Вы часто помогаете другим, руководствуясь этическими нормами и чувством долга.";
  } else if (percentage >= 46) {
    level = "Средний уровень альтруизма";
    description = "Вы помогаете, но в разумных пределах, с учётом своих возможностей и интересов.";
  } else if (percentage >= 28) {
    level = "Низкий уровень альтруизма";
    description = "Вы склонны к рациональному подходу. Помощь оправдана только при наличии выгоды или обязанности.";
  } else {
    level = "Очень низкий уровень альтруизма";
    description = "Вы ориентированы на личные интересы. Помощь другим кажется вам бессмысленной или рискованной.";
  }

  return {
    valid: true,
    lieScore,
    directScore,
    invertedScore,
    totalAltruism,
    maxAltruism,
    percentage,
    level,
    description
  };
}

// === Финиш: вывод результата ===
async function finishTest() {
  const result = calculateResult();

  document.getElementById('test-screen').classList.add('hidden');
  const resultScreen = document.getElementById('result-screen');

  if (!result.valid) {
    document.getElementById('result-score').innerHTML = '?';
    document.getElementById('result-level').textContent = 'Результат недействителен';
    document.getElementById('result-description').innerHTML = `
      <p class="text-red-600">Шкала лжи: ${result.lieScore} (превышено 18 баллов)</p>
      <p class="mt-4">Тест не может быть интерпретирован — ответы не соответствуют честной самооценке.</p>
    `;
  } else {
    document.getElementById('result-score').innerHTML = 
      `${result.totalAltruism} <span class="text-2xl text-gray-500">из ${result.maxAltruism}</span>`;
    document.getElementById('result-level').textContent = result.level;
    document.getElementById('result-description').innerHTML = `
      <p>${result.description}</p>
      <h3 class="text-xl font-medium mt-6 mb-2">Дополнительно:</h3>
      <p><strong>Прямые баллы:</strong> ${result.directScore} из 54</p>
      <p><strong>Обратные баллы:</strong> ${result.invertedScore} из 54</p>
      <p><strong>Шкала лжи:</strong> ${result.lieScore} (норма ≤18)</p>
    `;
  }

  resultScreen.classList.remove('hidden');
  await saveToGoogleSheets(result);
}

// === Отправка в Google Sheets ===
async function saveToGoogleSheets(result) {
  const scriptURL = "https://script.google.com/macros/s/AKfycbw0jaAr2DBRKEQm3eyOcRfgqdw_DeSX0QD_VOfjCW_J6Gwrl-PJ-7xnIK8El-N-1WWb/exec";
  const formData = new FormData();
  
  formData.append("participant_id", participantId);
  formData.append("test_name", "Альтруизм");
  formData.append("gender", gender);
  formData.append("age", age);
  formData.append("education", education);
  
  if (result.valid) {
    formData.append("valid", "true");
    formData.append("lie_score", result.lieScore);
    formData.append("direct_score", result.directScore);
    formData.append("inverted_score", result.invertedScore);
    formData.append("total_score", result.totalAltruism);
    formData.append("percentage", result.percentage);
    formData.append("level", result.level);
  } else {
    formData.append("valid", "false");
    formData.append("lie_score", result.lieScore);
  }
  
  try {
    await fetch(scriptURL, { method: "POST", body: formData, mode: "no-cors" });
    console.log("✅ Результат 'Альтруизм' отправлен в Google Sheets");
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
    id: testSequence[currentIndex]?.id || "altruism",
    name: testSequence[currentIndex]?.title || "Альтруистические установки",
    totalScore: result.totalAltruism,
    percentage: result.percentage,
    level: result.level,
    lieScore: result.lieScore,
    valid: result.valid,
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
