// Функция для загрузки компонентов
async function loadComponent(componentName, targetElement) {
  try {
    // Исправленная логика определения пути
    const path = window.location.pathname;
    let basePath;
    
    // 1. Если это главная страница (в корне)
    if (path === '/' || 
        path.endsWith('/index.html') || 
        path === '/Academy/' || 
        path === '/Academy/index.html' ||
        path.endsWith('/')) {
      basePath = './'; // components/ в той же папке
      console.log('Main page detected, using ./');
    }
    // 2. Если страница в подпапке (например, /pages/about.html)
    else if (path.includes('/pages/')) {
      basePath = '../'; // Поднимаемся на уровень выше
      console.log('Subpage detected, using ../');
    }
    // 3. Для любых других случаев (запасной вариант)
    else {
      basePath = './'; // По умолчанию в той же папке
      console.log('Other page, using ./');
    }
    
    console.log(`Loading ${componentName} from: ${basePath}components/${componentName}.html`);
    
    const response = await fetch(`${basePath}components/${componentName}.html`);
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

document.addEventListener('DOMContentLoaded', function() {
    const footerToggles = document.querySelectorAll('.footer-toggle');
    
    footerToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const section = this.closest('.footer-section');
            const menu = section.querySelector('.footer-menu');
            const icon = this.querySelector('.toggle-icon');
            
            // Закрываем другие открытые меню (опционально)
            if (!menu.classList.contains('active')) {
                document.querySelectorAll('.footer-menu.active').forEach(activeMenu => {
                    if (activeMenu !== menu) {
                        activeMenu.classList.remove('active');
                        activeMenu.previousElementSibling.querySelector('.footer-toggle').classList.remove('active');
                    }
                });
            }
            
            // Переключаем текущее меню
            menu.classList.toggle('active');
            this.classList.toggle('active');
            
            // Меняем иконку
            if (menu.classList.contains('active')) {
                icon.textContent = '−';
            } else {
                icon.textContent = '+';
            }
        });
    });
});