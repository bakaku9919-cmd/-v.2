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
let currentBlock = 0;
let answersA = Array(7).fill(null);
let answersB = Array(7).fill(null);
let openAnswers = Array(7).fill("");

const blocks = [
  {
    A: ["Я достиг/ла высоких результатов в учебе", "Я не достиг/ла высоких результатов в учебе"],
    B: ["Я достиг/ла или хотел/а бы достигнуть высоких результатов в учебе, потому что мне нравится быть первым/ой и превосходить других во всем или потому что полученные глубокие знания дают возможность устроиться на хорошую работу и зарабатывать много денег", 
        "Я достиг/ла или хотела бы достигнуть высоких результатов в учебе, потому что мое главное желание – приобрести глубокие знания и использовать их для блага общества"]
  },
  {
    A: ["В своей профессиональной деятельности я не склонен/на стремиться к высоким профессиональным достижениям", "В своей профессиональной деятельности я стремлюсь к высоким достижениям"],
    B: ["Я достигну успехов в будущей профессиональной деятельности, так как буду стараться выполнять работу как можно лучше, чтобы ее результаты приносили пользу людям", 
        "Я достигну успехов в профессиональной деятельности, потому что для меня главное в жизни — это сделать хорошую карьеру и получать высокую заработную плату"]
  },
  {
    A: ["Я принимаю активное участие в общественной деятельности и достиг/ла в этом успехов", "Я не принимаю активное участие в общественной деятельности"],
    B: ["Я достиг/ла или хотел/а бы достичь успехов в общественной работе, потому что эти успехи позволят мне быть лидером, дадут власть над людями, приведут меня к известности", 
        "Я достиг/ла или хотел/а бы достичь успехов в общественной работе, потому что мне нравится, когда моя деятельность приносит пользу людям и ее высокие результаты делают людей счастливыми"]
  },
  {
    A: ["Я мало расположен к творчеству", "Я творческий человек и люблю создавать творческие продукты"],
    B: ["Я создаю творческие продукты или, если бы захотел/а их создавать, то потому, что меня привлекает сам процесс творчества и мне доставляет удовольствие то, что мои творческие продукты будут радовать людей и приносить им пользу", 
        "Я создаю или создавал/а бы творческие продукты, потому что хочу прославиться и получать большие деньги"]
  },
  {
    A: ["Я забочусь о своей семье", "Я слишком занят/а своими делами, и у меня не остается времени, чтобы помогать семье"],
    B: ["Я занимаюсь семейными делами и помогаю семье или хотел/а бы помогать для того, чтобы увеличить материальное благосостояние и престиж моей семьи. Если моя семья будет богата и знаменита, то это придаст мне большую значимость в обществе", 
        "Я занимаюсь семейными делами и помогаю семье или хотел/а бы помогать, потому что люблю ее; я хочу, чтобы все ее члены были счастливы и с ними все было хорошо"]
  },
  {
    A: ["Я не уделяю время самосовершенствованию", "Я уделяю время самосовершенствованию"],
    B: ["Я занимаюсь или хотел/а бы заниматься самосовершенствованием, потому что желаю избавиться от слабостей, которые мешают мне устанавливать теплые дружеские отношения, быть полезным/ой людям", 
        "Я занимаюсь или хотел/а бы заниматься самосовершенствованием, потому что желаю избавиться от слабостей, которые мешают мне быть главным/ой и командовать в группе, эти слабости препятствуют моей успешной карьере"]
  },
  {
    A: ["В свободное время я люблю делать что-то интересное и полезное для себя и других", "Я провожу свободное время бесцельно и непродуктивно"],
    B: ["То, что я узнал/а или создал/а на досуге, я использую (или использовал/а бы), чтобы показать другим, какой я необыкновенный, особенный человек", 
        "Я делюсь (или если бы захотел/а проводить досуг продуктивно, то делился/ась бы) с другими тем, что я узнал/а или создал/а на досуге; мне радостно, когда это оказывается полезным и интересным для других"]
  }
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

// === ЗАГРУЗКА ПЕРВОГО БЛОКА ===
document.addEventListener('DOMContentLoaded', () => {
  console.log("%cМетодика Ожигановой загружена (новая версия)", "color: #4f46e5; font-weight: bold");
const instructionModal = document.getElementById('instructionModal');
  if (instructionModal) {
    instructionModal.classList.remove('hidden');
  }
});

function convertAScore(value, blockIndex) {
  const base = value + 4;
  const shouldInvert = [0, 2, 4, 6].includes(blockIndex);
  return shouldInvert ? (8 - base) : base;
}

function convertBScore(value, blockIndex) {
  const base = value + 4;
  const shouldInvert = [1, 3, 5].includes(blockIndex);
  return shouldInvert ? (8 - base) : base;
}

function loadBlock() {
  const block = blocks[currentBlock];
  const container = document.getElementById('block-container');
  const aVal = answersA[currentBlock];
  const bVal = answersB[currentBlock];

  const blockNames = [
    "в учебе",
    "в профессиональной деятельности",
    "в общественной деятельности",
    "в творчестве",
    "в семье",
    "в самосовершенствовании",
    "в свободное время"
  ];

  container.innerHTML = `
    <div class="space-y-10">
      <div class="text-center">
        <h3 class="text-2xl font-semibold text-gray-800">Блок ${currentBlock + 1}</h3>
        <p class="text-gray-600">Оцените свою жизнедеятельность ${blockNames[currentBlock]}</p>
      </div>

      <!-- Задание А -->
      <div class="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
        <h4 class="font-semibold text-lg text-indigo-700 mb-1">А.</h4>
        ${renderScale('A', currentBlock, aVal)}
      </div>

      <!-- Задание Б -->
      <div class="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
        <h4 class="font-semibold text-lg text-indigo-700 mb-1">Б.</h4>
        ${renderScale('B', currentBlock, bVal)}
      </div>

      <!-- Задание В -->
      <div class="p-6 bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-2xl">
        <h4 class="font-semibold text-lg text-indigo-700 mb-3">В.</h4>
        <p class="text-gray-700 text-sm mb-4">Приведите примеры ваших реальных достижений в этой области:</p>
        <textarea 
          id="v-${currentBlock}" 
          rows="3" 
          class="w-full p-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          placeholder="Например: написал(а) исследовательскую работу, организовал(а) мероприятие..."
          oninput="saveOpenAnswer(${currentBlock})">${openAnswers[currentBlock] || ''}</textarea>
        <p class="text-xs text-gray-500 mt-2">Это не оценивается, но важно для анализа</p>
      </div>
    </div>
  `;

  document.getElementById('current-block').textContent = currentBlock + 1;
  updateProgress();
}

function renderScale(type, blockIndex, selectedValue) {
  const values = [-3, -2, -1, 0, 1, 2, 3];
  const block = blocks[blockIndex];
  const isA = type === 'A';
  const statements = isA ? block.A : block.B;

  return `
    <div class="space-y-6">
      <h4 class="font-semibold text-lg text-gray-800">${isA ? "Что вы делаете?" : "Почему вы это делаете?"}</h4>

      <!-- Левое утверждение -->
      <div class="flex items-start gap-3">
        <div class="min-w-16 text-center font-semibold text-red-600">–3</div>
        <div class="flex-1 p-4 bg-gray-50 border border-gray-200 rounded-xl">
          <span class="text-gray-800 leading-relaxed">${statements[0]}</span>
        </div>
      </div>

      <!-- Правое утверждение -->
      <div class="flex items-start gap-3 justify-end">
        <div class="flex-1 p-4 bg-gray-50 border border-gray-200 rounded-xl text-right">
          <span class="text-gray-800 leading-relaxed">${statements[1]}</span>
        </div>
        <div class="min-w-16 text-center font-semibold text-green-600">+3</div>
      </div>

      <!-- Шкала -->
      <div class="flex justify-center items-center gap-2 mt-4">
        ${values.map(val => `
          <button
            type="button"
            onclick="selectValue('${type.toLowerCase()}', ${val})"
            class="w-12 h-12 rounded-xl font-bold transition-all duration-200 shadow-sm
              ${val === 0 ? 'bg-white text-gray-700 border border-gray-300' : val < 0 ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}
              ${selectedValue === val ? 'ring-4 ring-offset-2 ring-indigo-500 bg-indigo-100 text-indigo-900 scale-105 shadow-inner font-extrabold' : 'hover:shadow hover:scale-105'}"
            style="${selectedValue === val ? 'transform: scale(1.05); font-weight: 900;' : ''}">
            ${val}
          </button>
        `).join('')}
      </div>
      <p class="text-center text-gray-500 text-xs">Выберите одно значение</p>
    </div>
  `;
}

function selectValue(name, value) {
  if (name === 'a') {
    answersA[currentBlock] = value;
  } else {
    answersB[currentBlock] = value;
  }
  loadBlock();
}

function updateProgress() {
  const progress = ((currentBlock + 1) / blocks.length) * 100;
  const progressBar = document.getElementById('progress-bar');
  const progressText = document.getElementById('progress-text');
  if (progressBar) progressBar.style.width = `${progress}%`;
  if (progressText) progressText.textContent = `${Math.round(progress)}%`;
}

function saveOpenAnswer(index) {
  const el = document.getElementById(`v-${index}`);
  if (el) {
    openAnswers[index] = el.value.trim();
  }
}

function nextBlock() {
  const textarea = document.getElementById(`v-${currentBlock}`);
  if (textarea) {
    openAnswers[currentBlock] = textarea.value.trim();
  }

  if (answersA[currentBlock] === null || answersB[currentBlock] === null) {
    alert("Пожалуйста, выберите ответы на оба вопроса (А и Б)");
    return;
  }

  if (currentBlock < 6) {
    currentBlock++;
    loadBlock();
  } else {
    finishTest();
  }
}

function prevBlock() {
  if (currentBlock > 0) {
    currentBlock--;
    loadBlock();
  }
}

function calculateResult() {
  let prodScore = 0;
  let transcScore = 0;

  for (let i = 0; i < 7; i++) {
    const aVal = answersA[i] !== null ? answersA[i] : 0;
    const bVal = answersB[i] !== null ? answersB[i] : 0;
    prodScore += convertAScore(aVal, i);
    transcScore += convertBScore(bVal, i);
  }

  const maxScore = 49;
  const percentProd = Math.round((prodScore / maxScore) * 100);
  const percentTrans = Math.round((transcScore / maxScore) * 100);
  const totalPercent = Math.round((percentProd + percentTrans) / 2);

  let level, description;
  if (totalPercent >= 80) {
    level = "Высокий уровень";
    description = "Вы демонстрируете высокую продуктивность и просоциальные мотивы. Ваша жизнедеятельность направлена на личностный рост и благо других.";
  } else if (totalPercent >= 60) {
    level = "Средний уровень";
    description = "Вы склонны к продуктивной деятельности, но есть пространство для усиления духовно-нравственных мотивов.";
  } else {
    level = "Низкий уровень";
    description = "Преобладают внутренние или внешние мотивы, не связанные с самотрансценденцией. Возможна потребность в рефлексии.";
  }

  return {
    prodScore, transcScore, percentProd, percentTrans, totalPercent, level, description,
    v1: openAnswers[0], v2: openAnswers[1], v3: openAnswers[2],
    v4: openAnswers[3], v5: openAnswers[4], v6: openAnswers[5], v7: openAnswers[6]
  };
}

async function finishTest() {
  const result = calculateResult();
  document.getElementById('test-screen').classList.add('hidden');

  document.getElementById('result-description').innerHTML = `
    <p>${result.description}</p>
    <h3 class='text-xl font-medium mt-8 mb-4'>Детали:</h3>
    <ul class='space-y-2 text-left'>
      <li><strong>Продуктивность жизнедеятельности:</strong> ${result.prodScore} (${result.percentProd}%)</li>
      <li><strong>Самотрансценденция:</strong> ${result.transcScore} (${result.percentTrans}%)</li>
    </ul>
  `;

  document.getElementById('result-score').textContent = `${result.totalPercent}%`;
  document.getElementById('result-level').textContent = result.level;

  document.getElementById('result-screen').classList.remove('hidden');
  await saveToGoogleSheets(result);
}

async function saveToGoogleSheets(result) {
  const scriptURL = "https://script.google.com/macros/s/AKfycbxaH8oWEE0mkKv89nnS-IMU4BkfVX9G0MGzcnnc_pUJImb3WO1e0XtdRwKJbUUc4KmuXw/exec";
  const formData = new FormData();
  
  formData.append("participant_id", participantId);
  formData.append("test_name", "Продуктивная жизнедеятельность и самотрансценденция");
  formData.append("gender", gender);
  formData.append("age", age);
  formData.append("education", education);
  formData.append("productive", result.prodScore);
  formData.append("transcendence", result.transcScore);
  formData.append("total_percent", result.totalPercent);
  formData.append("level", result.level);
  
  for (let i = 1; i <= 7; i++) {
    if (result[`v${i}`]) {
      formData.append(`open_answer_${i}`, result[`v${i}`]);
    }
  }

  try {
    await fetch(scriptURL, { method: "POST", body: formData, mode: "no-cors" });
    console.log("✅ Результат 'Продуктивная жизнедеятельность' отправлен в Google Sheets");
  } catch (e) {
    console.error("❌ Ошибка отправки:", e);
  }
}

function restartTest() {
  currentBlock = 0;
  answersA = Array(7).fill(null);
  answersB = Array(7).fill(null);
  openAnswers = Array(7).fill("");
  loadBlock();
  document.getElementById('test-screen').classList.remove('hidden');
  document.getElementById('result-screen').classList.add('hidden');
}

// === ПЕРЕХОД К СЛЕДУЮЩЕМУ ТЕСТУ ===
function goToNextTest() {
  const result = calculateResult();
  const testResults = JSON.parse(localStorage.getItem('testResults') || '[]');
  const currentIndex = parseInt(localStorage.getItem('currentTestIndex') || '0');
  
  testResults[currentIndex] = {
    id: testSequence[currentIndex]?.id || "life-prod",
    name: testSequence[currentIndex]?.title || "Продуктивная жизнедеятельность и самотрансценденция",
    productive: result.prodScore,
    transcendence: result.transcScore,
    totalPercent: result.totalPercent,
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
  function closeInstructionModal() {
  const modal = document.getElementById('instructionModal');
  if (modal) {
    modal.classList.add('hidden');
  }
  // Запускаем загрузку первого блока теста
  loadBlock();
}
}
