const inputText = document.getElementById('input-text');
const separatorSelect = document.getElementById('separator');
const maxLengthInput = document.getElementById('max-length');
const slugOutput = document.getElementById('slug-output');
const clearButton = document.getElementById('clear-button');
const copyButton = document.getElementById('copy-button');
const notification = document.getElementById('notification');

function generateSlug() {
    const text = inputText.value.trim();
    const separator = separatorSelect.value;
    const maxLength = parseInt(maxLengthInput.value, 10);

    if (!text) {
        slugOutput.textContent = 'Сгенерированный слаг';
        return;
    }

    // Транслитерация кириллицы
    const translitMap = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo', 'ж': 'zh',
        'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
        'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'ts',
        'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu',
        'я': 'ya'
    };

    // Преобразуем текст в нижний регистр и транслитерируем
    const transliterated = text.toLowerCase().split('').map(char => {
        if (/[a-z0-9]/.test(char)) {
            return char; // Оставляем латинские буквы и цифры
        } else if (translitMap[char]) {
            return translitMap[char]; // Транслитерируем кириллицу
        } else if (/\s/.test(char)) {
            return ' '; // Сохраняем пробелы
        } else {
            return ''; // Удаляем все остальные символы
        }
    }).join('');

    // Разделяем текст на слова по пробелам и удаляем пустые элементы
    const words = transliterated.split(/\s+/).filter(word => word.length > 0);

    // Формируем слаг с учетом разделителя и максимальной длины
    let slug = '';
    for (const word of words) {
        if ((slug + word).length > maxLength) {
            break;
        }
        if (slug) {
            slug += separator; // Добавляем выбранный разделитель между словами
        }
        slug += word;
    }

    // Обрезаем слаг до максимально допустимой длины
    slug = slug.substring(0, maxLength);

    slugOutput.textContent = slug || 'Слаг пустой';
}

// Показать уведомление
function showNotification() {
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000); // Уведомление исчезает через 2 секунды
}

// Слушатели событий
inputText.addEventListener('input', generateSlug);
separatorSelect.addEventListener('change', generateSlug);
maxLengthInput.addEventListener('input', generateSlug);

clearButton.addEventListener('click', () => {
    inputText.value = '';
    generateSlug();
});

copyButton.addEventListener('click', () => {
    const slug = slugOutput.textContent;
    if (slug && slug !== 'Сгенерированный слаг' && slug !== 'Слаг пустой') {
        navigator.clipboard.writeText(slug).then(() => {
            showNotification(); // Показываем уведомление
        }).catch(err => {
            console.error('Ошибка при копировании:', err);
        });
    }
});

// Инициализация при загрузке страницы
generateSlug();