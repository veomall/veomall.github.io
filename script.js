// Плавная прокрутка до следующего раздела
document.addEventListener('wheel', (event) => {
    const sections = document.querySelectorAll('.section');
    let currentSectionIndex = Array.from(sections).findIndex(section => 
        window.scrollY >= section.offsetTop - 1 && 
        window.scrollY < section.offsetTop + section.offsetHeight - 1
    );

    if (event.deltaY > 0) {
        // Прокрутка вниз
        currentSectionIndex = Math.min(currentSectionIndex + 1, sections.length - 1);
    } else {
        // Прокрутка вверх
        currentSectionIndex = Math.max(currentSectionIndex - 1, 0);
    }

    sections[currentSectionIndex].scrollIntoView({ behavior: 'smooth' });
});