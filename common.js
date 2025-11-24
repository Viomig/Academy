// Функция для загрузки компонентов
async function loadComponent(componentName, targetElement) {
  try {
    const response = await fetch(`components/${componentName}.html`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const html = await response.text();
    
    // Вставляем HTML в целевой элемент
    const target = document.querySelector(targetElement);
    if (target) {
      target.innerHTML = html;
      
      // Инициализируем компоненты после загрузки
      initializeComponents();
    }
  } catch (error) {
    console.error(`Error loading ${componentName}:`, error);
  }
}

function initializeComponents() {
  console.log('Initializing components...');
  
  // Инициализируем табы, если они есть на странице
  const tabTriggers = document.querySelectorAll('#academy-tab .nav-link');
  if (tabTriggers.length > 0) {
    console.log('Found tabs, initializing...');
    
    // Вызываем функцию из tabs.js
    if (typeof initTabs === 'function') {
      initTabs();
    } else {
      console.warn('initTabs function not found');
    }
  }
}
  
  // Инициализация бургер-меню (CoreUI/Bootstrap сделает это автоматически через data-атрибуты)

// Загружаем компоненты при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
  // Загружаем компоненты в существующие места для вставки
  loadComponent('header', '#header-placeholder');
  loadComponent('footer', '#footer-placeholder');
});