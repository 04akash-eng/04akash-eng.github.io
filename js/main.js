/**
 * Personal Portfolio - Interactive Low-Level Engineer Theme
 * Optimized vanilla JS implementations with high performance focus.
 */

document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
    initNavbarSync();
    initMouseGlowCards();
    initTerminalTyping();
});

/* ==========================================================================
   SCROLL REVEAL (IntersectionObserver for smooth entry)
   ========================================================================== */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const observerOptions = {
        root: null, // use viewport
        threshold: 0.1, // trigger when 10% visible
        rootMargin: '0px 0px -50px 0px' // offset trigger point slightly
    };
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target); // trigger once
            }
        });
    }, observerOptions);
    
    revealElements.forEach(el => {
        revealObserver.observe(el);
    });
}

/* ==========================================================================
   NAVBAR ACTIVE STATE SYNC & TRANSPARENCY
   ========================================================================== */
function initNavbarSync() {
    const navbar = document.querySelector('.navbar');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Add border and background blur intensity when scrolled
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.style.backgroundColor = 'rgba(10, 12, 16, 0.9)';
            navbar.style.padding = '0.75rem 0';
        } else {
            navbar.style.backgroundColor = 'rgba(10, 12, 16, 0.75)';
            navbar.style.padding = '1.25rem 0';
        }
    });

    // Sync active menu link with current section in view
    const sectionObserverOptions = {
        root: null,
        threshold: 0.5, // trigger when 50% in view
        rootMargin: '-80px 0px 0px 0px' // adjust for header offset
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${activeId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, sectionObserverOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });
}

/* ==========================================================================
   APPLE-STYLE MOUSE GRADIENT GLOW (Dynamic border & bg glow tracker)
   ========================================================================== */
function initMouseGlowCards() {
    const cards = document.querySelectorAll('.glow-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            // Calculate coordinates relative to the card dimensions
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Set css variables
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}

/* ==========================================================================
   INTERACTIVE TERMINAL (Typing effect simulation)
   ========================================================================== */
function initTerminalTyping() {
    const terminalBody = document.getElementById('terminal-body');
    if (!terminalBody) return;

    // Define interactive commands and answers for diagnostic display
    const commands = [
        { cmd: 'whoami', output: 'akashdeep_singh // mc_master_computer_engineering_2027' },
        { cmd: 'cat qualcomm_internship.json', output: '{\n  "company": "Qualcomm",\n  "role": "Embedded Software Intern, AI & Infrastructure",\n  "location": "Toronto, ON",\n  "work": "PCIe Gen7 & UCIe validation, telemetry pipelines"\n}' },
        { cmd: 'cat amd_internships.json', output: '[\n  {\n    "role": "Hardware Systems Engineering Intern",\n    "focus": "Link equalization (PCIe Gen5/6/7), DDR5/LPDDR5 signal integrity"\n  },\n  {\n    "role": "Analog IP Characterization Engineering Intern",\n    "focus": "Zen 6 DDR5/LPDDR5 bring-up, lab automation (VISA)"\n  }\n]' },
        { cmd: 'get_contact', output: 'Secure lines: [Email: singa301@mcmaster.ca] [Phone: (519) 760-5396]' }
    ];

    let currentCommandIndex = 0;

    // Inject a command-line prompter at the bottom that responds on click or timer
    function createTerminalPromptLine() {
        // Clear any old active prompts to avoid cluttering
        const oldPrompt = document.querySelector('.terminal-input-prompt');
        if (oldPrompt) {
            oldPrompt.removeAttribute('id');
            const cursor = oldPrompt.querySelector('.terminal-cursor');
            if (cursor) cursor.remove();
        }

        const promptLine = document.createElement('div');
        promptLine.className = 'terminal-line terminal-input-prompt';
        promptLine.innerHTML = `<span class="terminal-prompt">$</span> <span class="typing-target"></span><span class="terminal-cursor"></span>`;
        terminalBody.appendChild(promptLine);
        
        // Auto Scroll to bottom of terminal
        terminalBody.scrollTop = terminalBody.scrollHeight;
        
        return promptLine;
    }

    function typeCommand(promptLine, commandText, callback) {
        const target = promptLine.querySelector('.typing-target');
        let index = 0;
        
        function typeChar() {
            if (index < commandText.length) {
                target.textContent += commandText.charAt(index);
                index++;
                setTimeout(typeChar, 80 + Math.random() * 40); // natural typing speed
                terminalBody.scrollTop = terminalBody.scrollHeight;
            } else {
                setTimeout(callback, 500); // Wait briefly before executing
            }
        }
        
        typeChar();
    }

    function printOutput(text, isCode = false) {
        const outputLine = document.createElement('div');
        outputLine.className = 'terminal-line system-output';
        if (isCode) {
            outputLine.style.fontFamily = 'var(--font-mono)';
            outputLine.style.color = '#cdd3de';
            outputLine.style.paddingLeft = '10px';
            outputLine.style.borderLeft = '2px solid var(--border-color)';
        } else {
            outputLine.classList.add('text-success');
        }
        outputLine.innerText = text;
        terminalBody.appendChild(outputLine);
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }

    // Set up a loop to display commands over time with system-like pauses
    function executeTerminalLoop() {
        if (currentCommandIndex >= commands.length) {
            // All commands ran. Print a final nice note.
            const closingLine = document.createElement('div');
            closingLine.className = 'terminal-line text-accent';
            closingLine.style.marginTop = '10px';
            closingLine.innerText = 'System core fully loaded. Explore experience sections below.';
            terminalBody.appendChild(closingLine);
            terminalBody.scrollTop = terminalBody.scrollHeight;
            return;
        }

        const current = commands[currentCommandIndex];
        const promptLine = createTerminalPromptLine();
        
        // Wait 1.5s before typing next command
        setTimeout(() => {
            typeCommand(promptLine, current.cmd, () => {
                // Done typing. Print answer
                const isJson = current.output.startsWith('{') || current.output.includes('\n');
                printOutput(current.output, isJson);
                
                // Advance and schedule next command
                currentCommandIndex++;
                setTimeout(executeTerminalLoop, 1500);
            });
        }, 1200);
    }

    // Start typing loop shortly after page loads to let transitions complete
    setTimeout(executeTerminalLoop, 2500);
}
