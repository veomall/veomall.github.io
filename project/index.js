const themeButton = document.getElementById('theme-btn');
console.log(themeButton);
let lightTheme = true;

themeButton.addEventListener('click', () => {
    let body = document.body;
    if(lightTheme) {
        body.classList.remove('light-theme');
        body.classList.add('dark-theme');
        lightTheme = false;
    } else {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
        lightTheme = true;
    }
});