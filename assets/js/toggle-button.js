function toggleTheme() {
  const body = document.body;
  const icon = document.getElementById("themeIcon");

  body.classList.toggle("dark");

  if (body.classList.contains("dark")) {
    icon.textContent = "☀️";
    localStorage.setItem("theme", "dark");
  } else {
    icon.textContent = "🌙";
    localStorage.setItem("theme", "light");
  }
}


document.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem("theme");
  const icon = document.getElementById("themeIcon");
  if (saved === "dark") {
    document.body.classList.add("dark");
    icon.textContent = "☀️";
  } else {
    icon.textContent = "🌙";
  }
});