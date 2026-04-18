// ============================================
// COMMON.JS - Загрузка компонентов и рендеринг новостей
// ============================================

// Глобальные переменные для пагинации
let currentVisibleCount = 4;
const ITEMS_PER_PAGE = 4;
let allNewsItems = [];

async function loadComponent(componentName, targetElement) {
    try {
        const hasSubfolder = window.location.pathname.split('/').filter(Boolean).length > 1;
        let basePath = hasSubfolder ? '../' : './';
        
        const path = window.location.pathname;
        const isMainPage = path === '/' || 
                          path === '/index.html' || 
                          path.endsWith('/index.html');
        
        if (isMainPage) {
            basePath = './';
        }
        
        console.log(`Loading ${componentName}, basePath: ${basePath}`);
        
        const response = await fetch(`${basePath}components/${componentName}.html`);
        
        if (!response.ok) {
            const oppositePath = basePath === './' ? '../' : './';
            const altResponse = await fetch(`${oppositePath}components/${componentName}.html`);
            if (altResponse.ok) {
                const html = await altResponse.text();
                const target = document.querySelector(targetElement);
                if (target) {
                    target.innerHTML = html;
                    initializeComponents(componentName);
                    return;
                }
            }
            throw new Error(`Failed to load ${componentName}`);
        }
        
        const html = await response.text();
        const target = document.querySelector(targetElement);
        
        if (target) {
            target.innerHTML = html;
            initializeComponents(componentName);
        }
        
    } catch (error) {
        console.error(`Error loading ${componentName}:`, error);
    }
}

// Рендеринг горизонтальных новостей
function renderHorizontalNews() {
    console.log('=== renderHorizontalNews ===');
    
    const carousel = document.getElementById('news-horizontal-carousel');
    if (!carousel) {
        console.log('Carousel container not found');
        return;
    }
    
    if (typeof NEWS_DATA === 'undefined') {
        console.log('NEWS_DATA not ready, retrying...');
        setTimeout(renderHorizontalNews, 100);
        return;
    }
    
    // Очищаем
    carousel.innerHTML = '';
    
    // Добавляем новости
    const itemsToShow = NEWS_DATA.news.slice(0, 4);
    itemsToShow.forEach(item => {
        const card = document.createElement('div');
        card.className = 'news-card';
        card.innerHTML = `
            <div class="row">
                <div class="col-md-12">
                    <div class="news-image" style="background-image: url('${item.image}');"></div>
                </div>
                <div class="col-md-12">
                    <div class="news-date">${item.date}</div>
                    <h3 class="news-title">${item.title}</h3>
                    <p class="news-description">${item.description}</p>
                </div>
                <div class="col-md-12">
                    <a href="${item.link}" class="news-link">
                        Подробнее
                        <span class="news-link-arrow"></span>
                    </a>
                </div>
            </div>
        `;
        carousel.appendChild(card);
    });
    
    console.log('Cards added:', carousel.children.length);
    
    // Инициализируем карусель
    initOwlCarousel(carousel);
}

function initOwlCarousel(carousel, attempts = 0) {
    if (attempts > 20) {
        console.error('OwlCarousel init failed after 20 attempts');
        return;
    }
    
    if (typeof $ === 'undefined') {
        setTimeout(() => initOwlCarousel(carousel, attempts + 1), 100);
        return;
    }
    
    if (!$.fn.owlCarousel) {
        setTimeout(() => initOwlCarousel(carousel, attempts + 1), 100);
        return;
    }
    
    // Уничтожаем если уже есть
    if ($(carousel).hasClass('owl-loaded')) {
        $(carousel).trigger('destroy.owl.carousel');
    }
    
    // Сбрасываем классы
    carousel.classList.remove('owl-loaded', 'owl-drag');
    carousel.classList.add('owl-carousel', 'owl-theme');
    
    console.log('Initializing Owl Carousel...');
    
    $(carousel).owlCarousel({
        loop: true,
        margin: 20,
        nav: true,
        dots: false,
        navText: ['‹', '›'],
        responsive: {
            0: { items: 1 },
            768: { items: 2 },
            992: { items: 2.2 },
            1200: { items: 3.2 }
        },
        onInitialized: function() {
            console.log('Owl Carousel initialized successfully');
        }
    });
}

// Рендеринг вертикальных новостей с пагинацией
function renderVerticalNews() {
    console.log('=== renderVerticalNews ===');
    
    const filtersContainer = document.querySelector('#news-vertical-filters .d-flex');
    const gridContainer = document.getElementById('news-vertical-grid');
    
    if (!filtersContainer || !gridContainer) {
        console.log('Vertical containers not found');
        return;
    }
    
    if (typeof NEWS_DATA === 'undefined') {
        console.log('NEWS_DATA not ready, retrying...');
        setTimeout(renderVerticalNews, 100);
        return;
    }
    
    // Сохраняем все новости
    allNewsItems = NEWS_DATA.news;
    
    // Подсчёт категорий (на основе всех новостей)
    const categoryMap = new Map();
    categoryMap.set('все', allNewsItems.length);
    allNewsItems.forEach(item => {
        if (item.category) {
            categoryMap.set(item.category, (categoryMap.get(item.category) || 0) + 1);
        }
    });
    
    const categories = [];
    categoryMap.forEach((count, name) => categories.push({ name, count }));
    categories.sort((a, b) => {
        if (a.name === 'все') return -1;
        if (b.name === 'все') return 1;
        return a.name.localeCompare(b.name);
    });
    
    // Рендерим фильтры
    let filtersHtml = '';
    categories.forEach((cat, i) => {
        filtersHtml += `<button class="filter-item ${i === 0 ? 'active' : ''}" data-filter="${cat.name}">
            <span>${cat.name}</span><span class="filter-count">${cat.count}</span>
        </button>`;
    });
    filtersContainer.innerHTML = filtersHtml;
    
    // Сбрасываем счётчик видимых новостей
    currentVisibleCount = ITEMS_PER_PAGE;
    
    // Рендерим первые 4 новости
    renderNewsItems(gridContainer, 'все');
    
    // Обновляем кнопку "Больше новостей"
    updateLoadMoreButton(gridContainer);
    
    // Фильтры
    document.querySelectorAll('#news-vertical-filters .filter-item').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('#news-vertical-filters .filter-item').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            currentVisibleCount = ITEMS_PER_PAGE; // Сбрасываем счётчик при смене фильтра
            
            renderNewsItems(gridContainer, filter);
            updateLoadMoreButton(gridContainer);
        });
    });
    
    console.log('Vertical news rendered');
}

