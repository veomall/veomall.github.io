document.addEventListener('DOMContentLoaded', () => {
    setLanguageBasedOnLocation();
    loadBlogEntries();
    setupThemeToggle();
    setupLanguageToggle();
});

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

async function loadBlogEntries() {
    try {
        const response = await fetch('articles/articles.json');
        const entries = await response.json();
        
        const blogCardsContainer = document.querySelector('.blog-cards');
        
        entries.forEach(entry => {
            const card = createBlogEntryCard(entry);
            blogCardsContainer.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading blog entries:', error);
    }
}

function createBlogEntryCard(entry) {
    const card = document.createElement('div');
    card.className = 'blog-card';
    
    card.innerHTML = `
        <img src="${entry.image}" alt="${entry.title}">
        <div class="blog-content">
            <div class="blog-date">${entry.date}</div>
            <h3>${entry.title}</h3>
            <p>${entry.excerpt}</p>
            <a href="articles/${entry.file}.html" class="read-more lang-read-more" data-lang="read-more">Read More</a>
        </div>
    `;
    
    return card;
}

function setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    const icon = themeToggle.querySelector('i');

    themeToggle.addEventListener('click', (e) => {
        const rect = themeToggle.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const overlay = document.createElement('div');
        overlay.className = 'theme-transition-overlay';
        overlay.style.setProperty('--x', x + 'px');
        overlay.style.setProperty('--y', y + 'px');
        document.body.appendChild(overlay);

        body.classList.add('animating-theme');

        setTimeout(() => {
            body.classList.toggle('light-theme');
            if (body.classList.contains('light-theme')) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
            overlay.style.clipPath = 'circle(150% at ' + x + 'px ' + y + 'px)';
        }, 50);

        setTimeout(() => {
            body.classList.remove('animating-theme');
            overlay.remove();
        }, 700);
    });
}

async function setLanguageBasedOnLocation() {
    try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        const country = data.country_code.toLowerCase();
        
        const countryLanguageMap = {
            'ru': 'ru',
            'by': 'be',
        };
        
        currentLang = countryLanguageMap[country] || 'en';
        
        const langToggle = document.getElementById('langToggle');
        langToggle.textContent = languages[currentLang].switch;
        
        updateLanguage();
    } catch (error) {
        console.error('Error fetching location:', error);
        currentLang = 'en';
        updateLanguage();
    }
}

function setupLanguageToggle() {
    const langToggle = document.getElementById('langToggle');
    langToggle.addEventListener('click', () => {
        const langs = ['en', 'ru', 'be'];
        const currentIndex = langs.indexOf(currentLang);
        currentLang = langs[(currentIndex + 1) % langs.length];
        langToggle.textContent = languages[currentLang].switch;
        updateLanguage();
    });
}

function updateLanguage() {
    document.querySelectorAll('[data-lang]').forEach(elem => {
        const key = elem.dataset.lang;
        if (languages[currentLang][key]) {
            elem.style.opacity = '0';
            setTimeout(() => {
                elem.textContent = languages[currentLang][key];
                elem.classList.add('lang-animating');
                elem.style.opacity = '1';
            }, 200);
            elem.addEventListener('animationend', () => {
                elem.classList.remove('lang-animating');
            }, {once: true});
        }
    });
}

const languages = {
    en: {
        switch: 'EN',
        'read-more': 'Read More',
    },
    ru: {
        switch: 'RU',
        'read-more': 'Читать Далее',
    },
    be: {
        switch: 'BE',
        'read-more': 'Чытаць Далей',
    }
};

setLanguageBasedOnLocation();