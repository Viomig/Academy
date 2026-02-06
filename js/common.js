// Функция для загрузки компонентов
async function loadComponent(componentName, targetElement) {
  try {
    // ВАША ОРИГИНАЛЬНАЯ ЛОГИКА (которая работала на всех страницах)
    const hasSubfolder = window.location.pathname.split('/').filter(Boolean).length > 1;
    let basePath = hasSubfolder ? '../' : './';
    
    // МИНИМАЛЬНОЕ ИСПРАВЛЕНИЕ ТОЛЬКО ДЛЯ ГЛАВНОЙ СТРАНИЦЫ:
    const path = window.location.pathname;
    
    // Если путь похож на главную страницу (корень или index.html)
    const isMainPage = path === '/' || 
                      path === '/index.html' || 
                      path.endsWith('/index.html') ||
                      path === '/Academy/' ||
                      path === '/Academy' ||
                      path === '/Academy/index.html' ||
                      (path.split('/').filter(Boolean).length === 1 && 
                       !path.includes('.html')); // Только одно слово в пути
    
    if (isMainPage) {
      // Для главной страницы ВСЕГДА используем ./
      basePath = './';
      console.log('Main page detected, forcing basePath to ./');
    }
    
    console.log(`Loading ${componentName}, path: ${path}, basePath: ${basePath}`);
    
    const response = await fetch(`${basePath}components/${componentName}.html`);
    
    if (!response.ok) {
      // Если не сработало, пробуем противоположный путь
      const oppositePath = basePath === './' ? '../' : './';
      console.log(`Primary path failed, trying opposite: ${oppositePath}`);
      
      const altResponse = await fetch(`${oppositePath}components/${componentName}.html`);
      if (altResponse.ok) {
        const html = await altResponse.text();
        const target = document.querySelector(targetElement);
        if (target) {
          target.innerHTML = html;
          initializeComponents();
          return;
        }
      }
      
      throw new Error(`Failed to load ${componentName}`);
    }
    
    const html = await response.text();
    const target = document.querySelector(targetElement);
    
    if (target) {
      target.innerHTML = html;
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