// === ДАННЫе ИЗ АНКЕТЫ ===
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

// === ВОПРОСЫ (биполярные) ===
const questions = [
  ["Обычно мне очень скучно.", "Обычно я полон энергии."],
  ["Жизнь кажется мне всегда волнующей и захватывающей.", "Жизнь кажется мне совершенно спокойной и рутинной."],
  ["В жизни я не имею определенных целей и намерений.", "В жизни я имею очень ясные цели и намерения."],
  ["Моя жизнь представляется мне крайне бессмысленной и бесцельной.", "Моя жизнь представляется мне вполне осмысленной и целеустремленной."],
  ["Каждый день кажется мне всегда новым и непохожим на другие.", "Каждый день кажется мне совершенно похожим на все другие."],
  ["Когда я уйду на пенсию, я займусь интересными вещами, которыми всегда мечтал заняться.", "Когда я уйду на пенсию, я постараюсь не обременять себя никакими заботами."],
  ["Моя жизнь сложилась именно так, как я мечтал.", "Моя жизнь сложилась совсем не так, как я мечтал."],
  ["Я не добился успехов в осуществлении своих жизненных планов.", "Я осуществил многое из того, что было мною запланировано в жизни."],
  ["Моя жизнь пуста и неинтересна.", "Моя жизнь наполнена интересными делами."],
  ["Если бы мне пришлось подводить сегодня итог моей жизни, то я бы сказал, что она была вполне осмысленной.", "Если бы мне пришлось сегодня подводить итог моей жизни, то я бы сказал, что она не имела смысла."],
  ["Если бы я мог выбирать, то я бы построил свою жизнь совершенно иначе.", "Если бы я мог выбирать, то я бы прожил жизнь еще раз так же, как живу сейчас."],
  ["Когда я смотрю на окружающий меня мир, он часто приводит меня в растерянность и беспокойство.", "Когда я смотрю на окружающий меня мир, он совсем не вызывает у меня беспокойства и растерянности."],
  ["Я человек очень обязательный.", "Я человек совсем не обязательный."],
  ["Я полагаю, что человек имеет возможность осуществить свой жизненный выбор по своему желанию.", "Я полагаю, что человек лишен возможности выбирать из-за влияния природных способностей и обстоятельств."],
  ["Я определенно могу назвать себя целеустремленным человеком.", "Я не могу назвать себя целеустремленным человеком."],
  ["В жизни я еще не нашел своего призвания и ясных целей.", "В жизни я нашел свое призвание и цели."],
  ["Мои жизненные взгляды еще не определились.", "Мои жизненные взгляды вполне определились."],
  ["Я считаю, что мне удалось найти призвание и интересные цели в жизни.", "Я едва ли способен найти призвание и интересные цели в жизни."],
  ["Моя жизнь в моих руках, и я сам управляю ею.", "Моя жизнь не подвластна мне и она управляется внешними событиями."],
  ["Мои повседневные дела приносят мне удовольствие и удовлетворение.", "Мои повседневные дела приносят мне сплошные неприятности и переживания."]
];

// === ШКАЛЫ (индексы с 0) ===
const scales = {
  "Цели в жизни": [2, 3, 9, 15, 16, 17],
  "Процесс жизни": [0, 1, 3, 4, 6, 8],
  "Результативность жизни": [7, 8, 9, 11, 19],
  "Локус контроля – Я": [0, 14, 15, 18],
  "Локус контроля – жизнь": [6, 9, 10, 13, 17, 18]
};

// Пункты, требующие инверсии
const reverseItems = [1, 4, 5, 6, 9, 12, 13, 14, 17, 18, 19];

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

document.addEventListener('DOMContentLoaded', () => {
  console.log("%cТест СЖО загружен (новая версия)", "color: #4f46e5; font-weight: bold");
  loadQuestion();
});

function loadQuestion() {
  const q = questions[currentQuestion];
  document.getElementById('question-text').innerHTML = `${q[0]} &nbsp;&mdash;&nbsp; ${q[1]}`;
  document.getElementById('current-question').textContent = currentQuestion + 1;
  
  const totalEl = document.getElementById('total-questions');
  if (totalEl) totalEl.textContent = questions.length;

  updateProgress();
  renderScale();
}

