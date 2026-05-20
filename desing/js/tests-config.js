const testSequence = [
  {
    id: "spiritual-orientation",
    title: "Духовная ориентация личности",
    file: "spirit-orient.html"
  },
  {
    id: "spiritual-personality",
    title: "Духовная личность",
    file: "spirit-person.html"
  },
  {
    id: "altruism",
    title: "Альтруистические установки",
    file: "altruism.html"
  },
   {
    id: "sjo",
    title: "Тест смысложизненных ориентаций",
    file: "sjo.html"
  },
  {
    id: "wisdom",
    title: "Методика диагностики мудрости",
    file: "wisdom.html"
  },
  {
    id: "reflex",
    title: "Дифференциальный тест рефлексивности",
    file: "reflex.html"
  },
   {
    id: "self-inter",
    title: "Шкала металичностной самоинтерпретации",
    file: "self-inter.html"
  },
  {
    id: "life-prod",
    title: "Продуктивная жизнедеятельность и самотрансценденция",
    file: "life-prod.html"
  },
  {
    id: "pfoo",
    title: "Пятифакторный опросник осознанности",
    file: "pfoo.html"
  },
  {
    id: "motiv",
    title: "Шкала мотивации одобрения (Марлоу-Краун)",
    file: "motiv.html"
  }
];

function getNextTest(currentId) {
  const index = testSequence.findIndex(test => test.id === currentId);
  return index < testSequence.length - 1 ? testSequence[index + 1] : null;
}

function goToNextTest(nextFile) {
  window.location.href = nextFile;
}

const SCRIPT_URL = "https://script.google.com/macros/s/     /exec"; 

async function sendToGoogleSheets(data, testName = "") {
  const formData = new FormData();
  
  formData.append("test_name", testName);
  formData.append("gender", data.gender || "");
  formData.append("gender_other", data.genderOther || "");
  formData.append("age", data.age || "");
  formData.append("education", data.education || "");
  formData.append("education_other", data.educationOther || "");
  formData.append("profession", data.profession || "");
  formData.append("profession_other", data.professionOther || "");
  formData.append("workplace", data.workplace || "");
  formData.append("workplace_other", data.workplaceOther || "");
  formData.append("total_experience", data.totalExperience || "");
  formData.append("special_experience", data.specialExperience || "");

  try {
    await fetch(SCRIPT_URL, {
      method: "POST",
      body: formData,
      mode: "no-cors"
    });
    console.log(`✅ ${testName} — данные отправлены`);
  } catch (e) {
    console.error("Ошибка отправки:", e);
  }
}