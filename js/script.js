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

 document.addEventListener('DOMContentLoaded', function() {
            const searchToggle = document.getElementById('searchToggle');
            const searchForm = document.getElementById('searchForm');
            const searchInput = document.getElementById('searchInput');
            const searchButton = document.getElementById('searchButton');

            // Показать/скрыть форму поиска
            searchToggle.addEventListener('click', function() {
                searchForm.classList.toggle('show');
                if (searchForm.classList.contains('show')) {
                    searchInput.focus();
                }
            });

            // Выполнить поиск
            searchButton.addEventListener('click', function() {
                performSearch();
            });

            // Поиск при нажатии Enter
            searchInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    performSearch();
                }
            });

            // Закрыть форму при клике вне ее
            document.addEventListener('click', function(e) {
                if (!searchToggle.contains(e.target) && !searchForm.contains(e.target)) {
                    searchForm.classList.remove('show');
                }
            });

            function performSearch() {
                const query = searchInput.value.trim();
                if (query) {
                    // Здесь можно добавить логику поиска
                    alert('Выполняется поиск: ' + query);
                    // Пример: window.location.href = '/search?q=' + encodeURIComponent(query);
                }
            }
        });

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