function renderScale() {
  const container = document.getElementById('options');
  const values = [-3, -2, -1, 0, 1, 2, 3];
  
  let html = `<div class="flex items-center gap-4 text-xs font-medium text-gray-500">`;
  values.forEach(val => {
    const label = val === 0 ? "Нейтрально" : "";
    html += `
      <div class="flex flex-col items-center gap-2 cursor-pointer group" onclick="selectAnswer(${val})">
        <div id="scale-${val}" class="w-8 h-8 border-2 border-gray-300 rounded-full flex items-center justify-center group-hover:border-indigo-400 transition">
          ${val}
        </div>
        ${label ? `<div class="text-gray-600 text-xs">${label}</div>` : ""}
      </div>`;
  });
  html += `</div>`;
  container.innerHTML = html;

  if (answers[currentQuestion] !== undefined) {
    highlightSelected(answers[currentQuestion]);
  }
}

function selectAnswer(value) {
  answers[currentQuestion] = value;
  highlightSelected(value);
  
  setTimeout(() => {
    if (currentQuestion < questions.length - 1) {
      currentQuestion++;
      loadQuestion();
    } else {
      finishTest();
    }
  }, 380);
}

function highlightSelected(value) {
  document.querySelectorAll('[id^="scale-"]').forEach(el => {
    el.className = 'w-8 h-8 border-2 border-gray-300 rounded-full flex items-center justify-center';
  });
  const selected = document.getElementById(`scale-${value}`);
  if (selected) {
    selected.classList.remove('border-gray-300');
    selected.classList.add('border-indigo-600', 'bg-indigo-50');
  }
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

function getNormalizedAnswers() {
  return answers.map((val, idx) => {
    if (reverseItems.includes(idx)) {
      return -val;
    }
    return val;
  });
}

// === РАСЧЁТ ===
function calculateResult() {
  const normalized = getNormalizedAnswers();
  const scaleResults = {};

   // Нормативы для шкал (M и о)
  const norms = {
    male: {
      "Цели в жизни": { mean: 32.90, sd: 5.92 },
      "Процесс жизни": { mean: 31.09, sd: 4.44 },
      "Результативность жизни": { mean: 25.46, sd: 4.30 },
      "Локус контроля – Я": { mean: 21.13, sd: 3.85 },
      "Локус контроля – жизнь": { mean: 30.14, sd: 5.80 }
    },
    female: {
      "Цели в жизни": { mean: 29.38, sd: 6.24 },
      "Процесс жизни": { mean: 28.80, sd: 6.14 },
      "Результативность жизни": { mean: 23.30, sd: 4.95 },
      "Локус контроля – Я": { mean: 18.58, sd: 4.30 },
      "Локус контроля – жизнь": { mean: 28.70, sd: 6.10 }
    }
  };

  function getLevel(score, mean, sd) {
    if (score >= mean + 1.5 * sd) return "Очень высокий";
    if (score >= mean + 0.5 * sd) return "Высокий";
    if (score >= mean - 0.5 * sd) return "Средний";
    if (score >= mean - 1.5 * sd) return "Низкий";
    return "Очень низкий";
  }
  
  const normalData = (gender === "female") ? norms.female : norms.male;
  
  Object.keys(scales).forEach(name => {
    const indices = scales[name];
    let rawScore = 0;
    indices.forEach(idx => {
      rawScore += normalized[idx] || 0;
    });
    // Перевод из -3..+3 в 1..7
    const positiveScore = rawScore + (indices.length * 4);  
    const maxScoreForScale = indices.length * 7;            
    const percent = Math.round((positiveScore / maxScoreForScale) * 100);
    scaleResults[name] = { score: positiveScore, max: maxScoreForScale, percent };
  });

    const norm = normalData[name];
    const level = getLevel(positiveScore, norm.mean, norm.sd);
    
    scaleResults[name] = { 
      score: positiveScore, 
      max: maxScoreForScale, 
      percent,
      level 
    };
  });

  // Общий результат
  let totalRaw = normalized.reduce((sum, val) => sum + (val || 0), 0);
  const totalPositive = totalRaw + 80;  
  const totalMax = 140;
  const totalPercent = Math.round((totalPositive / totalMax) * 100);

    const totalNorms = {
    male: { mean: 103.10, sd: 15.03 },
    female: { mean: 95.76, sd: 16.54 }
  };

   const totalNorm = (gender === "female") ? totalNorms.female : totalNorms.male;
  
  function getTotalLevel(score, mean, sd) {
    if (score >= mean + 1.5 * sd) return "Очень высокий уровень";
    if (score >= mean + 0.5 * sd) return "Высокий уровень";
    if (score >= mean - 0.5 * sd) return "Средний уровень";
    if (score >= mean - 1.5 * sd) return "Низкий уровень";
    return "Очень низкий уровень";
  }
  
  const level = getTotalLevel(totalScore, totalNorm.mean, totalNorm.sd);
  let level, description;
  if (totalPercent >= 80) {
    level = "Очень высокий уровень";
    description = "Вы обладаете ясными жизненными целями, ощущаете ценность жизни и активно развиваетесь.";
  } else if (totalPercent >= 65) {
    level = "Высокий уровень";
    description = "Вы склонны к осмысленному образу жизни.";
  } else if (totalPercent >= 50) {
    level = "Средний уровень";
    description = "Смысл жизни присутствует, но требует углубления.";
  } else if (totalPercent >= 35) {
    level = "Ниже среднего";
    description = "Жизненные цели слабо выражены.";
  } else {
    level = "Низкий уровень";
    description = "Возможно, вы переживаете экзистенциальный вакуум.";
  }

  return { scaleResults, totalScore: totalPositive, totalMax, totalPercent, level, description };
}

