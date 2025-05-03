/**
 * Terminal Command Processor
 * Handles various terminal commands and their outputs
 */

const commandProcessor = {
    // Current directory
    currentDirectory: '/',
    
    // Previous directory for cd -
    previousDirectory: '/',
    
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
            contents: ['UVPomodoro.md', 'UVScreenNotes.md', 'veomall.github.io.md', 'UVDocScanner.md', 'UVTranslator.md', 'UVDirectoryMapper.md']
        },

        '/blog/pochemu-lyudyam-interesny-pytki.md': {
            type: 'file',
            url: 'http://127.0.0.1:5500/blog/article.html?path=articles/pochemu-lyudyam-interesny-pytki/article.md',
            title: 'Почему людям интересны пытки',
            date: '2024-11-15'
        },
        '/blog/plasch-nevidimka-syadet-kak-vlitoy.md': {
            type: 'file',
            url: 'http://127.0.0.1:5500/blog/article.html?path=articles/plasch-nevidimka-syadet-kak-vlitoy/article.md',
            title: 'Плащ-невидимка сядет как влитой',
            date: '2025-02-08'
        },
        '/blog/tehnicheskiy-plan-messendzhera-noxtra.md': {
            type: 'file',
            url: 'http://127.0.0.1:5500/blog/article.html?path=articles/tehnicheskiy-plan-messendzhera-noxtra/article.md',
            title: 'Технический план мессенджера Noxtra',
            date: '2025-04-03'
        },
        '/blog/vlast-na-perederzhku.md': {
            type: 'file',
            url: 'http://127.0.0.1:5500/blog/article.html?path=articles/vlast-na-perederzhku/article.md',
            title: 'Власть на передержку',
            date: '2025-04-25'
        },

        '/projects/UVPomodoro.md': {
            type: 'file',
            url: 'https://github.com/veomall/UVPomodoro',
            title: 'Customizable Pomodoro timer',
            date: '2024-10-04'
        },
        '/projects/UVScreenNotes.md': {
            type: 'file',
            url: 'https://github.com/veomall/UVScreenNotes',
            title: 'Screen notes',
            date: '2025-01-14'
        },
        '/projects/veomall.github.io.md': {
            type: 'file',
            url: 'https://github.com/veomall/veomall.github.io',
            title: 'Personal website',
            date: '2025-05-03'
        },
        '/projects/UVDocScanner.md': {
            type: 'file',
            url: 'https://github.com/veomall/UVDocScanner',
            title: 'Computer vision screen capture',
            date: '2025-01-02'
        },
        '/projects/UVTranslator.md': {
            type: 'file',
            url: 'https://github.com/veomall/UVTranslator',
            title: 'Permanent translator',
            date: '2025-02-27'
        },
        '/projects/UVDirectoryMapper.md': {
            type: 'file',
            url: 'https://github.com/veomall/UVDirectoryMapper',
            title: 'Directory mapper',
            date: '2025-01-10'
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
            case 'echo':
                return this.echoCommand(args.slice(1));
            case 'date':
                return this.dateCommand();
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
            { text: "Available Commands:", className: 'success' },
            { text: "  help     - Display this help information", className: 'info' },
            { text: "  whoami   - Display information about Heorhi Prystrom", className: 'info' },
            { text: "  ls       - List directory contents", className: 'info' },
            { text: "  cd       - Change directory", className: 'info' },
            { text: "  cd ..    - Move up one directory", className: 'info' },
            { text: "  cd -     - Go to the previous directory", className: 'info' },
            { text: "  pwd      - Print working directory", className: 'info' },
            { text: "  cat      - View file (opens link in new tab)", className: 'info' },
            { text: "  clear    - Clear the terminal screen", className: 'info' },
            { text: "  echo     - Display a message", className: 'info' },
            { text: "  date     - Display the current date and time", className: 'info' }
        ];
    },
    
    /**
     * Implementation of the whoami command
     * @returns {Array} - Information about Heorhi Prystrom
     */
    whoamiCommand() {
        return [
            { text: "Heorhi Prystrom", className: 'success' },
            { text: "-------------------", className: 'info' },
            { text: "Python software and web developer.", className: 'info' },
            { text: "Passionate about creating clean, efficient, and user-friendly interfaces, focused on customization.", className: 'info' },
            { text: "Currently focused on advancing skills in computer science and machine learning.", className: 'info' },
            { text: "Always looking for new challenges and opportunities to grow.", className: 'info' },
            { text: "", className: 'info' },
            { text: "Contact: heorhiprystrom@gmail.com", className: 'warning' },
            { text: "GitHub: https://github.com/veomall", className: 'warning' }
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
     * Implementation of the echo command
     * @param {Array} args - Arguments to echo
     * @returns {string} - The echoed message
     */
    echoCommand(args) {
        return args.join(' ');
    },
    
    /**
     * Implementation of the date command
     * @returns {string} - The current date and time
     */
    dateCommand() {
        return new Date().toString();
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
        
        const output = [{ text: `Contents of ${path}:`, className: 'success' }];
        
        if (dir.contents.length === 0) {
            output.push({ text: "  (empty directory)", className: 'info' });
        } else {
            dir.contents.forEach(item => {
                const fullPath = path === '/' ? `/${item}` : `${path}/${item}`;
                const isDir = this.fileSystem[fullPath]?.type === 'directory';
                const display = isDir ? `${item}/` : item;
                const className = isDir ? 'warning' : 'info';
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
            this.previousDirectory = this.currentDirectory;
            this.currentDirectory = '/';
            if (window.updatePrompt) {
                window.updatePrompt(this.currentDirectory);
            }
            return [{ text: "Changed to root directory", className: 'success' }];
        }
        
        // Handle cd - (go to previous directory)
        if (targetDir === '-') {
            const tempDir = this.currentDirectory;
            this.currentDirectory = this.previousDirectory;
            this.previousDirectory = tempDir;
            
            if (window.updatePrompt) {
                window.updatePrompt(this.currentDirectory);
            }
            
            return [{ text: `Changed to ${this.currentDirectory}`, className: 'success' }];
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
        this.previousDirectory = oldDir;
        this.currentDirectory = newPath;
        
        // Update the prompt immediately
        if (window.updatePrompt) {
            window.updatePrompt(this.currentDirectory);
        }
        
        return [{ text: `Changed to ${newPath}`, className: 'success' }];
    },
    
    /**
     * Implementation of the cat command
     * @param {string} filename - The file to view
     * @returns {Array} - Result of the operation
     */
    catCommand(filename) {
        if (!filename) {
            return [{ text: "Please specify a file", className: 'error' }];
        }
        
        let filePath;
        if (filename.startsWith('/')) {
            // Absolute path
            filePath = filename;
        } else {
            // Relative path
            filePath = this.currentDirectory === '/' 
                ? `/${filename}` 
                : `${this.currentDirectory}/${filename}`;
        }
        
        // Normalize path
        filePath = filePath.replace(/\/+/g, '/');
        
        const file = this.fileSystem[filePath];
        if (!file) {
            return [{ text: `File not found: ${filename}`, className: 'error' }];
        }
        
        if (file.type !== 'file') {
            return [{ text: `Not a file: ${filename}`, className: 'error' }];
        }
        
        // Open the URL in a new tab
        window.open(file.url, '_blank');
        
        return [
            { text: `Opening ${file.title}...`, className: 'success' },
            { text: `URL: ${file.url}`, className: 'info' },
            { text: `Date: ${file.date}`, className: 'info' }
        ];
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