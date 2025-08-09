document.addEventListener("DOMContentLoaded", async function () {
  const container = document.getElementById("prompts-container");

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
});
