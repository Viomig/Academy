// ============================================
// BUNDLE.JS - Подключение всех скриптов проекта
// ============================================

// Функция для динамической загрузки скрипта
function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Функция для загрузки всех скриптов по порядку
async function loadAllScripts() {
    console.log('Loading project scripts...');
    
    // Массив скриптов в порядке загрузки
    const scripts = [
        'common.js',
        'tabs.js',
        'news.js'
        
    ];
    
    for (const src of scripts) {
        try {
            await loadScript(src);
            console.log(`Loaded: ${src}`);
        } catch (error) {
            console.error(`Failed to load: ${src}`, error);
        }
    }
    
    console.log('All project scripts loaded');
}

// Загружаем все скрипты
loadAllScripts();