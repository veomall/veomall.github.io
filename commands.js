/**
 * Terminal Command Processor
 * Handles various terminal commands and their outputs
 */

const commandProcessor = {
    // Current directory
    currentDirectory: '/',
    
    // Simulated file system
    fileSystem: {
        '/': {
            type: 'directory',
            contents: ['blog', 'projects']
        },

        '/blog': {
            type: 'directory',
            contents: ['pochemu-lyudyam-interesny-pytki.md', 'plasch-nevidimka-syadet-kak-vlitoy.md', 'tehnicheskiy-plan-messendzhera-noxtra.md', 'vlast-na-perederzhku.md']
        },
        '/projects': {
            type: 'directory',
            contents: ['UVPomodoro.git', 'UVScreenNotes.git', 'veomall.github.io', 'UVDocScanner.git', 'UVTranslator.git', 'UVDirectoryMapper.git']
        },

        '/blog/pochemu-lyudyam-interesny-pytki.md': {
            type: 'file',
            url: 'http://veomall.github.io/blog/article.html?path=articles/pochemu-lyudyam-interesny-pytki/article.md',
            title: 'Почему людям интересны пытки',
            date: '2024-11-15',
            summary: 'Некоторое время назад я посетил музей, в котором последний зал посвящён средневековым орудиям пыток и казни. Мое внимание обратили на количество людей, которые фотографировали орудия пыток и фотографировались на их фоне. '
        },
        '/blog/plasch-nevidimka-syadet-kak-vlitoy.md': {
            type: 'file',
            url: 'http://veomall.github.io/blog/article.html?path=articles/plasch-nevidimka-syadet-kak-vlitoy/article.md',
            title: 'Плащ-невидимка сядет как влитой',
            date: '2025-02-08',
            summary: 'Анализ современных технологий маскировки и их потенциального применения в ближайшем будущем.'
        },
        '/blog/tehnicheskiy-plan-messendzhera-noxtra.md': {
            type: 'file',
            url: 'http://veomall.github.io/blog/article.html?path=articles/tehnicheskiy-plan-messendzhera-noxtra/article.md',
            title: 'Технический план мессенджера Noxtra',
            date: '2025-04-03',
            summary: 'План по созданию мессенджера Noxtra, который будет использоваться для приватного и анонимного общения. Он включает в себя описание архитектуры, технологий и функциональности.'
        },
        '/blog/vlast-na-perederzhku.md': {
            type: 'file',
            url: 'http://veomall.github.io/blog/article.html?path=articles/vlast-na-perederzhku/article.md',
            title: 'Власть на передержку',
            date: '2025-04-25',
            summary: 'Анализ путей передачи власти в автократических режимах.'
        },
        '/blog/rukovodstvo-po-sozdaniyu-vzryvchatki.md': {
            type: 'file',
            url: 'http://veomall.github.io/blog/article.html?path=articles/rukovodstvo-po-sozdaniyu-vzryvchatki/article.md',
            title: 'Руководство по созданию взрычатки',
            date: '2025-05-03',
            summary: 'Руководство по созданию взрычатки, которое включает в себя описание необходимых материалов, инструментов и шагов для создания.'
        },
        '/blog/obhod-tsenzury-v-gemini.md': {
            type: 'file',
            url: 'http://veomall.github.io/blog/article.html?path=articles/obhod-tsenzury-v-gemini/article.md',
            title: 'Обход цензуры в Gemini',
            date: '2025-05-03',
            summary: 'Инструкция по обходу цензуры в Gemini.'
        },
        '/blog/java-rabotaet-na-3-mlrd-ustroystv-a-zachem.md': {
            type: 'file',
            url: 'http://veomall.github.io/blog/article.html?path=articles/java-rabotaet-na-3-mlrd-ustroystv-a-zachem/article.md',
            title: 'Java работает на 3 млрд устройств. А зачем?',
            date: '2025-08-02',
            summary: 'Принцип работы виртуальной машины Java и её использование в современных приложениях.'
        },

        '/projects/veomall.github.io.md': {
            type: 'file',
            url: 'https://github.com/veomall/veomall.github.io',
            title: 'Personal website',
            date: '2025-05-03',
            summary: 'Личная страница разработчика Георгия Пристрома, где размещены статьи, проекты и контактная информация.'
        },
        '/projects/UVPomodoro.md': {
            type: 'file',
            url: 'https://github.com/veomall/UVPomodoro',
            title: 'Customizable Pomodoro timer',
            date: '2024-10-04',
            summary: 'Высококастомизируемый таймер Помодоро.'
        },
        '/projects/UVScreenNotes.md': {
            type: 'file',
            url: 'https://github.com/veomall/UVScreenNotes',
            title: 'Screen notes',
            date: '2025-01-14',
            summary: 'Рисование и расположение заметок на экране с закрепление их поверх всех окон.'
        },
        '/projects/UVDocScanner.md': {
            type: 'file',
            url: 'https://github.com/veomall/UVDocScanner',
            title: 'Computer vision screen capture',
            date: '2025-01-02',
            summary: 'Сканирование документов с экрана с помощью компьютерного зрения.',
        },
        '/projects/UVTranslator.md': {
            type: 'file',
            url: 'https://github.com/veomall/UVTranslator',
            title: 'Instant translator',
            date: '2025-02-27',
            summary: 'Перевод текста из буфера обмена в реальном времени.',
        },
        '/projects/UVDirectoryMapper.md': {
            type: 'file',
            url: 'https://github.com/veomall/UVDirectoryMapper',
            title: 'Directory mapper',
            date: '2025-01-10',
            summary: 'Построение карты директорий и файлов в виде дерева с возможностью создания изображений.',
        }
    },
    
    /**
     * Process a command input and return the appropriate output
     * @param {string} input - The command input from the user
     * @returns {string|Array} - The output to display in the terminal
     */
    processCommand(input) {
        // Extract command and arguments
        const args = input.trim().split(/\s+/);
        const command = args[0].toLowerCase();
        
        // Process command
        switch (command) {
            case 'help':
                return this.helpCommand();
            case 'whoami':
                return this.whoamiCommand();
            case 'clear':
                return this.clearCommand();
            case 'ls':
                return this.lsCommand();
            case 'cd':
                return this.cdCommand(args[1]);
            case 'cat':
                return this.catCommand(args[1]);
            case 'pwd':
                return this.pwdCommand();
            default:
                return [{ 
                    text: `Command not found: ${command}. Type 'help' to see available commands.`, 
                    className: 'error' 
                }];
        }
    },
    
    /**
     * Implementation of the help command
     * @returns {Array} - Help information
     */
    helpCommand() {
        return [
            { text: "  help     - Display this help information", className: 'info' },
            { text: "  whoami   - Display information about Heorhi Prystrom", className: 'info' },
            { text: "  ls       - List directory contents", className: 'info' },
            { text: "  cd       - Change directory", className: 'info' },
            { text: "  cd ..    - Move up one directory", className: 'info' },
            { text: "  pwd      - Print working directory", className: 'info' },
            { text: "  cat      - View file (opens link in new tab)", className: 'info' },
            { text: "  clear    - Clear the terminal screen", className: 'info' }
        ];
    },
    
    /**
     * Implementation of the whoami command
     * @returns {Array} - Information about Heorhi Prystrom
     */
    whoamiCommand() {
        return [
            { text: "Heorhi Prystrom", className: 'info' },
            { text: "---", className: 'error' },
            { text: "Python software and web developer." },
            { text: "Passionate about creating clean, efficient, and user-friendly interfaces, focused on customization." },
            { text: "Currently focused on advancing skills in computer science and machine learning." },
            { text: "Always looking for new challenges and opportunities to grow." },
            { text: "---", className: 'error' },
            { text: "Contact: heorhiprystrom@gmail.com", className: 'warning', isLink: true, url: "mailto:heorhiprystrom@gmail.com" },
            { text: "GitHub: github.com/veomall", className: 'warning', isLink: true, url: "https://github.com/veomall" }
        ];
    },
    
    /**
     * Implementation of the clear command
     */
    clearCommand() {
        // Special handling in the calling code
        document.getElementById('terminal-output').innerHTML = '';
        return null;
    },
    
    /**
     * Implementation of the ls command
     * @returns {Array} - List of directory contents
     */
    lsCommand() {
        const path = this.currentDirectory;
        const dir = this.fileSystem[path];
        
        if (!dir || dir.type !== 'directory') {
            return [{ text: `Cannot list contents: ${path} is not a directory`, className: 'error' }];
        }
        
        const output = [];
        
        if (dir.contents.length === 0) {
            output.push({ text: "  (empty directory)", className: 'info' });
        } else {
            dir.contents.forEach(item => {
                const fullPath = path === '/' ? `/${item}` : `${path}/${item}`;
                const isDir = this.fileSystem[fullPath]?.type === 'directory';
                const display = isDir ? `${item}/` : item;
                const className = 'info';
                output.push({ text: `  ${display}`, className });
            });
        }
        
        return output;
    },
    
    /**
     * Implementation of the cd command
     * @param {string} targetDir - The directory to change to
     * @returns {Array} - Result of the operation
     */
    cdCommand(targetDir) {
        // Store the previous directory before changing
        const oldDir = this.currentDirectory;
        
        // Handle case with no arguments (go to root)
        if (!targetDir) {
            this.currentDirectory = '/';
            if (window.updatePrompt) {
                window.updatePrompt(this.currentDirectory);
            }
        }
        
        let newPath;
        if (targetDir === '..') {
            // Move up one directory
            if (this.currentDirectory === '/') {
                return [{ text: "Already at root directory", className: 'warning' }];
            }
            
            newPath = this.currentDirectory.split('/').slice(0, -1).join('/');
            if (newPath === '') newPath = '/';
        } else if (targetDir.startsWith('/')) {
            // Absolute path
            newPath = targetDir;
        } else {
            // Relative path
            newPath = this.currentDirectory === '/' 
                ? `/${targetDir}` 
                : `${this.currentDirectory}/${targetDir}`;
        }
        
        // Normalize path by removing duplicate slashes
        newPath = newPath.replace(/\/+/g, '/');
        
        // Check if directory exists
        if (!this.fileSystem[newPath]) {
            return [{ text: `Directory not found: ${targetDir}`, className: 'error' }];
        }
        
        if (this.fileSystem[newPath].type !== 'directory') {
            return [{ text: `Not a directory: ${targetDir}`, className: 'error' }];
        }
        
        // Save previous directory before changing
        this.currentDirectory = newPath;
        
        // Update the prompt immediately
        if (window.updatePrompt) {
            window.updatePrompt(this.currentDirectory);
        }
    },
    
    /**
     * Implementation of the cat command
     * @param {string} filename - The file to view
     * @returns {Array} - Result of the operation
     */
    catCommand(filename) {
        if (!filename) {
            return [{ text: "Usage: cat <filename>", className: 'error' }];
        }
        
        let filePath = this.currentDirectory === '/' 
            ? `/${filename}` 
            : `${this.currentDirectory}/${filename}`;
        filePath = filePath.replace(/\/+/g, '/');
        
        const file = this.fileSystem[filePath];
        
        if (!file) {
            return [{ text: `File not found: ${filename}`, className: 'error' }];
        }
        
        if (file.type !== 'file') {
            return [{ text: `cat: ${filename}: Is a directory`, className: 'error' }];
        }
        
        // Формируем структурированный вывод
        const output = [
            { text: `Title: ${file.title}` },
            { text: `Date:  ${file.date}` }
        ];

        if (file.summary) {
            output.push({ text: `About: ${file.summary}` });
        }
        
        // Добавляем специальный объект для ссылки
        output.push({ text: `Link:  ${file.url}`, isLink: true, url: file.url });
        
        return output;
    },
    
    /**
     * Implementation of the pwd command
     * @returns {string} - Current working directory
     */
    pwdCommand() {
        return [{ text: this.currentDirectory, className: 'success' }];
    }
};

// Export the command processor
export { commandProcessor }; 