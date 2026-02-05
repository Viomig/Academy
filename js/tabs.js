// tabs.js

// Объявляем функцию в глобальной области видимости
function initTabs() {
  console.log('Simplified tabs init');
  
  const tabTriggers = document.querySelectorAll('#academy-tab .nav-link');
  const tabPanes = document.querySelectorAll('.tab-pane');
  const navbarMenu = document.querySelector('.navbar-menu');
  
  // Инициализация - все закрыто
  tabPanes.forEach(pane => pane.classList.remove('show', 'active'));
  tabTriggers.forEach(trigger => {
    trigger.classList.remove('active');
    trigger.setAttribute('aria-selected', 'false');
  });
  
  // Обработчик кликов
  tabTriggers.forEach(trigger => {
    trigger.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const targetId = this.getAttribute('data-coreui-target');
      const targetPane = document.querySelector(targetId);
      
      if (!targetPane) return;
      
      // Закрываем все
      tabTriggers.forEach(t => t.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('show', 'active'));
      
      // Открываем выбранный
      this.classList.add('active');
      this.setAttribute('aria-selected', 'true');
      targetPane.classList.add('show', 'active');
      
      // Добавляем класс для стилей
      if (navbarMenu) navbarMenu.classList.add('tab-open');
    });
  });
  
  // Закрытие по клику вне
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.navbar-menu')) {
      tabTriggers.forEach(t => t.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('show', 'active'));
      if (navbarMenu) navbarMenu.classList.remove('tab-open');
    }
  }, true);
}

// Запуск при загрузке
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTabs);
} else {
  initTabs();
}

// Явно добавляем функцию в window
window.initTabs = initTabs;
console.log('initTabs function registered globally');

