// Dark mode toggle
document.getElementById("dark-mode-toggle").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  const toggleBtn = document.getElementById("dark-mode-toggle");
  const isDarkModeOn = document.body.classList.contains("dark-mode");

  toggleBtn.innerText = isDarkModeOn ? "☀️" : "🌓";
});

// Elevator.js
const elevator = new Elevator({
  mainAudio:
    "https://raw.githubusercontent.com/tholman/elevator.js/master/demo/music/elevator.mp3",
  endAudio:
    "https://raw.githubusercontent.com/tholman/elevator.js/master/demo/music/ding.mp3",
  duration: 5000,
});

const footer = document.createElement("footer");
footer.className = "mt-8 mb-4";
const footerContent = document.createElement("div");
footerContent.className = "flex items-center justify-between";
footer.appendChild(footerContent);

const copyright = document.createElement("div");
copyright.className = "hidden md:flex";
copyright.innerHTML =
  "&nbsp;&nbsp;&copy; " + new Date().getFullYear() + " Parquet Analytica";
footerContent.appendChild(copyright);

const madeWith = document.createElement("div");
madeWith.className = "hidden md:flex";
madeWith.innerHTML = "Imagined by Me - Realized with AI 🧠";
footerContent.appendChild(madeWith);

const elevatorBtnDiv = document.createElement("div");
elevatorBtnDiv.innerHTML =
  'You need an elevator ride?&nbsp;&nbsp;<i class="fas fa-elevator"></i>&nbsp;&nbsp;';
elevatorBtnDiv.className =
  "text-center flex justify-center items-center cursor-pointer mt-4";
elevatorBtnDiv.onclick = () => {
  elevator.elevate();
};

footerContent.appendChild(elevatorBtnDiv);
document.body.appendChild(footer);

// Scroll down button
const scrollDownBtn = document.getElementById("scroll-down-btn");
const headerContainer = document.getElementById("header-container");

const toggleScrollButtonVisibility = () => {
  if (window.pageYOffset === 0) {
    scrollDownBtn.style.display = "flex";
  } else {
    scrollDownBtn.style.display = "none";
  }
};

scrollDownBtn.addEventListener("click", () => {
  const yOffset =
    headerContainer.getBoundingClientRect().bottom + window.pageYOffset;
  window.scrollTo({ top: yOffset, behavior: "smooth" });
});

window.addEventListener("scroll", toggleScrollButtonVisibility);
toggleScrollButtonVisibility();
