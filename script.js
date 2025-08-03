document.addEventListener('DOMContentLoaded', function() {
    const terminalOutput = document.getElementById('terminal-output');
    const terminalInput = document.getElementById('terminal-input');
    const continueButton = document.getElementById('continue-anyway');
    const keys = document.querySelectorAll('.key');
    const mouse = document.querySelector('.mouse-body');
    const mouseButtons = document.querySelectorAll('.mouse-button');
    const promptElement = document.querySelector('.prompt');
    let userIP = 'terminal'; // По умолчанию

    // Получаем IP пользователя
    fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
            userIP = data.ip || 'terminal';
            updatePromptWithIP();
        })
        .catch(() => {
            userIP = 'terminal';
            updatePromptWithIP();
        });

    function updatePromptWithIP(directory) {
        if (promptElement) {
            const dir = directory !== undefined ? directory : (window.commandProcessor ? window.commandProcessor.currentDirectory : '/');
            promptElement.textContent = `veomall@${userIP}${dir === '/' ? '' : dir}:~$`;
        }
    }

    let commandHistory = [];
    let historyIndex = -1;
    
    // Import command processor
    import('./commands.js')
        .then(module => {
            window.commandProcessor = module.commandProcessor;
            // Initialize with welcome message
            addToTerminal('Welcome to veomall\'s Terminal', 'success');
            addToTerminal('Type "help" to see available commands.', 'info');
            showPrompt();
            
            // Set up directory change event listener
            window.updatePrompt = function(directory) {
                updatePromptWithIP(directory);
            };
            
            // Initialize tab completion
            setupTabCompletion();
        })
        .catch(error => {
            console.error('Failed to load command processor:', error);
            addToTerminal('Error loading command processor. Terminal functionality limited.', 'error');
        });
    
    // Mobile warning handling
    if (continueButton) {
        continueButton.addEventListener('click', function() {
            document.querySelector('.mobile-warning').style.display = 'none';
        });
    }
    
    // Check if device is mobile
    if (window.innerWidth < 768) {
        document.querySelector('.mobile-warning').style.display = 'flex';
    }
    
    // Terminal functionality
    if (terminalInput) {
        // Set initial focus
        terminalInput.focus();
        
        terminalInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                const input = terminalInput.value.trim();

                if (input) {
                    commandHistory.push(input);
                    historyIndex = commandHistory.length; // Сбрасываем индекс
                }
                
                // Always display prompt line, even if no command is entered
                addToTerminal(`${promptElement.textContent} ${input}`, input ? 'command' : 'empty-command');
                
                if (input) {
                    // Process the command if command processor is loaded
                    if (window.commandProcessor) {
                        const output = window.commandProcessor.processCommand(input);
                        
                        if (Array.isArray(output)) {
                            output.forEach(item => addToTerminal(item));
                        } else if (output) {
                            addToTerminal(output); // Для команд, возвращающих простую строку
                        }
                        
                        // Update prompt with current directory
                        window.updatePrompt(window.commandProcessor.currentDirectory);
                    }
                }
                
                terminalInput.value = '';
            }

            if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (historyIndex > 0) {
                    historyIndex--;
                    terminalInput.value = commandHistory[historyIndex];
                }
            }

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (historyIndex < commandHistory.length - 1) {
                    historyIndex++;
                    terminalInput.value = commandHistory[historyIndex];
                } else {
                    // Если дошли до конца, очищаем поле ввода
                    historyIndex = commandHistory.length;
                    terminalInput.value = '';
                }
            }
            
            // Always refocus the input after any key press
            setTimeout(() => terminalInput.focus(), 2);
        });
        
        // Make sure the input is focused when clicking anywhere in the terminal
        document.querySelector('.terminal').addEventListener('click', function(e) {
            const selection = window.getSelection().toString();
    
            // Если клик был НЕ внутри области вывода И нет выделенного текста,
            // то фокусируемся на поле ввода.
            if (!e.target.closest('.terminal-output') && selection.length === 0) {
                terminalInput.focus();
            }
        });
        
        // Global click event: если клик вне терминала — фокус на поле ввода
        document.addEventListener('click', function(e) {
            const terminal = document.querySelector('.terminal');
            if (!terminal.contains(e.target)) {
                terminalInput.focus();
            }
        });
        
        // Set the initial prompt
        if (promptElement) {
            promptElement.textContent = `veomall@${userIP}:~$`;
        }
        
        // Autofocus again on window focus
        window.addEventListener('focus', function() {
            terminalInput.focus();
        });
    }
    
    /**
     * Setup tab completion functionality
     */
    function setupTabCompletion() {
        if (!terminalInput) return;
        
        // Store available commands for autocompletion
        let lastTabPress = 0;
        let tabPressCount = 0;
        let lastInput = '';
        let completionOptions = [];
        
        terminalInput.addEventListener('keydown', function(e) {
            // Handle Tab key
            if (e.key === 'Tab') {
                e.preventDefault(); // Prevent default tab behavior (moving focus)
                
                const input = terminalInput.value;
                const inputParts = input.trim().split(/\s+/);
                const currentWord = inputParts[inputParts.length - 1];
                const isFirstWord = inputParts.length === 1;
                
                // Reset tab counter if input changed or it's been too long
                if (input !== lastInput || Date.now() - lastTabPress > 2000) {
                    tabPressCount = 0;
                    completionOptions = [];
                }
                
                // Initial tab press - find completion options
                if (tabPressCount === 0) {
                    completionOptions = getCompletionOptions(currentWord, isFirstWord);
                    if (completionOptions.length === 1) {
                        // Only one option - complete immediately
                        completeInput(inputParts, completionOptions[0], isFirstWord);
                    } else if (completionOptions.length > 1) {
                        // Multiple options - show options on first double-tab
                        tabPressCount++;
                    }
                } else if (tabPressCount === 1) {
                    // Second tab press - display options
                    addToTerminal('', 'info');
                    addToTerminal('Completion options:', 'info');
                    completionOptions.forEach(option => {
                        addToTerminal(`  ${option}`, 'info');
                    });
                    addToTerminal('', 'info');
                    
                    // Reset display of prompt
                    addToTerminal(`${promptElement.textContent} ${input}`, 'command-incomplete');
                    tabPressCount++;
                } else {
                    // Cycle through options
                    const optionIndex = (tabPressCount - 2) % completionOptions.length;
                    completeInput(inputParts, completionOptions[optionIndex], isFirstWord);
                    tabPressCount++;
                }
                
                lastTabPress = Date.now();
                lastInput = input;
            } else if (e.key !== 'Shift') {
                // Reset tab completion if any other key is pressed (except shift)
                tabPressCount = 0;
            }
        });
    }
    
    /**
     * Get completion options based on the current input
     * @param {string} currentWord - The current word being typed
     * @param {boolean} isFirstWord - Whether this is the first word (command)
     * @returns {Array} - Array of possible completions
     */
    function getCompletionOptions(currentWord, isFirstWord) {
        if (!window.commandProcessor) return [];
        
        if (isFirstWord) {
            // Динамически получаем список команд!
            const allCommands = Object.keys(window.commandProcessor);
            // Фильтруем только функции-команды
            const commands = allCommands.filter(key => typeof window.commandProcessor[key] === 'function' && key.endsWith('Command'));
            // Убираем "Command" из названия для пользователя
            const commandNames = commands.map(cmd => cmd.replace('Command', ''));
            
            return commandNames.filter(cmd => cmd.startsWith(currentWord.toLowerCase()));
        } else {
            // Complete file/directory names
            const firstWord = terminalInput.value.trim().split(/\s+/)[0].toLowerCase();
            
            if (['cd', 'cat', 'ls'].includes(firstWord)) {
                const currentDir = window.commandProcessor.currentDirectory;
                const fileSystem = window.commandProcessor.fileSystem;
                
                // Get files/dirs in current directory
                const currentDirObj = fileSystem[currentDir];
                if (!currentDirObj || currentDirObj.type !== 'directory') return [];
                
                let options = [];
                
                // Add special navigation options for cd
                if (firstWord === 'cd') {
                    options.push('..');
                }
                
                // Add contents of current directory
                if (currentDirObj.contents) {
                    currentDirObj.contents.forEach(item => {
                        // For 'cat', only suggest files
                        // For 'cd', only suggest directories
                        const fullPath = currentDir === '/' ? `/${item}` : `${currentDir}/${item}`;
                        const isDir = fileSystem[fullPath]?.type === 'directory';
                        
                        if ((firstWord === 'cat' && !isDir) || 
                            (firstWord === 'cd' && isDir) || 
                            firstWord === 'ls') {
                            options.push(item);
                        }
                    });
                }
                
                return options.filter(item => item.startsWith(currentWord));
            }
            
            return [];
        }
    }
    
    /**
     * Complete the input with the selected option
     * @param {Array} inputParts - Parts of the current input
     * @param {string} completion - The completion to apply
     * @param {boolean} isFirstWord - Whether this is the first word (command)
     */
    function completeInput(inputParts, completion, isFirstWord) {
        if (isFirstWord) {
            // Replace entire input with completion
            terminalInput.value = completion;
        } else {
            // Replace last word with completion
            inputParts.pop();
            inputParts.push(completion);
            terminalInput.value = inputParts.join(' ');
        }
        
        // Position cursor at end
        setTimeout(() => {
            terminalInput.selectionStart = terminalInput.value.length;
            terminalInput.selectionEnd = terminalInput.value.length;
        }, 0);
    }
    
    // Keyboard key press animation
    document.addEventListener('keydown', function(e) {
        const key = e.key.toLowerCase();
        keys.forEach(keyElement => {
            const dataKey = keyElement.getAttribute('data-key').toLowerCase();
            if (dataKey === key || dataKey === e.code) {
                keyElement.classList.add('pressed');
            }
        });
    });
    
    document.addEventListener('keyup', function(e) {
        const key = e.key.toLowerCase();
        keys.forEach(keyElement => {
            const dataKey = keyElement.getAttribute('data-key').toLowerCase();
            if (dataKey === key || dataKey === e.code) {
                keyElement.classList.remove('pressed');
            }
        });
    });
    
    // Mouse movement tracking with increased range
    document.addEventListener('mousemove', function(e) {
        // Get mouse position relative to viewport
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        // Apply larger movement range to the mouse representation
        const moveX = mouseX * 50 - 25; // Increased range: -25px to 25px
        const moveY = mouseY * 50 - 25; // Increased range: -25px to 25px
        
        mouse.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
    
    // Mouse click animation
    document.addEventListener('mousedown', function(e) {
        if (e.button === 0) { // Left click
            mouseButtons[0].classList.add('pressed');
        } else if (e.button === 2) { // Right click
            mouseButtons[1].classList.add('pressed');
        }
    });
    
    document.addEventListener('mouseup', function(e) {
        if (e.button === 0) { // Left click
            mouseButtons[0].classList.remove('pressed');
        } else if (e.button === 2) { // Right click
            mouseButtons[1].classList.remove('pressed');
        }
    });

    keys.forEach(key => {
        key.addEventListener('click', function() {
            const keyData = this.getAttribute('data-key');
            
            // Устанавливаем фокус на поле ввода
            terminalInput.focus();

            switch (keyData) {
                case 'Enter':
                    // Создаем и отправляем событие 'keydown' для клавиши Enter,
                    // чтобы использовать уже существующую логику
                    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
                    terminalInput.dispatchEvent(enterEvent);
                    break;
                case 'Backspace':
                    // Удаляем последний символ
                    terminalInput.value = terminalInput.value.slice(0, -1);
                    break;
                case 'Tab':
                    // Симулируем нажатие Tab для автодополнения
                    const tabEvent = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
                    terminalInput.dispatchEvent(tabEvent);
                    break;
                case ' ':
                    // Добавляем пробел
                    terminalInput.value += ' ';
                    break;
                // Игнорируем управляющие клавиши, которые не вводят символ при клике
                case 'Escape':
                case 'F1': case 'F2': case 'F3': case 'F4': case 'F5': case 'F6': 
                case 'F7': case 'F8': case 'F9': case 'F10': case 'F11': case 'F12':
                case 'CapsLock':
                case 'Shift':
                case 'Control':
                case 'Alt':
                    break; // Ничего не делаем
                default:
                    // Для всех остальных клавиш просто добавляем их значение в поле ввода
                    terminalInput.value += keyData;
                    break;
            }
        });
    });
    
    // Prevent context menu on right click
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
    });
    
    function addToTerminal(outputItem) {
        const line = document.createElement('div');
        
        // Обрабатываем простой текст (например, из 'echo')
        if (typeof outputItem === 'string') {
            line.className = 'output-line';
            line.textContent = outputItem;
        } 
        // Обрабатываем сложный объект (из 'whoami', 'cat', 'help' и др.)
        else if (typeof outputItem === 'object' && outputItem !== null) {
            line.className = `output-line ${outputItem.className || ''}`;

            // Если это объект-ссылка, создаем тег <a>
            if (outputItem.isLink) {
                const link = document.createElement('a');
                link.href = outputItem.url;
                link.target = '_blank'; // Открывать в новой вкладке
                link.rel = 'noopener noreferrer'; // Для безопасности
                
                // Берем текст из объекта, например "Link: http://..."
                link.textContent = outputItem.text;
                
                line.appendChild(link); // Вставляем ссылку в строку вывода
            } else {
                // Иначе просто выводим текст
                line.textContent = outputItem.text;
            }
        }

        terminalOutput.appendChild(line);
        terminalOutput.scrollTop = terminalOutput.scrollHeight; // Авто-прокрутка
    }
    
    function showPrompt() {
        // Add a visual prompt for new users
        addToTerminal('');
    }
    
    window.terminalUtils = {
        addToTerminal
    };
});