// Dark mode toggle (removed as element does not exist)
// document.getElementById("dark-mode-toggle").addEventListener("click", () => {
//   document.body.classList.toggle("dark-mode");

//   const toggleBtn = document.getElementById("dark-mode-toggle");
//   const isDarkModeOn = document.body.classList.contains("dark-mode");

//   toggleBtn.innerText = isDarkModeOn ? "☀️" : "🌓";
// });

// Elevator.js related code removed as the library is not included.

// Scroll down button related code removed as elements do not exist.


// Dynamic content loading
async function loadContent(pageUrl) {
    const mainContentDiv = document.getElementById('main-content');
    console.log('mainContentDiv inside loadContent:', mainContentDiv);

    console.log('Attempting to load content from:', pageUrl); // Debug: Which page is being loaded
    try {
        const response = await fetch(pageUrl);
        console.log('Fetch response:', response);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        console.log('Fetched text length:', text.length);
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');

        // Get the content from the .container div of the fetched document
        const contentToInject = doc.querySelector('.container');
        console.log('Content to inject (from fetched doc .container):', contentToInject);

        if (contentToInject) {
            // Clear existing content and inject new HTML
            mainContentDiv.innerHTML = contentToInject.innerHTML; // Inject only the innerHTML of the fetched container
            console.log('Content successfully loaded into mainContentDiv from fetched container.');

            // Find and execute scripts within the loaded content
            // We need to re-query the mainContentDiv because innerHTML might not include scripts
            const scripts = mainContentDiv.querySelectorAll('script');
            scripts.forEach(oldScript => {
                const newScript = document.createElement('script');
                // Copy attributes from the old script tag
                Array.from(oldScript.attributes).forEach(attr => {
                    newScript.setAttribute(attr.name, attr.value);
                });
                // If the script has inline content
                if (oldScript.textContent) {
                    newScript.textContent = oldScript.textContent;
                }
                // If the script has a src attribute
                if (oldScript.src) {
                    newScript.src = oldScript.src;
                }
                // Append the new script to the mainContentDiv to execute it
                // Remove the old script to prevent double execution if it was already in innerHTML
                oldScript.remove();
                mainContentDiv.appendChild(newScript);
            });

        } else {
            mainContentDiv.innerHTML = '<p>Content not found in the fetched page.</p>';
            console.warn('Container div not found in:', pageUrl); // Debug: Warning if container not found
        }
    } catch (error) {
        console.error('Error loading content:', error);
        mainContentDiv.innerHTML = `<p>Error loading page: ${error.message}</p>`;
    }
}

// Event listeners for navigation links - wrapped in DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded fired. Attaching event listeners.'); // Debug: Confirm DOMContentLoaded
    document.querySelectorAll('.nav-link').forEach(link => {
        console.log('Attaching listener to link:', link.getAttribute('data-page')); // Debug: Which links are getting listeners
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const page = link.getAttribute('data-page');
            console.log('Link clicked. Data-page:', page); // Debug: Confirm link click and data-page
            if (page) {
                loadContent(page);
            }
        });
    });

    // Initial load for the home page or default content
    // You might want to load a default page here if needed
    // For example: loadContent('home.html');
});

// Function to load prompts content
async function loadPromptsContent() {
    const container = document.getElementById("prompts-container");

    if (!container) {
        console.error("Prompts container not found.");
        return;
    }

    try {
        const response = await fetch("prompt-list.json");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const promptFiles = await response.json();

        for (const fileName of promptFiles) {
            try {
                const promptResponse = await fetch(`Prompts/${fileName}`);
                if (!promptResponse.ok) {
                    throw new Error(`HTTP error! status: ${promptResponse.status}`);
                }
                const textContent = await promptResponse.text();

                const promptName = fileName.replace(".txt", "");

                const button = document.createElement("button");
                button.className = "prompt-button";
                button.textContent = promptName;

                const contentDiv = document.createElement("div");
                contentDiv.className = "prompt-content";

                const textarea = document.createElement("textarea");
                textarea.readOnly = true;
                textarea.value = textContent;

                const copyButton = document.createElement("button");
                copyButton.className = "copy-button";
                copyButton.textContent = "Copiar";

                contentDiv.appendChild(textarea);
                contentDiv.appendChild(copyButton);

                container.appendChild(button);
                container.appendChild(contentDiv);

                button.addEventListener("click", () => {
                    if (contentDiv.style.display === "block") {
                        contentDiv.style.display = "none";
                    } else {
                        contentDiv.style.display = "block";
                    }
                });

                copyButton.addEventListener("click", () => {
                    textarea.select();
                    document.execCommand("copy");
                });
            } catch (error) {
                console.error(`Erro ao carregar o prompt: ${fileName}`, error);
                const errorElement = document.createElement("p");
                errorElement.textContent = `Falha ao carregar o prompt: ${fileName}`;
                errorElement.style.color = "red";
                container.appendChild(errorElement);
            }
        }
    } catch (error) {
        console.error("Erro ao carregar a lista de prompts:", error);
        const errorElement = document.createElement("p");
        errorElement.textContent =
            "Falha ao carregar a lista de prompts (prompt-list.json). Execute o script generate-prompt-list.js";
        errorElement.style.color = "red";
        container.appendChild(errorElement);
    }
}

// Modify loadContent to call loadPromptsContent when prompts.html is loaded
async function loadContent(pageUrl) {
    const mainContentDiv = document.getElementById('main-content');
    console.log('mainContentDiv inside loadContent:', mainContentDiv);

    console.log('Attempting to load content from:', pageUrl); // Debug: Which page is being loaded
    try {
        const response = await fetch(pageUrl);
        console.log('Fetch response:', response);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        console.log('Fetched text length:', text.length);
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');

        // Get the content from the .container div of the fetched document
        const contentToInject = doc.querySelector('.container');
        console.log('Content to inject (from fetched doc .container):', contentToInject);

        if (contentToInject) {
            // Clear existing content and inject new HTML
            mainContentDiv.innerHTML = contentToInject.innerHTML; // Inject only the innerHTML of the fetched container
            console.log('Content successfully loaded into mainContentDiv from fetched container.');

            // If the loaded page is prompts.html, call loadPromptsContent
            if (pageUrl === 'prompts.html') {
                loadPromptsContent();
            }

            // Find and execute scripts within the loaded content
            // We need to re-query the mainContentDiv because innerHTML might not include scripts
            const scripts = mainContentDiv.querySelectorAll('script');
            scripts.forEach(oldScript => {
                const newScript = document.createElement('script');
                // Copy attributes from the old script tag
                Array.from(oldScript.attributes).forEach(attr => {
                    newScript.setAttribute(attr.name, attr.value);
                });
                // If the script has inline content
                if (oldScript.textContent) {
                    newScript.textContent = oldScript.textContent;
                }
                // If the script has a src attribute
                if (oldScript.src) {
                    newScript.src = oldScript.src;
                }
                // Append the new script to the mainContentDiv to execute it
                // Remove the old script to prevent double execution if it was already in innerHTML
                oldScript.remove();
                mainContentDiv.appendChild(newScript);
            });

        } else {
            mainContentDiv.innerHTML = '<p>Content not found in the fetched page.</p>';
            console.warn('Container div not found in:', pageUrl); // Debug: Warning if container not found
        }
    } catch (error) {
        console.error('Error loading content:', error);
        mainContentDiv.innerHTML = `<p>Error loading page: ${error.message}</p>`;
    }
}