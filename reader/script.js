function markdownToHtml(markdown) {
    function escapeHtml(text) {
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function convertInlineElements(text) {
        text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
        text = text.replace(/\*(.*?)\*/g, "<em>$1</em>");
        text = text.replace(/`(.*?)`/g, "<code>$1</code>");
        text = text.replace(/\[(.*?)\]\((.*?)\)/g, "<a href=\"$2\">$1</a>");
        return text;
    }

    let html = "";
    const lines = markdown.split("\n");
    let inCodeBlock = false;
    let inBlockQuote = false;
    let inOrderedList = false;
    let inUnorderedList = false;

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();

        if (line.startsWith("```")) {
            if (inCodeBlock) {
                html += "</code></pre></div>\n";
                inCodeBlock = false;
            } else {
                const lang = line.slice(3).trim();
                html += `<div class="code-block"><span class="code-lang">${lang}</span><button class="copy-button">Copy</button><pre><code class="language-${lang}">`;
                inCodeBlock = true;
            }
            continue;
        }

        if (inCodeBlock) {
            html += escapeHtml(line) + "\n";
            continue;
        }

        if (line.startsWith("#")) {
            const level = line.match(/^#+/)[0].length;
            const text = line.replace(/^#+\s*/, "");
            html += `<h${level}>${convertInlineElements(text)}</h${level}>\n`;
            continue;
        }

        if (line.match(/^(-{3,}|\*{3,})$/)) {
            html += "<hr>\n";
            continue;
        }

        if (line.startsWith(">")) {
            if (!inBlockQuote) {
                html += "<blockquote>\n";
                inBlockQuote = true;
            }
            html += `<p>${convertInlineElements(line.slice(1).trim())}</p>\n`;
        } else if (inBlockQuote) {
            html += "</blockquote>\n";
            inBlockQuote = false;
        }

        if (line.match(/^\d+\./)) {
            if (!inOrderedList) {
                html += "<ol>\n";
                inOrderedList = true;
            }
            html += `<li>${convertInlineElements(line.replace(/^\d+\.\s*/, ""))}</li>\n`;
        } else if (inOrderedList) {
            html += "</ol>\n";
            inOrderedList = false;
        }

        if ((line.startsWith("- ") || line.startsWith("* ")) && !line.startsWith("- [ ] ") && !line.startsWith("- [x] ")) {
            if (!inUnorderedList) {
                html += "<ul>\n";
                inUnorderedList = true;
            }
            html += `<li>${convertInlineElements(line.slice(2))}</li>\n`;
        } else if (inUnorderedList) {
            html += "</ul>\n";
            inUnorderedList = false;
        }

        // Add checkbox handling
        if (line.startsWith("- [ ] ") || line.startsWith("- [x] ")) {
            const checked = line.startsWith("- [x] ");
            const text = line.slice(6);
            html += `<div class="checkbox-item">
                        <input type="checkbox" ${checked ? 'checked' : ''} disabled>
                        <span>${convertInlineElements(text)}</span>
                    </div>\n`;
            continue;
        }

        if (line !== "" && !inBlockQuote && !inOrderedList && !inUnorderedList) {
            html += `<p>${convertInlineElements(line)}</p>\n`;
        }
    }

    if (inCodeBlock) html += "</code></pre>\n";
    if (inBlockQuote) html += "</blockquote>\n";
    if (inOrderedList) html += "</ol>\n";
    if (inUnorderedList) html += "</ul>\n";

    return html.trim();
}

document.addEventListener("DOMContentLoaded", () => {
    const cardContainer = document.getElementById("card-container");
    const reader = document.getElementById("reader");
    const readerTitle = document.getElementById("reader-title");
    const readerContent = document.getElementById("reader-content");
    const closeReaderButton = document.getElementById("close-reader");

    const files = [
        'Jailbreaks',
        'Запросы в Pony Diffusion',
        'Книги',
        'Jailbreaks',
        'Запросы в Pony Diffusion',
        'Книги'
    ];

    files.forEach(file => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
            <img src="articles/${file}.png" alt="${file}" onerror="this.onerror=null; this.src='default-preview.jpg';">
            <div class="card-title">${file}</div>
        `;
        card.addEventListener("click", () => {
            fetch(`articles/${file}.md`)
                .then(response => response.text())
                .then(data => {
                    readerTitle.textContent = file;
                    readerContent.innerHTML = markdownToHtml(data);
                    reader.classList.remove("hidden");
                    setupCodeCopyButtons();
                });
        });
        cardContainer.appendChild(card);
    });

    closeReaderButton.addEventListener("click", () => {
        reader.classList.add("hidden");
    });

    function setupCodeCopyButtons() {
        const copyButtons = document.querySelectorAll('.copy-button');
        copyButtons.forEach(button => {
            button.addEventListener('click', () => {
                const codeBlock = button.nextElementSibling.querySelector('code');
                const textArea = document.createElement('textarea');
                textArea.value = codeBlock.textContent;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                button.textContent = 'Copied!';
                setTimeout(() => {
                    button.textContent = 'Copy';
                }, 2000);
            });
        });
    }
});