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
  "Моё существование является значимым и осмысленным.",
  "Я верю, что где бы я ни находился и что бы ни делал, я всё равно никогда не отделен от других.",
  "У меня реальное ощущение родства со всеми живущими в этом мире.",
  "Чувство внутренней умиротворенности очень важно для меня.",
  "Я всегда нахожу время для отдыха и спокойствия, с помощью которых я могу освободить свой ум от ежедневных забот.",
  "Я считаю, что интуиция рождается в наиболее духовно совершенной части моей личности, поэтому никогда не игнорирую её.",
  "Я ощущаю себя частью Вселенной и несу ответственность за эту принадлежность к ней.",
  "Суть моей идентичности базируется на том, что объединяет меня со всеми людьми.",
  "Я осознаю свою связь со всеми живыми существами на земле.",
  "Я ощущаю своё проникновение во всё происходящее в мире."
];

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
  console.log("%cШкала металичностной самоинтерпретации загружена", "color: #4f46e5; font-weight: bold");
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
      <div onclick="selectAnswer(1)" class="answer-option">1 — Полностью не согласен</div>
      <div onclick="selectAnswer(2)" class="answer-option">2</div>
      <div onclick="selectAnswer(3)" class="answer-option">3</div>
      <div onclick="selectAnswer(4)" class="answer-option">4</div>
      <div onclick="selectAnswer(5)" class="answer-option">5</div>
      <div onclick="selectAnswer(6)" class="answer-option">6</div>
      <div onclick="selectAnswer(7)" class="answer-option">7 — Полностью согласен</div>
    </div>
  `;
  
  // Подсветка выбранного ответа
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

function highlightSelected(value) {
  document.querySelectorAll('.answer-option').forEach(el => {
    el.classList.remove('selected', 'border-indigo-600', 'bg-indigo-50', 'shadow-md');
    const match = el.getAttribute('onclick')?.match(/\d+/);
    if (match && parseInt(match[0]) === value) {
      el.classList.add('selected', 'border-indigo-600', 'bg-indigo-50', 'shadow-md');
    }
  });
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
  const maxScore = questions.length * 7;
  const percentage = Math.round((totalScore / maxScore) * 100);

  let level = "", description = "";

  if (percentage >= 80) {
    level = "Очень высокий уровень";
    description = "У Вас очень высокий уровень металичностной самоинтерпретации. Вы глубоко ощущаете свою связь с миром, обладаете сильным чувством смысла и единства со всем сущим.";
  } else if (percentage >= 65) {
    level = "Высокий уровень";
    description = "Вы обладаете высоким уровнем металичностной самоинтерпретации. Хорошо развито чувство связи с другими людьми и миром, присутствует осознанность своего места во Вселенной.";
  } else if (percentage >= 50) {
    level = "Средний уровень";
    description = "Средний уровень металичностной самоинтерпретации. Вы иногда ощущаете связь с чем-то большим, но это не всегда является доминирующей частью вашего мировосприятия.";
  } else {
    level = "Низкий уровень";
    description = "Низкий уровень металичностной самоинтерпретации. Возможно, стоит уделить больше внимания развитию чувства смысла, единства и духовной связи с миром.";
  }

  return { totalScore, maxScore, percentage, level, description };
}

async function finishTest() {
  const result = calculateResult();
  document.getElementById('test-screen').classList.add('hidden');

  document.getElementById('result-score').innerHTML = 
    `${result.totalScore} <span class="text-2xl text-gray-500">из ${result.maxScore} (${result.percentage}%)</span>`;
  document.getElementById('result-level').textContent = result.level;
  document.getElementById('result-description').innerHTML = `<p>${result.description}</p>`;

  document.getElementById('result-screen').classList.remove('hidden');
  await saveToGoogleSheets(result);
}

async function saveToGoogleSheets(result) {
  const scriptURL = "https://script.google.com/macros/s/AKfycbxaH8oWEE0mkKv89nnS-IMU4BkfVX9G0MGzcnnc_pUJImb3WO1e0XtdRwKJbUUc4KmuXw/exec";
  const formData = new FormData();
  
  formData.append("participant_id", participantId);
  formData.append("test_name", "Шкала металичностной самоинтерпретации");
  formData.append("gender", gender);
  formData.append("age", age);
  formData.append("education", education);
  formData.append("total_score", result.totalScore);
  formData.append("percentage", result.percentage);
  formData.append("level", result.level);

  try {
    await fetch(scriptURL, { method: "POST", body: formData, mode: "no-cors" });
    console.log("✅ Результат 'Металичностная самоинтерпретация' отправлен в Google Sheets");
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
    id: testSequence[currentIndex]?.id || "self-inter",
    name: testSequence[currentIndex]?.title || "Шкала металичностной самоинтерпретации",
    totalScore: result.totalScore,
    percentage: result.percentage,
    level: result.level,
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