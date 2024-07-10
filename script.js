document.addEventListener('DOMContentLoaded', () => {
    const expandBtn = document.querySelector('.expand-btn');
    const briefDescription = document.querySelector('.brief-description');
    const fullDescription = document.querySelector('.full-description');
    const themeToggle = document.getElementById('themeToggle');
    const langToggle = document.getElementById('langToggle');
    const body = document.body;

    let isExpanded = false;

    expandBtn.addEventListener('click', () => {
        if (isExpanded) {
            briefDescription.style.display = 'block';
            fullDescription.style.display = 'none';
            expandBtn.style.transform = 'translateY(-50%) rotate(0deg)';
        } else {
            briefDescription.style.display = 'none';
            fullDescription.style.display = 'block';
            expandBtn.style.transform = 'translateY(-50%) rotate(180deg)';
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
            'view-all': 'View All Projects'
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
            'view-all': 'Посмотреть Все Проекты'
        }
    };

    let currentLang = 'en';

    function updateLanguage() {
        document.querySelectorAll('[class*="lang-"]').forEach(elem => {
            const key = elem.className.split('lang-')[1];
            if (key !== 'theme') {
                elem.textContent = languages[currentLang][key];
            }
        });
    }

    langToggle.addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'ru' : 'en';
        langToggle.textContent = languages[currentLang].switch;
        updateLanguage();
    });

    updateLanguage();
});