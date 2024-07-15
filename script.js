let currentLang;

document.addEventListener('DOMContentLoaded', () => {
    async function setLanguageBasedOnLocation() {
        try {
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            const country = data.country_code.toLowerCase();

            console.log(country);
            
            // Map country codes to languages
            const countryLanguageMap = {
                'ru': 'ru', // Russia
                'by': 'be', // Belarus
                // Add more country-language mappings as needed
            };
            
            // Set the language based on the country, default to English
            currentLang = countryLanguageMap[country] || 'en';
            
            // Update the language toggle button text
            langToggle.textContent = languages[currentLang].switch;
            
            // Update the page content
            updateLanguage();
        } catch (error) {
            console.error('Error fetching location:', error);
            // Default to English if there's an error
            currentLang = 'en';
            updateLanguage();
        }
    }

    const expandBtn = document.querySelector('.expand-btn');
    const briefDescription = document.querySelector('.lang-brief-description');
    const fullDescription = document.querySelector('.lang-full-description');
    const detailedDescription = document.querySelector('.lang-detailed-description');
    const themeToggle = document.getElementById('themeToggle');
    const langToggle = document.getElementById('langToggle');
    const body = document.body;
    const card = document.querySelector('.card');

    setLanguageBasedOnLocation();

    let state = 0; // 0: initial, 1: expanded, 2: fully expanded

    expandBtn.addEventListener('click', () => {
        state = (state + 1) % 3;
    
        switch(state) {
            case 0:
                card.classList.remove('expanded', 'fully-expanded');
                briefDescription.style.display = 'block';
                fullDescription.style.display = 'none';
                detailedDescription.style.display = 'none';
                break;
            case 1:
                card.classList.add('expanded');
                card.classList.remove('fully-expanded');
                briefDescription.style.display = 'none';
                fullDescription.style.display = 'block';
                detailedDescription.style.display = 'none';
                setTimeout(() => fullDescription.style.opacity = 1, 50);
                break;
            case 2:
                card.classList.add('fully-expanded');
                setTimeout(() => {
                    briefDescription.style.display = 'none';
                    fullDescription.style.display = 'none';
                    detailedDescription.style.display = 'block';
                    setTimeout(() => detailedDescription.style.opacity = 1, 50);
                }, 250);
                break;
        }
        updateLanguage(); // Add this line to update all descriptions
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

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100, // Adjust this value as needed
                    behavior: 'smooth'
                });
            }
        });
    });

    const languages = {
        en: {
            switch: 'EN',
            project: 'Projects',
            blog: 'Blog',
            name: 'HEORHI PRYSTROM',
            'brief-description': 'Software and Web developer. I am currently studying at the university. I studied programming on my own and for free — without mentors and any paid courses.',
            'full-description': 'I am a young and ambitious Software Developer and Back-end developer. I am currently studying at the Belarusian State University of Informatics and Radioelectronics, combining my studies with work on my projects. I specialize in Python development and am interested in neural networks. I write about them in my blog and not only.',
            'detailed-description': 'An even more detailed description goes here. This can include your life story, career journey, major achievements, and future aspirations.',
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
            name: 'Георгий Пристром',
            'brief-description': 'Software и Web разработчик. На сегодняшний день учусь в университете. Программировать учился самостоятельно и бесплатно — без наставников и каких-либо платных курсов.',
            'full-description': 'Я молодой и амбициозный разработчик Программного Обеспечения и Back-end разработчик. В настоящее время я учусь в Белорусском государственном университете информатики и радиоэлектроники, совмещая учебу с работой над своими проектами. Я специализируюсь на разработке на Python и интересуюсь нейросетями. В блоге пишу про них и не только.',
            'detailed-description': 'Более подробное описание можно найти здесь. Это может быть история вашей жизни, карьерный путь, основные достижения и стремления на будущее.',
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
            name: 'Георгі Прыстром',
            'brief-description': 'Software і Web распрацоўшчык. На сённяшні дзень вучуся ва ўніверсітэце. Праграмаваць вучыўся самастойна і бясплатна-без настаўнікаў і якіх-небудзь платных курсаў.',
            'full-description': 'Я малады і амбіцыйны распрацоўшчык праграмнага забеспячэння і Back-end распрацоўшчык. У цяперашні час я вучуся ў Беларускім дзяржаўным універсітэце інфарматыкі і радыёэлектронікі, сумяшчаю вучобу з працай над сваімі праектамі. Я спецыялізуюся на распрацоўцы на Python і цікаўлюся нейрасеткамі. У блогу пішу пра іх і не толькі.',
            'detailed-description': 'Больш падрабязнае апісанне можна знайсці тут. Гэта можа быць гісторыя вашай жыцця, кар\'ерны шлях, асноўныя дасягненні і імкнення на будучыню.',
            'current-project': 'Бягучы Праект',
            'recent-projects': 'Нядаўнія Праекты',
            'view-all': 'Паглядзець Усе Праекты',
            'blog-title': 'Апошнія Запісы Блога',
            'read-more': 'Чытаць Далей',
            'view-all-posts': 'Паглядзець Усе Запісы Блога'
        }
    };

    function updateLanguage() {
        document.querySelectorAll('[class*="lang-"]').forEach(elem => {
            const key = elem.className.split('lang-')[1];
            if (languages[currentLang][key]) {
                // Update the content regardless of visibility
                elem.textContent = languages[currentLang][key];
                
                // Only animate if the element is visible
                if (elem.offsetParent !== null) {
                    elem.style.opacity = '0';
                    setTimeout(() => {
                        elem.classList.add('lang-animating');
                        elem.style.opacity = '1';
                    }, 50);
                    elem.addEventListener('animationend', () => {
                        elem.classList.remove('lang-animating');
                    }, {once: true});
                }
            }
        });
    }
    
    langToggle.addEventListener('click', () => {
        const langs = ['en', 'ru', 'be'];
        const currentIndex = langs.indexOf(currentLang);
        currentLang = langs[(currentIndex + 1) % langs.length];
        langToggle.textContent = languages[currentLang].switch;
        updateLanguage();
    });
});