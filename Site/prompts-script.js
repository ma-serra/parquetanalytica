async function loadPrompts() {
    console.log('loadPrompts() function started');
    const container = document.getElementById("prompts-container");

    if (!container) {
        console.error("Prompts container not found.");
        return;
    }

    try {
        console.log('Fetching prompt-list.json');
        const response = await fetch("prompt-list.json");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const promptData = await response.json(); // Now promptData contains objects with name and content
        console.log('prompt-list.json fetched successfully', promptData);

        // Clear existing content in case of re-load
        container.innerHTML = '';

        for (const prompt of promptData) { // Iterate through prompt objects
            const promptName = prompt.name;
            const textContent = prompt.content;

            const button = document.createElement("button");
            button.className = "prompt-button";
            button.textContent = promptName;

            const contentDiv = document.createElement("div");
            contentDiv.className = "prompt-content";
            contentDiv.style.display = "none"; // Initially hidden

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
                navigator.clipboard.writeText(textarea.value).then(() => {
                    // Optional: Provide feedback to the user, e.g., change button text
                    const originalText = copyButton.textContent;
                    copyButton.textContent = "Copiado!";
                    setTimeout(() => {
                        copyButton.textContent = originalText;
                    }, 2000);
                }).catch(err => {
                    console.error('Failed to copy text: ', err);
                });
            });
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