import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js';
import { getFirestore, collection, addDoc, setDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import firebaseConfig from "./config.js";

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

document.getElementById("button").addEventListener("click", async function (e) {
  e.preventDefault();

  const inputText = document.querySelector('input[type="text"]').value;

  if (!inputText.trim()) {
    return;
  }

  const button = e.target;
  button.style.transform = "scale(0.95)";
  setTimeout(function () {
    button.style.transform = "scale(1)";
  }, 100);

  const goatSubmissionsDocRef = doc(db, 'data', 'goatSubmissions');

  try {
    const docSnapshot = await getDoc(goatSubmissionsDocRef);
    let currentData = docSnapshot.exists() ? docSnapshot.data() : {};

    let nextField = 1;
    while (currentData[`${nextField}`]) {
      nextField++;
    }
    const fieldName = `${nextField}`;

    currentData[fieldName] = inputText;

    await setDoc(goatSubmissionsDocRef, currentData);

    showToast("Thank you!");
  } catch (error) {
    console.error("Error adding document: ", error);
  }
});

document.getElementById("button").addEventListener("mousemove", function (e) {
  const rect = e.target.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const buttonWidth = rect.width;
  const buttonHeight = rect.height;

  const horizontalPercentage = x / buttonWidth;
  const verticalPercentage = y / buttonHeight;

  const red = Math.round(horizontalPercentage * 255);
  const green = Math.round(verticalPercentage * 255);
  const blue = Math.round(
    (horizontalPercentage + verticalPercentage) * 128
  );
  e.target.style.backgroundColor = `rgb(${red},${green},${blue})`;

  e.target.style.borderTopRightRadius = "10px";
  e.target.style.borderBottomRightRadius = "10px";

  const luminance = (0.299 * red + 0.587 * green + 0.114 * blue) / 255;

  if (luminance > 0.5) {
    e.target.style.color = "black";
  } else {
    e.target.style.color = "white";
  }
});

function showToast(message, duration = 3000) {
  const toastContainer = document.getElementById("toast-container");

  const toast = document.createElement("div");
  toast.classList.add("toast");
  toast.textContent = message;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, duration);
  }, 100);
}
