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
  });
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

// ===== МОБИЛЬНОЕ МЕНЮ =====
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initMobileMenu, 300);
});

function initMobileMenu() {
    const isMobile = () => window.innerWidth < 992;
    
    const navbarCollapse = document.getElementById('navbarNavDropdown');
    const toggler = document.querySelector('.navbar-toggler');
    const tabContent = document.getElementById('academy-tab-content');
    const academyTab = document.getElementById('academy-tab');
    
    if (!navbarCollapse || !toggler) return;
    
    console.log('Mobile menu init');
    
    // ===== ШАПКА МЕНЮ =====
    function addMobileHeader() {
        if (!isMobile() || navbarCollapse.querySelector('.mobile-menu-header')) return;
        
        const header = document.createElement('div');
        header.className = 'mobile-menu-header';
        header.innerHTML = `
            <div class="mobile-menu-logo">
                <button class="d-none d-lg-block">
                  <a href="/index.html"><img src="/images/Logo.png"  alt="Company Logo"></a>
                </button>
            </div>
            <button class="mobile-menu-close" aria-label="Закрыть">✕</button>
        `;
        navbarCollapse.insertBefore(header, navbarCollapse.firstChild);
        header.querySelector('.mobile-menu-close').onclick = closeAll;
    }
    
    function removeMobileHeader() {
        const h = navbarCollapse.querySelector('.mobile-menu-header');
        if (h) h.remove();
    }
    
    // ===== ЗАКРЫТИЕ =====
    function closeAll() {
        closeSubmenu();
        if (navbarCollapse.classList.contains('show')) {
            toggler.click();
        }
        document.body.style.overflow = '';
    }
    
    function closeSubmenu() {
        console.log('Closing submenu');
        
        if (tabContent) {
            tabContent.classList.remove('active-pane');
        }
        if (academyTab) {
            academyTab.classList.remove('slide-left');
        }
        
        document.querySelectorAll('#academy-tab .nav-link').forEach(l => {
            l.classList.remove('active');
            l.setAttribute('aria-selected', 'false');
        });
        
        document.querySelectorAll('.tab-pane').forEach(p => {
            p.classList.remove('show', 'active');
            p.style.display = '';
        });
        
        const backBtn = document.querySelector('.tab-back-button');
        if (backBtn) backBtn.remove();
    }
    
    // ===== КНОПКА НАЗАД =====
    function addBackButton(pane) {
        // Удаляем старую
        document.querySelector('.tab-back-button')?.remove();
        
        const active = document.querySelector('#academy-tab .nav-link.active');
        const label = active ? active.textContent.trim() : 'МЕНЮ';
        
        console.log('Adding back button for:', label);
        
        const btn = document.createElement('div');
        btn.className = 'tab-back-button';
        btn.innerHTML = '<span class="back-arrow">‹</span><span>' + label + '</span>';
        btn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            closeSubmenu();
        };
        
        const inner = pane.querySelector('.tab-content-inner');
        if (inner) {
            inner.insertBefore(btn, inner.firstChild);
        } else {
            // Если нет inner, вставляем в сам pane
            pane.insertBefore(btn, pane.firstChild);
        }
    }
    
    // ===== ПОКАЗ ПОДМЕНЮ =====
    function showSubmenu(paneId, clickedLink) {
        console.log('Showing submenu:', paneId);
        
        const pane = document.getElementById(paneId);
        if (!pane) {
            console.error('Pane not found:', paneId);
            return;
        }
        
        // Подсветка активного пункта
        document.querySelectorAll('#academy-tab .nav-link').forEach(l => {
            l.classList.remove('active');
            l.setAttribute('aria-selected', 'false');
        });
        
        if (clickedLink) {
            clickedLink.classList.add('active');
            clickedLink.setAttribute('aria-selected', 'true');
        }
        
        // Скрываем все панели
        document.querySelectorAll('.tab-pane').forEach(p => {
            p.classList.remove('show', 'active');
            p.style.display = 'none';
        });
        
        // Показываем нужную панель
        pane.classList.add('show', 'active');
        pane.style.display = 'block';
        
        // Проверяем, есть ли контент
        console.log('Pane content length:', pane.innerHTML.length);
        console.log('Pane visible:', pane.style.display);
        console.log('Pane classes:', pane.className);
        
        // Анимация слайда
        if (tabContent) {
            tabContent.classList.add('active-pane');
            console.log('Tab content active-pane added');
        }
        if (academyTab) {
            academyTab.classList.add('slide-left');
            console.log('Academy tab slide-left added');
        }
        
        // Добавляем кнопку назад
        setTimeout(() => {
            addBackButton(pane);
            
            // Дополнительно проверяем видимость контента
            const tabContentInner = pane.querySelector('.tab-content-inner');
            if (tabContentInner) {
                console.log('tab-content-inner found, children:', tabContentInner.children.length);
                // Принудительно показываем все вложенные элементы
                tabContentInner.style.display = 'block';
                tabContentInner.style.visibility = 'visible';
                tabContentInner.style.opacity = '1';
            }
            
            // Показываем все колонки
            pane.querySelectorAll('.tab-column, .col-1, .col-2, .col-3, .col-4, [class*="col-"]').forEach(col => {
                col.style.display = 'block';
                col.style.visibility = 'visible';
                col.style.opacity = '1';
            });
        }, 150);
    }
    
    // ===== ТРИГГЕРЫ ПУНКТОВ МЕНЮ =====
    function setupTriggers() {
        if (!isMobile()) return;
        
        console.log('Setting up triggers');
        const links = document.querySelectorAll('#academy-tab .nav-link');
        console.log('Found links:', links.length);
        
        links.forEach((link, index) => {
            const clone = link.cloneNode(true);
            link.parentNode.replaceChild(clone, link);
            
            clone.onclick = function(e) {
                if (!isMobile()) return;
                
                e.preventDefault();
                e.stopPropagation();
                
                const targetId = this.getAttribute('data-coreui-target');
                console.log('Clicked:', targetId);
                
                if (!targetId) {
                    console.error('No target ID on link');
                    return;
                }
                
                // Убираем # если есть
                const paneId = targetId.replace('#', '');
                
                // Показываем подменю
                showSubmenu(paneId, this);
            };
        });
    }
    
    // ===== ОТСЛЕЖИВАНИЕ ОТКРЫТИЯ МЕНЮ =====
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const open = navbarCollapse.classList.contains('show');
                console.log('Menu toggled:', open);
                
                document.body.style.overflow = open ? 'hidden' : '';
                
                if (open && isMobile()) {
                    addMobileHeader();
                    // Даем время на рендер
                    setTimeout(setupTriggers, 200);
                }
                if (!open) {
                    closeSubmenu();
                }
            }
        });
    });
    
    observer.observe(navbarCollapse, { attributes: true, attributeFilter: ['class'] });
    
    // ===== ESC =====
    document.addEventListener('keydown', function(e) {
        if (e.key !== 'Escape' || !isMobile()) return;
        
        if (tabContent && tabContent.classList.contains('active-pane')) {
            closeSubmenu();
        } else if (navbarCollapse.classList.contains('show')) {
            closeAll();
        }
    });
    
    // ===== СВАЙП НАЗАД =====
    if (tabContent) {
        let startX = 0;
        tabContent.addEventListener('touchstart', e => startX = e.touches[0].clientX, { passive: true });
        tabContent.addEventListener('touchend', function(e) {
            if (isMobile() && e.changedTouches[0].clientX - startX > 80 && tabContent.classList.contains('active-pane')) {
                closeSubmenu();
            }
        });
    }
    
    // ===== РЕСАЙЗ =====
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (isMobile()) { 
                addMobileHeader(); 
                setupTriggers(); 
            } else { 
                removeMobileHeader(); 
                closeSubmenu(); 
                document.body.style.overflow = '';
                
                // Восстанавливаем десктопное отображение
                document.querySelectorAll('.tab-pane').forEach(p => {
                    p.style.display = '';
                    p.style.visibility = '';
                    p.style.opacity = '';
                });
                document.querySelectorAll('.tab-content-inner').forEach(inner => {
                    inner.style.display = '';
                    inner.style.visibility = '';
                    inner.style.opacity = '';
                });
            }
        }, 300);
    });
    
    // ===== СТАРТ =====
    if (isMobile()) { 
        addMobileHeader(); 
        setupTriggers(); 
    }
    
    console.log('Mobile menu ready');
}

