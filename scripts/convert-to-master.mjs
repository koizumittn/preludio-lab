import sharp from 'sharp';
import fs from 'fs';

// Try to use restored PNG, otherwise falling back to WebP
const sourcePng = 'public/images/placeholders/default-content.png';
const sourceWebp = 'public/images/placeholders/default-content.webp';
const output = 'public/images/placeholders/default-content.webp';

async function convert() {
    let input = sourceWebp;
    if (fs.existsSync(sourcePng)) {
        console.log('Using restored PNG source');
        input = sourcePng;
    } else {
        console.log('Using existing WebP source (upsaling)');
    }

    try {
        // Target: 1600x900
        // If source is 1024x1024 (PNG), we resize to width 1600 first? 
        // Or resize to cover 1600x900.

        await sharp(input)
            .resize(1600, 900, {
                fit: 'cover',
                position: 'center'
            })
            .webp({ quality: 80 })
            .toFile(output + '.tmp'); // Write to temp file first

        fs.renameSync(output + '.tmp', output);

        console.log('Conversion to 1600x900 WebP successful');

        // Cleanup png if we used it/restored it, as we want to keep repo clean? 
        // User wants "One Master". So strictly speaking we should only keep the webp.
        // Spec says "WebP recommended".
        if (input === sourcePng) {
            fs.unlinkSync(sourcePng);
        }

    } catch (error) {
        console.error('Error converting image:', error);
        process.exit(1);
    }
}

convert();
