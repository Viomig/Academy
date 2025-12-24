// tabs.js

// Объявляем функцию в глобальной области видимости
function initTabs() {
  console.log('initTabs function called');
  
  const navbarMenu = document.querySelector('.navbar-menu');
  const tabTriggers = document.querySelectorAll('#academy-tab .nav-link');
  const tabPanes = document.querySelectorAll('.tab-pane');
  
  console.log('Found elements:', {
    navbarMenu: !!navbarMenu,
    tabTriggers: tabTriggers.length,
    tabPanes: tabPanes.length
  });
  
  let activeTab = null;

  // Закрываем все табы при инициализации
  function closeAllTabsOnLoad() {
    tabTriggers.forEach(trigger => {
      trigger.classList.remove('active');
      trigger.setAttribute('aria-selected', 'false');
    });
    
    tabPanes.forEach(pane => {
      pane.classList.remove('show', 'active');
    });
    
    activeTab = null;
    if (navbarMenu) {
      navbarMenu.classList.remove('tab-open');
    }
  }

  // Вызываем при загрузке
  closeAllTabsOnLoad();

  tabTriggers.forEach(trigger => {
    trigger.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const targetId = this.getAttribute('data-coreui-target');
      const targetPane = document.querySelector(targetId);
      
      if (!targetPane) {
        console.error('Target pane not found:', targetId);
        return;
      }
      
      // Если кликаем на активный таб - закрываем все
      if (this === activeTab) {
        closeAllTabs();
      } else {
        // Активируем выбранный таб
        activateTab(this, targetPane);
      }
    });
  });

  function activateTab(trigger, pane) {
    // Деактивируем все табы
    closeAllTabs();
    
    // Активируем выбранный
    trigger.classList.add('active');
    trigger.setAttribute('aria-selected', 'true');
    pane.classList.add('show', 'active');
    
    activeTab = trigger;
    if (navbarMenu) {
      navbarMenu.classList.add('tab-open');
    }
  }

  function closeAllTabs() {
    tabTriggers.forEach(trigger => {
      trigger.classList.remove('active');
      trigger.setAttribute('aria-selected', 'false');
    });
    
    tabPanes.forEach(pane => {
      pane.classList.remove('show', 'active');
    });
    
    activeTab = null;
    if (navbarMenu) {
      navbarMenu.classList.remove('tab-open');
    }
  }

  // Закрытие по клику вне области
  document.addEventListener('click', function(e) {
    if (activeTab && navbarMenu && !navbarMenu.contains(e.target)) {
      closeAllTabs();
    }
  });

  // Закрытие по Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && activeTab) {
      closeAllTabs();
    }
  });
  
  console.log('Tabs initialized successfully');
}

// Явно добавляем функцию в window
window.initTabs = initTabs;
console.log('initTabs function registered globally');

