document.addEventListener('DOMContentLoaded', () => {
    const expandBtn = document.querySelector('.expand-btn');
    const briefDescription = document.querySelector('.brief-description');
    const fullDescription = document.querySelector('.full-description');
    const themeToggle = document.getElementById('themeToggle');
    const langToggle = document.getElementById('langToggle');
    const body = document.body;
    const card = document.querySelector('.card');

    let isExpanded = false;

    expandBtn.addEventListener('click', () => {
        if (isExpanded) {
            briefDescription.style.display = 'block';
            fullDescription.style.display = 'none';
            expandBtn.style.transform = 'translateY(-50%) rotate(0deg)';
            card.classList.remove('expanded');
        } else {
            briefDescription.style.display = 'none';
            fullDescription.style.display = 'block';
            expandBtn.style.transform = 'translateY(-50%) rotate(180deg)';
            card.classList.add('expanded');
        }
        isExpanded = !isExpanded;
    });

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-theme');
        const themeIcon = themeToggle.querySelector('i');
        if (body.classList.contains('light-theme')) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    });

    const languages = {
        en: {
            switch: 'EN',
            project: 'Projects',
            blog: 'Blog',
            contact: 'Contact',
            name: 'Your Name',
            brief: 'A brief description about you goes here.',
            full: 'A full, detailed description about you goes here. This can include your background, skills, interests, and any other relevant information you\'d like to share.',
            'current-project': 'Current Project',
            'recent-projects': 'Recent Projects',
            'view-all': 'View All Projects',
            'blog-title': 'Latest Blog Posts',
            'read-more': 'Read More',
            'view-all-posts': 'View All Blog Posts'
        },
        ru: {
            switch: 'RU',
            project: 'Проекты',
            blog: 'Блог',
            contact: 'Контакты',
            name: 'Ваше Имя',
            brief: 'Краткое описание о вас.',
            full: 'Полное, подробное описание о вас. Это может включать вашу биографию, навыки, интересы и любую другую соответствующую информацию, которой вы хотите поделиться.',
            'current-project': 'Текущий Проект',
            'recent-projects': 'Недавние Проекты',
            'view-all': 'Посмотреть Все Проекты',
            'blog-title': 'Последние Записи Блога',
            'read-more': 'Читать Далее',
            'view-all-posts': 'Посмотреть Все Записи Блога'
        },
        be: {
            switch: 'BE',
            project: 'Праекты',
            blog: 'Блог',
            contact: 'Кантакты',
            name: 'Ваша Імя',
            brief: 'Кароткае апісанне пра вас.',
            full: 'Поўнае, падрабязнае апісанне пра вас. Гэта можа ўключаць вашу біяграфію, навыкі, інтарэсы і любую іншую адпаведную інфармацыю, якой вы хочаце падзяліцца.',
            'current-project': 'Бягучы Праект',
            'recent-projects': 'Нядаўнія Праекты',
            'view-all': 'Паглядзець Усе Праекты',
            'blog-title': 'Апошнія Запісы Блога',
            'read-more': 'Чытаць Далей',
            'view-all-posts': 'Паглядзець Усе Запісы Блога'
        }
    };

    let currentLang = 'en';

    function updateLanguage() {
        document.querySelectorAll('[class*="lang-"]').forEach(elem => {
            const key = elem.className.split('lang-')[1];
            if (languages[currentLang][key]) {
                elem.textContent = languages[currentLang][key];
            }
        });
    }
    
    langToggle.addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'ru' : (currentLang === 'ru' ? 'be' : 'en');
        langToggle.textContent = languages[currentLang].switch;
        updateLanguage();
    });

    updateLanguage();
});