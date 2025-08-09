const fs = require('fs');
const path = require('path');

const promptsDir = path.join(__dirname, 'Prompts');
const outputFile = path.join(__dirname, 'prompt-list.json');

try {
    const files = fs.readdirSync(promptsDir);
    const txtFiles = files.filter(file => path.extname(file).toLowerCase() === '.txt');
    
    fs.writeFileSync(outputFile, JSON.stringify(txtFiles, null, 2), 'utf8');
    
    console.log(`Successfully generated prompt-list.json with ${txtFiles.length} prompts.`);
    console.log('File list:', txtFiles);

} catch (error) {
    console.error('Error generating prompt list:', error);
    process.exit(1);
}
