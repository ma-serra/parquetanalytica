const fs = require("fs");
const path = require("path");

const promptsDir = path.join(__dirname, "Prompts");
const outputFile = path.join(__dirname, "prompt-list.json");

try {
  const files = fs.readdirSync(promptsDir);
  const promptData = [];

  for (const file of files) {
    if (path.extname(file).toLowerCase() === ".txt") {
      const filePath = path.join(promptsDir, file);
      const fileContent = fs.readFileSync(filePath, "utf8");
      promptData.push({
        name: file.replace(".txt", ""),
        content: fileContent,
      });
    }
  }

  fs.writeFileSync(outputFile, JSON.stringify(promptData, null, 2), "utf8");

  console.log(
    `Successfully generated prompt-list.json with ${promptData.length} prompts.`
  );
  console.log("Prompt data:", promptData.map(p => p.name)); // Log only names for brevity
} catch (error) {
  console.error("Error generating prompt list:", error);
  process.exit(1);
}