import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const researchFile = path.resolve(__dirname, '../../research_content.md');
const outputFile = path.resolve(__dirname, '../src/data/fullData.js');

try {
    const content = fs.readFileSync(researchFile, 'utf8');

    // Split by Files first to respect file boundaries
    const fileSections = content.split('## File:');

    const segments = [];
    let currentSegment = null;

    fileSections.forEach(section => {
        if (!section.trim()) return;

        const firstLineEnd = section.indexOf('\n');
        const filename = section.substring(0, firstLineEnd).trim();
        const body = section.substring(firstLineEnd).trim();

        // Identify Segment from filename
        const segMatch = filename.match(/seg(\d+)/i);
        // Ignore master or other files for the main sequence if they don't follow pattern, 
        // BUT we need to handle "fichas" as insertions.

        if (segMatch && !filename.includes('fichas')) {
            const segId = `seg${parseInt(segMatch[1])}`;

            // Find title inside body (Usually first line e.g. "SEG 1 - ...")
            // If not found, use filename
            let title = filename;
            const lines = body.split('\n');
            const titleLine = lines.find(l => l.trim().startsWith('SEG') || l.trim().startsWith('BLOQUE 0') || l.includes(segId.toUpperCase()));
            if (titleLine) title = titleLine.trim();

            currentSegment = {
                id: segId,
                title: title,
                blocks: [],
                fichas: {} // To store insertions from ficha files
            };

            // Parse Blocks within the segment text
            // Regex to find "BLOQUE X:" start
            const blockRegex = /(BLOQUE\s+\d+:.*?)(?=\nBLOQUE\s+\d+:|$)/gs;
            // Note: This regex might be too simple if content has "BLOQUE" inside text. 
            // Let's use a line-by-line parser state machine for safety.

            let currentBlock = null;
            let buffer = [];

            lines.forEach(line => {
                if (line.match(/^BLOQUE\s+\d+:/i)) {
                    // Save previous block
                    if (currentBlock) {
                        currentBlock.content = buffer.join('\n').trim();
                        currentSegment.blocks.push(currentBlock);
                    }
                    // Start new block
                    currentBlock = {
                        title: line.trim(),
                        content: ''
                    };
                    buffer = []; // Don't include the title line in content if we want it separate, or do? 
                    // User wants "synopsis" vs "full". Let's put full content in 'content' including title for context.
                    buffer.push(line.trim());
                } else {
                    if (currentBlock) {
                        buffer.push(line);
                    } else {
                        // Content before the first block (Intro)
                        // We could make an "Intro" block
                        if (line.trim() && !line.includes('SEG ')) {
                            // Check if we already have an intro block
                            if (currentSegment.blocks.length === 0 && !currentBlock) {
                                currentBlock = { title: "INTRODUCCIÓN", content: "" };
                                buffer.push(line);
                            } else {
                                buffer.push(line);
                            }
                        }
                    }
                }
            });
            // Save last block
            if (currentBlock) {
                currentBlock.content = buffer.join('\n').trim();
                currentSegment.blocks.push(currentBlock);
            }

            segments.push(currentSegment);
        }
        else if (filename.includes('fichas')) {
            // This is a Fichas file. We need to attach it to the corresponding segment.
            const segMatch = filename.match(/seg(\d+)/i);
            if (segMatch) {
                const segId = `seg${parseInt(segMatch[1])}`;
                // Find the segment in our array
                const targetSeg = segments.find(s => s.id === segId);
                if (targetSeg) {
                    // Parse fichas. Usually "FICHA DE COMBATE X:" or "FICHA TÉCNICA:"
                    // Simple split by "FICHA"
                    const fichaBlocks = body.split(/(?=FICHA)/i);
                    fichaBlocks.forEach((fb, idx) => {
                        if (!fb.trim()) return;
                        const lines = fb.split('\n');
                        const title = lines[0].trim();
                        const content = lines.slice(1).join('\n').trim();
                        const key = `ficha_${idx}`;
                        targetSeg.fichas[key] = {
                            title: title,
                            content: content
                        };
                        // We also need to insert a CUE in the blocks? 
                        // This is hard to automate perfectly without semantic understanding.
                        // For now, we will add them to a "Available Fichas" list in the UI.
                    });
                }
            }
        }
    });

    // Sort segments by ID
    segments.sort((a, b) => {
        const numA = parseInt(a.id.replace('seg', ''));
        const numB = parseInt(b.id.replace('seg', ''));
        return numA - numB;
    });

    const jsContent = `export const fullData = ${JSON.stringify({
        title: "S11E03 - Venustiano Carranza",
        segments: segments
    }, null, 2)};`;

    fs.writeFileSync(outputFile, jsContent);
    console.log(`Successfully generated ${outputFile}`);

} catch (err) {
    console.error('Error processing research file:', err);
}
