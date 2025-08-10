async function loadPrompts() {



    console.log('loadPrompts() function started');


    const container = document.getElementById("prompts-container");





    if (!container) {


        console.error("Prompts container not found.");


        return;


    }





    // Clear existing content and show a loading message


    container.innerHTML = '<h1>Prompts</h1><p>Carregando prompts do repositório...</p>';





    // GitHub API details


    const owner = 'luisfa27';


    const repo = 'parquetanalytica';


    const path = 'docs/Prompts';


    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;





    try {


        console.log(`Fetching directory contents from: ${apiUrl}`);


        const response = await fetch(apiUrl);





        if (!response.ok) {


            throw new Error(`GitHub API error! status: ${response.status}`);


        }





        const files = await response.json();


        console.log('Successfully fetched file list from GitHub API:', files);





        // Filter for .txt files


        const txtFiles = files.filter(file => file.type === 'file' && file.name.endsWith('.txt'));





        if (txtFiles.length === 0) {


            container.innerHTML += '<p>Nenhum prompt (.txt) encontrado no repositório.</p>';


            return;


        }





        // Clear the loading message


        container.innerHTML = '<h1>Prompts</h1>';





        for (const file of txtFiles) {


            try {


                console.log(`Fetching content for: ${file.name} from ${file.download_url}`);


                const promptResponse = await fetch(file.download_url);


                if (!promptResponse.ok) {


                    throw new Error(`Failed to download prompt: ${file.name}`);


                }


                const textContent = await promptResponse.text();


                const promptName = file.name.replace('.txt', '');





                // Create the UI elements for the prompt


                const button = document.createElement("button");


                button.className = "prompt-button";


                button.textContent = promptName;





                const contentDiv = document.createElement("div");


                contentDiv.className = "prompt-content";


                contentDiv.style.display = "none";





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


                    const isVisible = contentDiv.style.display === "block";


                    contentDiv.style.display = isVisible ? "none" : "block";


                });





                copyButton.addEventListener("click", () => {


                    navigator.clipboard.writeText(textarea.value).then(() => {


                        const originalText = copyButton.textContent;


                        copyButton.textContent = "Copiado!";


                        setTimeout(() => {


                            copyButton.textContent = originalText;


                        }, 2000);


                    }).catch(err => {


                        console.error('Failed to copy text: ', err);


                    });


                });





            } catch (promptError) {


                console.error(`Error loading prompt ${file.name}:`, promptError);


                // Optionally display an error for the specific prompt that failed


            }


        }


    } catch (error) {


        console.error("Erro ao carregar a lista de prompts via API do GitHub:", error);


        container.innerHTML += `<p style="color: red;">Falha ao carregar prompts do GitHub: ${error.message}</p>`;


    }


}