// === ФИНИШ ТЕСТА ===
async function finishTest() {
  const result = calculateResult();
  document.getElementById('test-screen').classList.add('hidden');

 let scaleHTML = "<h3 class='text-xl font-medium mt-8 mb-4'>По шкалам:</h3><ul class='space-y-4'>";
Object.keys(result.scaleResults).forEach(name => {
  const s = result.scaleResults[name];
  const barColor = s.percent > 65 ? 'bg-green-500' : s.percent > 45 ? 'bg-yellow-500' : 'bg-red-500';
  scaleHTML += `<li>
    <strong>${name}:</strong> ${s.score} из ${s.max} (${s.percent}%) 
    <span class="text-sm text-gray-500">— ${s.level}</span>
    <div class="w-full bg-gray-200 h-2 rounded mt-1">
      <div class="h-2 rounded ${barColor}" style="width: ${s.percent}%"></div>
    </div>
  </li>`;
});
scaleHTML += "</ul>";

  document.getElementById('result-score').innerHTML = `${result.totalScore} <span class="text-2xl text-gray-500">из ${result.totalMax}</span>`;
  document.getElementById('result-level').textContent = result.level;
  document.getElementById('result-description').innerHTML = `<p>${result.description}</p>${scaleHTML}`;

  document.getElementById('result-screen').classList.remove('hidden');
  await saveToGoogleSheets(result);
}

// === ОТПРАВКА В GOOGLE SHEETS ===
async function saveToGoogleSheets(result) {
  const scriptURL = "https://script.google.com/macros/s/AKfycbxaH8oWEE0mkKv89nnS-IMU4BkfVX9G0MGzcnnc_pUJImb3WO1e0XtdRwKJbUUc4KmuXw/exec";
  const formData = new FormData();
  
  formData.append("participant_id", participantId);
  formData.append("test_name", "СЖО (Смысложизненные ориентации)");
  formData.append("gender", gender);
  formData.append("age", age);
  formData.append("education", education);
  formData.append("total_score", result.totalScore);
  formData.append("percentage", result.totalPercent);
  formData.append("level", result.level);

  Object.keys(result.scaleResults).forEach(key => {
    const s = result.scaleResults[key];
    formData.append(`scale_${key.toLowerCase().replace(/\s+/g, '_').replace(/–/g, '')}`, s.score);
  });

  try {
    await fetch(scriptURL, { method: "POST", body: formData, mode: "no-cors" });
    console.log("✅ Результат СЖО отправлен в Google Sheets");
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
    id: testSequence[currentIndex]?.id || "sjo",
    name: testSequence[currentIndex]?.title || "СЖО (Смысложизненные ориентации)",
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
