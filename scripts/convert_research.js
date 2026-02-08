import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const researchFile = path.resolve(__dirname, '../../research_content.md');
const outputFile = path.resolve(__dirname, '../src/data/researchData.js');

try {
    const content = fs.readFileSync(researchFile, 'utf8');
    const sections = content.split('## File:');

    const researchData = {};

    sections.forEach(section => {
        if (!section.trim()) return;

        const firstLineEnd = section.indexOf('\n');
        const filename = section.substring(0, firstLineEnd).trim();
        const body = section.substring(firstLineEnd).trim();

        // Map filename to segment ID
        // s11e03-venustianocarranza-seg01.txt -> seg1
        const match = filename.match(/seg(\d+)/);
        if (match) {
            const segId = `seg${parseInt(match[1])}`;

            // Combine if multiple files per segment (e.g. seg02 + seg02-fichas)
            if (researchData[segId]) {
                researchData[segId] += `\n\n--- COMPLEMENTO (${filename}) ---\n\n` + body;
            } else {
                researchData[segId] = body;
            }
        } else if (filename.includes('master')) {
            researchData['master'] = body;
        }
    });

    const jsContent = `export const researchData = ${JSON.stringify(researchData, null, 2)};`;

    fs.writeFileSync(outputFile, jsContent);
    console.log(`Successfully generated ${outputFile}`);

} catch (err) {
    console.error('Error processing research file:', err);
}