// Рендеринг новостей с учётом фильтра и количества
function renderNewsItems(gridContainer, filter) {
    // Фильтруем новости
    let filteredNews = allNewsItems;
    if (filter !== 'все') {
        filteredNews = allNewsItems.filter(item => item.category === filter);
    }
    
    // Берём только нужное количество
    const visibleNews = filteredNews.slice(0, currentVisibleCount);
    
    // Рендерим
    let newsHtml = '';
    visibleNews.forEach(item => {
        newsHtml += `<div class="news-card" data-category="${item.category}">
            <div class="row align-items-center">
                <div class="col-md-4"><div class="news-image" style="background-image: url('${item.image}');"></div></div>
                <div class="col-md-6">
                    <div class="news-date">${item.date}</div>
                    <h3 class="news-title">${item.title}</h3>
                    <p class="news-description">${item.description}</p>
                </div>
                <div class="col-md-2">
                    <a href="${item.link}" class="news-link">Подробнее<span class="news-link-arrow"></span></a>
                </div>
            </div>
        </div>`;
    });
    gridContainer.innerHTML = newsHtml;
    
    console.log(`Rendered ${visibleNews.length} of ${filteredNews.length} news (filter: ${filter})`);
}

// Обновление кнопки "Больше новостей"
function updateLoadMoreButton(gridContainer) {
    // Находим секцию и кнопку
    const section = document.querySelector('.news-section-vertical');
    if (!section) return;
    
    const btnContainer = section.querySelector('.text-center');
    if (!btnContainer) return;
    
    // Получаем активный фильтр
    const activeFilter = document.querySelector('#news-vertical-filters .filter-item.active');
    const filter = activeFilter ? activeFilter.dataset.filter : 'все';
    
    // Считаем сколько всего новостей по фильтру
    let filteredNews = allNewsItems;
    if (filter !== 'все') {
        filteredNews = allNewsItems.filter(item => item.category === filter);
    }
    
    // Обновляем кнопку
    if (currentVisibleCount >= filteredNews.length) {
        // Все новости показаны
        btnContainer.innerHTML = `
            <button class="btn btn-primary btn-lg text-white" disabled style="opacity: 0.5;">
                Все новости показаны
            </button>
        `;
    } else {
        // Есть ещё новости
        const remaining = filteredNews.length - currentVisibleCount;
        btnContainer.innerHTML = `
            <button class="btn btn-primary btn-lg text-white load-more-btn">
                Больше новостей (ещё ${remaining})
            </button>
        `;
        
        // Добавляем обработчик
        const loadMoreBtn = btnContainer.querySelector('.load-more-btn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', function() {
                currentVisibleCount += ITEMS_PER_PAGE;
                renderNewsItems(gridContainer, filter);
                updateLoadMoreButton(gridContainer);
            });
        }
    }
}

function initializeComponents(componentName) {
    console.log('Components initialized:', componentName);
    
    if (componentName === 'news-horizontal') {
        setTimeout(renderHorizontalNews, 200);
    }
    
    if (componentName === 'news-vertical') {
        setTimeout(renderVerticalNews, 200);
    }
    
    // Инициализация табов
    if (typeof initTabs === 'function') {
        const tabTriggers = document.querySelectorAll('#academy-tab .nav-link');
        if (tabTriggers.length > 0) {
            initTabs();
        }
    }
}

// Загрузка компонентов
document.addEventListener('DOMContentLoaded', function() {
    loadComponent('header', '#header-placeholder');
    loadComponent('footer', '#footer-placeholder');
    
    if (document.getElementById('news-horizontal-placeholder')) {
        loadComponent('news-horizontal', '#news-horizontal-placeholder');
    }
    if (document.getElementById('news-vertical-placeholder')) {
        loadComponent('news-vertical', '#news-vertical-placeholder');
    }
});

// Футер
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        document.querySelectorAll('.footer-toggle').forEach(toggle => {
            toggle.addEventListener('click', function() {
                const section = this.closest('.footer-section');
                const menu = section.querySelector('.footer-menu');
                const icon = this.querySelector('.toggle-icon');
                menu.classList.toggle('active');
                this.classList.toggle('active');
                icon.textContent = menu.classList.contains('active') ? '−' : '+';
            });
        });
    }, 300);
});

console.log('common.js loaded');