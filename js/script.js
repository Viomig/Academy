// Универсальные функции для проекта

// Инициализация всех компонентов при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initProject();
});

function initProject() {
    console.log('Проект инициализирован');
    
    // Инициализация кастомных компонентов
    initCustomComponents();
    
    // Обработчики событий
    setupEventListeners();
}

function initCustomComponents() {
    // Инициализация каруселей, модальных окон и т.д.
    console.log('Компоненты инициализированы');
}

function setupEventListeners() {
    // Глобальные обработчики событий
    console.log('Обработчики событий установлены');
}

// Утилитные функции
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Анимации
function fadeIn(element, duration = 300) {
    element.style.opacity = 0;
    element.style.display = 'block';
    
    let start = performance.now();
    
    function animate(time) {
        let timeFraction = (time - start) / duration;
        if (timeFraction > 1) timeFraction = 1;
        
        element.style.opacity = timeFraction;
        
        if (timeFraction < 1) {
            requestAnimationFrame(animate);
        }
    }
    
    requestAnimationFrame(animate);
}


        $(".custom-carousel").owlCarousel({
  autoWidth: true,
  loop: true
});
$(document).ready(function () {
  $(".custom-carousel .item").click(function () {
    $(".custom-carousel .item").not($(this)).removeClass("active");
    $(this).toggleClass("active");
  });
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
                icon.textContent = '-';
            } else {
                icon.textContent = '+';
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const accordion = document.getElementById('educationLevelsAccordion');
    const accordionButtons = accordion.querySelectorAll('.accordion-button');
    
    // 1. Закрытие при повторном нажатии
    accordionButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const targetId = this.getAttribute('data-bs-target');
            const targetCollapse = document.querySelector(targetId);
            const isCollapsed = this.classList.contains('collapsed');
            
            // Если аккордион уже открыт
            if (!isCollapsed) {
                e.preventDefault();
                e.stopPropagation();
                
                // Закрываем его
                const bsCollapse = bootstrap.Collapse.getInstance(targetCollapse) || 
                                  new bootstrap.Collapse(targetCollapse);
                bsCollapse.hide();
                
                // Обновляем состояние кнопки
                this.classList.add('collapsed');
                this.setAttribute('aria-expanded', 'false');
            }
        });
    });
    
    // 2. Закрытие при клике вне аккордиона
    document.addEventListener('click', function(e) {
        if (!accordion.contains(e.target)) {
            const openButtons = accordion.querySelectorAll('.accordion-button:not(.collapsed)');
            
            openButtons.forEach(button => {
                const targetId = button.getAttribute('data-bs-target');
                const targetCollapse = document.querySelector(targetId);
                
                if (targetCollapse && targetCollapse.classList.contains('show')) {
                    const bsCollapse = bootstrap.Collapse.getInstance(targetCollapse);
                    if (bsCollapse) {
                        bsCollapse.hide();
                        button.classList.add('collapsed');
                        button.setAttribute('aria-expanded', 'false');
                    }
                }
            });
        }
    });
    
    // 3. Обработчик события закрытия аккордиона
    accordion.addEventListener('hidden.bs.collapse', function(e) {
        const button = document.querySelector(`[data-bs-target="#${e.target.id}"]`);
        if (button) {
            button.classList.add('collapsed');
            button.setAttribute('aria-expanded', 'false');
        }
    });
});