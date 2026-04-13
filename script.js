document.addEventListener('DOMContentLoaded', function() {
    const terminalOutput = document.getElementById('terminal-output');
    const terminalInput = document.getElementById('terminal-input');
    const continueButton = document.getElementById('continue-anyway');
    const promptPathElement = document.getElementById('prompt-path');
    const promptIpElement = document.getElementById('prompt-ip');
    
    let userIP = 'terminal';

    // Get user IP
    fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
            userIP = data.ip || 'terminal';
            if (promptIpElement) {
                promptIpElement.textContent = userIP.substring(0, 12) + (userIP.length > 12 ? '...' : '');
            }
            updatePrompt();
        })
        .catch(() => {
            userIP = 'terminal';
            if (promptIpElement) {
                promptIpElement.textContent = 'terminal';
            }
            updatePrompt();
        });

    function updatePrompt(directory) {
        const dir = directory !== undefined ? directory : (window.commandProcessor ? window.commandProcessor.currentDirectory : '~');
        const pathDisplay = dir === '/' ? '~' : dir;
        
        if (promptPathElement) {
            promptPathElement.textContent = pathDisplay;
        }
    }

    let commandHistory = [];
    let historyIndex = -1;

    // Import command processor
    import('./commands.js')
        .then(module => {
            window.commandProcessor = module.commandProcessor;
            
            // Boot sequence
            runBootSequence();
        })
        .catch(error => {
            console.error('Error loading commands:', error);
            printLine('ERROR: Failed to load command processor', 'error');
        });

    function runBootSequence() {
        const bootLines = [
            { text: 'INITIALIZING SYSTEM...', style: 'info' },
            { text: 'LOADING KERNEL... OK', style: 'success' },
            { text: 'MOUNTING FILESYSTEM... OK', style: 'success' },
            { text: 'STARTING SERVICES...', style: 'info' },
            { text: 'WELCOME TO VEOMALL TERMINAL', style: 'success' },
            { text: 'Type "help" for available commands', style: 'text-dim' }
        ];
        
        let delay = 0;
        bootLines.forEach((line, index) => {
            setTimeout(() => {
                printLine(line.text, line.style);
                if (index === bootLines.length - 1) {
                    terminalInput.focus();
                }
            }, delay);
            delay += 200;
        });
    }

    function printLine(text, className = '') {
        const line = document.createElement('div');
        line.className = `output-line ${className}`;
        line.innerHTML = text;
        terminalOutput.appendChild(line);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }

    function printCommand(cmd, output, isError = false) {
        const cmdLine = document.createElement('div');
        cmdLine.className = 'output-line';
        
        const currentPath = window.commandProcessor ? window.commandProcessor.currentDirectory : '~';
        const prompt = `<span class="prompt"><span class="prompt-user">veomall</span><span class="prompt-separator">@</span><span class="prompt-host">${promptIpElement ? promptIpElement.textContent : 'terminal'}</span><span class="prompt-separator">:</span><span class="prompt-path">${currentPath}</span><span class="prompt-separator">$</span></span>`;
        const command = `<span class="command">${cmd}</span>`;
        cmdLine.innerHTML = `${prompt} ${command}`;
        terminalOutput.appendChild(cmdLine);
        
        if (output) {
            const outputLine = document.createElement('div');
            outputLine.className = `output-line ${isError ? 'error' : ''}`;
            outputLine.innerHTML = output;
            terminalOutput.appendChild(outputLine);
        }
        
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }

    terminalInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            const cmd = this.value.trim();
            if (cmd) {
                commandHistory.push(cmd);
                historyIndex = commandHistory.length;
                
                if (window.commandProcessor) {
                    const result = window.commandProcessor.processCommand(cmd);
                    if (result) {
                        printCommand(cmd, result.output, result.error);
                    } else {
                        printCommand(cmd, '', true);
                    }
                    updatePrompt();
                }
            } else {
                printCommand('', '');
            }
            this.value = '';
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                this.value = commandHistory[historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                this.value = commandHistory[historyIndex];
            } else {
                historyIndex = commandHistory.length;
                this.value = '';
            }
        } else if (e.key === 'Tab') {
            e.preventDefault();
            if (window.commandProcessor) {
                const completion = window.commandProcessor.autocomplete(this.value);
                if (completion) {
                    this.value = completion;
                }
            }
        }
    });

    terminalInput.addEventListener('focus', () => {
        document.querySelector('.cursor-block').style.animation = 'blink 1s step-end infinite';
    });

    terminalInput.addEventListener('blur', () => {
        document.querySelector('.cursor-block').style.animation = 'none';
    });

    // Mobile warning
    if (continueButton) {
        continueButton.addEventListener('click', () => {
            document.querySelector('.mobile-warning').style.display = 'none';
            terminalInput.focus();
        });
    }

    // Click to focus
    document.querySelector('.terminal-container').addEventListener('click', () => {
        terminalInput.focus();
    });

    // Keyboard interaction
    document.querySelectorAll('.key').forEach(key => {
        key.addEventListener('click', function() {
            const keyValue = this.getAttribute('data-key');
            if (keyValue === 'Enter') {
                terminalInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
            } else if (keyValue === 'Backspace') {
                terminalInput.value = terminalInput.value.slice(0, -1);
            } else if (keyValue && keyValue.length === 1) {
                terminalInput.value += keyValue;
            }
            terminalInput.focus();
        });
    });
});
