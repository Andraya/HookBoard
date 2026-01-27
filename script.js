// Dark Mode Toggle Script
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const icon = themeToggle.querySelector('.theme-icon');

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';
if (currentTheme === 'dark') {
  body.classList.add('dark-mode');
  icon.className = 'fas fa-sun theme-icon'; // Sun icon for light mode
} else {
  icon.className = 'fas fa-moon theme-icon'; // Moon icon for dark mode
}

// Toggle theme on button click
themeToggle.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
  const isDark = body.classList.contains('dark-mode');
  icon.className = isDark ? 'fas fa-sun theme-icon' : 'fas fa-moon theme-icon';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});