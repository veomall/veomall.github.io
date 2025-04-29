document.addEventListener('DOMContentLoaded', function() {
    const terminalOutput = document.getElementById('terminal-output');
    const terminalInput = document.getElementById('terminal-input');
    const continueButton = document.getElementById('continue-anyway');
    const keys = document.querySelectorAll('.key');
    const mouse = document.querySelector('.mouse-body');
    const mouseButtons = document.querySelectorAll('.mouse-button');
    
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
    
    // Simple terminal with just display
    if (terminalInput) {
        // Set initial focus
        terminalInput.focus();
        
        // Keep focus on the input field
        terminalInput.addEventListener('focus', function() {
            // Nothing happens on input, just visual
        });
        
        terminalInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                const input = terminalInput.value.trim();
                if (input) {
                    // Just display the entered text, no command processing
                    addToTerminal(`veomall@terminal:~$ ${input}`, 'command');
                    terminalInput.value = '';
                }
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
        
        // Set the prompt to static
        const promptElement = document.querySelector('.prompt');
        if (promptElement) {
            promptElement.textContent = 'veomall@terminal:~$';
        }
        
        // Autofocus again on window focus
        window.addEventListener('focus', function() {
            terminalInput.focus();
        });
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
    
    // Mouse movement tracking
    document.addEventListener('mousemove', function(e) {
        // Get mouse position relative to viewport
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        // Apply larger movement range to the mouse representation
        const moveX = mouseX * 20 - 10; // Range: -10px to 10px
        const moveY = mouseY * 20 - 10; // Range: -10px to 10px
        
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
    
    // Initialize with welcome message
    addToTerminal('Welcome to veomall\'s Terminal', 'success');
    addToTerminal('This is a visual terminal with no command functionality.', 'info');
    addToTerminal('You can type, but no commands will be processed.', 'info');
});