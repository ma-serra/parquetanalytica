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
            mainContentDiv.innerHTML = contentToInject.outerHTML; // Inject the whole container
            console.log('Content successfully loaded into mainContentDiv from fetched container.');

            // Dynamically load scripts based on the pageUrl
            if (pageUrl === 'prompts.html') {
                const scriptId = 'prompts-script-loader';
                // Remove existing script if it was loaded before to prevent duplicates
                const existingScript = document.getElementById(scriptId);
                if (existingScript) {
                    existingScript.remove();
                }

                const promptsScript = document.createElement('script');
                promptsScript.src = 'prompts-script.js';
                promptsScript.id = scriptId;
                promptsScript.onload = () => {
                    console.log('prompts-script.js loaded dynamically. Calling loadPrompts().');
                    // Ensure loadPrompts is called after the DOM has updated
                    setTimeout(() => {
                        if (typeof loadPrompts === 'function') {
                            loadPrompts();
                        }
                    }, 0);
                };
                promptsScript.onerror = () => {
                    console.error('Error loading prompts-script.js');
                };
                document.body.appendChild(promptsScript);
            }

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