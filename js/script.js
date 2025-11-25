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