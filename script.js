document.addEventListener('DOMContentLoaded', function() {
    const terminalOutput = document.getElementById('terminal-output');
    const terminalInput = document.getElementById('terminal-input');
    const continueButton = document.getElementById('continue-anyway');
    const keys = document.querySelectorAll('.key');
    const mouse = document.querySelector('.mouse-body');
    const mouseButtons = document.querySelectorAll('.mouse-button');
    const promptElement = document.querySelector('.prompt');
    
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
                if (promptElement) {
                    promptElement.textContent = `veomall@terminal${directory === '/' ? '' : directory}:~$`;
                }
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
        
        // Keep focus on the input field
        terminalInput.addEventListener('blur', function() {
            setTimeout(() => terminalInput.focus(), 10);
        });
        
        terminalInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                const input = terminalInput.value.trim();
                
                // Always display prompt line, even if no command is entered
                addToTerminal(`${promptElement.textContent} ${input}`, input ? 'command' : 'empty-command');
                
                if (input) {
                    // Process the command if command processor is loaded
                    if (window.commandProcessor) {
                        const output = window.commandProcessor.processCommand(input);
                        if (Array.isArray(output)) {
                            output.forEach(line => {
                                if (typeof line === 'object') {
                                    addToTerminal(line.text, line.className || '');
                                } else {
                                    addToTerminal(line);
                                }
                            });
                        } else if (output) {
                            addToTerminal(output);
                        }
                        
                        // Update prompt with current directory
                        window.updatePrompt(window.commandProcessor.currentDirectory);
                    }
                }
                
                terminalInput.value = '';
            }
            
            // Always refocus the input after any key press
            setTimeout(() => terminalInput.focus(), 10);
        });
        
        // Make sure the input is focused when clicking anywhere in the terminal
        document.querySelector('.terminal').addEventListener('click', function() {
            terminalInput.focus();
        });
        
        // Global click event to refocus terminal
        document.addEventListener('click', function() {
            terminalInput.focus();
        });
        
        // Set the initial prompt
        if (promptElement) {
            promptElement.textContent = 'veomall@terminal:~$';
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
            // Complete command names
            const commands = [
                'help', 'whoami', 'ls', 'cd', 'cat', 'pwd', 'clear', 'echo', 'date'
            ];
            return commands.filter(cmd => cmd.startsWith(currentWord.toLowerCase()));
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
                    options.push('-'); // Add the cd - option for returning to previous directory
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
    
    // Prevent context menu on right click
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
    });
    
    function addToTerminal(text, className = '') {
        const line = document.createElement('div');
        line.className = `output-line ${className}`;
        line.textContent = text;
        terminalOutput.appendChild(line);
        
        // Auto-scroll to bottom
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }
    
    function showPrompt() {
        // Add a visual prompt for new users
        addToTerminal('');
    }
    
    window.terminalUtils = {
        addToTerminal
    };
});