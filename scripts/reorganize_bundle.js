import fs from 'fs/promises';
import path from 'path';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { workspacePaths } from './workspace-paths.js';

async function main() {
    const bundleDir = workspacePaths.productBundleSource;
    
    // 1. Create Printables/ and Editable-Templates/
    const printablesDir = path.join(bundleDir, "Printables");
    const editableDir = path.join(bundleDir, "Editable-Templates");
    await fs.mkdir(printablesDir, { recursive: true });
    await fs.mkdir(editableDir, { recursive: true });
    console.log("Created Printables and Editable-Templates directories.");

    // 2. Move the three category folders
    const categories = ["1-Cancellations", "2-Boundaries", "3-Recovery-Days"];
    for (const cat of categories) {
        const oldPath = path.join(bundleDir, cat);
        const newPath = path.join(editableDir, cat);
        try {
            await fs.rename(oldPath, newPath);
            console.log(`Moved category folder: ${cat} -> Editable-Templates/${cat}`);
        } catch (e) {
            console.log(`Category folder ${cat} already moved or not found: ${e.message}`);
        }
    }

    // 3. Move and rename the PDFs into Printables/
    const pdfMoves = [
        { oldName: "ND3__CommsBundle__README__v1.0.pdf", newName: "Overview.pdf" },
        { oldName: "ND3__CommsBundle__BadDayProtocol__v1.0.pdf", newName: "Bad-Day-Protocol.pdf" },
        { oldName: "ND3__CommsBundle__SignalStatus__v1.0.pdf", newName: "Signal-and-Status-Templates.pdf" },
        { oldName: "ND3__CommsBundle__ProtocolConversation__v1.0.pdf", newName: "Protocol-Conversation-Guide.pdf" }
    ];
    for (const move of pdfMoves) {
        const oldPath = path.join(bundleDir, move.oldName);
        const newPath = path.join(printablesDir, move.newName);
        try {
            await fs.rename(oldPath, newPath);
            console.log(`Moved and renamed PDF: ${move.oldName} -> Printables/${move.newName}`);
        } catch (e) {
            // Check if it's in the spaces folder by accident
            const spacesPath = path.join(bundleDir, "..", "Communication Templates Bundle", move.oldName);
            try {
                await fs.rename(spacesPath, newPath);
                console.log(`Moved and renamed PDF from spaces folder: ${move.oldName} -> Printables/${move.newName}`);
            } catch (err) {
                console.log(`PDF ${move.oldName} already moved or not found: ${e.message}`);
            }
        }
    }

    // 4. Convert the Decision Card into a single one-page A4 PDF
    console.log("Generating Decision-Card.pdf...");
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 in points
    const { width, height } = page.getSize();

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

    // Color definitions
    const bgColor = rgb(244/255, 240/255, 230/255); // #F4F0E6 (cream)
    const whiteColor = rgb(255/255, 251/255, 247/255); // #FFFBF7
    const highlightBg = rgb(255/255, 247/255, 249/255); // #FFF7F9
    const inkColor = rgb(34/255, 30/255, 26/255); // #221E1A
    const primaryPink = rgb(255/255, 45/255, 135/255); // #FF2D87
    const darkPink = rgb(199/255, 31/255, 99/255); // #C71F63
    const mutedText = rgb(107/255, 99/255, 90/255); // #6B635A

    // Draw background
    page.drawRectangle({ x: 0, y: 0, width, height, color: bgColor });

    // Logo
    const logoX = 50;
    const logoY = 780;
    page.drawText("neurodivers", { x: logoX, y: logoY, size: 16, font: fontBold, color: inkColor });
    const logoWidth = fontBold.widthOfTextAtSize("neurodivers", 16);
    page.drawText("³", { x: logoX + logoWidth, y: logoY + 3, size: 14, font: fontBold, color: primaryPink });

    // Right header text
    const rightText = "Decision Card";
    const rightTextWidth = font.widthOfTextAtSize(rightText, 9);
    page.drawText(rightText, { x: width - 50 - rightTextWidth, y: logoY, size: 9, font, color: mutedText });

    // Divider line
    page.drawLine({ start: { x: 50, y: 770 }, end: { x: width - 50, y: 770 }, thickness: 0.5, color: inkColor });

    // Title
    page.drawText("Which template do I need?", { x: 50, y: 720, size: 26, font: fontBold, color: inkColor });

    // Subtitle
    page.drawText("For when you're too depleted to choose. Start at the top and stop at the first yes.", {
        x: 50, y: 695, size: 11, font: fontOblique, color: mutedText
    });

    // Three boxes
    const boxes = [
        {
            q: "Are you pulling out of something you'd already agreed to?",
            target: "Cancellations",
            y: 575
        },
        {
            q: "Are you protecting your time, energy, or space going forward?",
            target: "Boundaries",
            y: 475
        },
        {
            q: "Are you in it right now and need to go quiet / hand something off?",
            target: "Recovery Days",
            y: 375
        }
    ];

    for (const box of boxes) {
        const boxHeight = 80;
        // White box background
        page.drawRectangle({
            x: 50, y: box.y, width: width - 100, height: boxHeight,
            color: whiteColor, borderColor: darkPink, borderWidth: 1
        });

        // Question text
        page.drawText(box.q, {
            x: 70, y: box.y + 48, size: 12, font: fontBold, color: inkColor
        });

        // Vector arrow
        const arrowX = 70;
        const arrowY = box.y + 22;
        page.drawLine({ start: { x: arrowX, y: arrowY }, end: { x: arrowX + 15, y: arrowY }, thickness: 1.5, color: darkPink });
        page.drawLine({ start: { x: arrowX + 15, y: arrowY }, end: { x: arrowX + 11, y: arrowY + 3.5 }, thickness: 1.5, color: darkPink });
        page.drawLine({ start: { x: arrowX + 15, y: arrowY }, end: { x: arrowX + 11, y: arrowY - 3.5 }, thickness: 1.5, color: darkPink });

        // Target text
        page.drawText(box.target, {
            x: arrowX + 22, y: arrowY - 4, size: 13, font: fontBold, color: darkPink
        });
    }

    // Stuck Banner at bottom
    const bannerY = 250;
    const bannerHeight = 50;
    page.drawRectangle({
        x: 50, y: bannerY, width: width - 100, height: bannerHeight,
        color: highlightBg, borderColor: darkPink, borderWidth: 1
    });

    const stuckText = "Still stuck? Default to a brief tone. Short and honest beats perfect and unsent.";
    const stuckWidth = fontOblique.widthOfTextAtSize(stuckText, 11);
    const stuckX = 50 + ((width - 100) - stuckWidth) / 2;
    page.drawText(stuckText, {
        x: stuckX, y: bannerY + 19, size: 11, font: fontOblique, color: darkPink
    });

    // Footer divider line
    page.drawLine({ start: { x: 50, y: 51 }, end: { x: width - 50, y: 51 }, thickness: 2, color: inkColor });

    // Footer Copyright
    page.drawText("© 2026 neurodivers3.co.uk", { x: 50, y: 37, size: 8, font, color: inkColor });

    // Footer Tagline
    const taglineText = "DESIGNS FOR AN UNMASKED LIFE";
    const taglineW = font.widthOfTextAtSize(taglineText, 8);
    page.drawText(taglineText, { x: width - 50 - taglineW, y: 37, size: 8, font, color: inkColor });

    // Footer Badge
    const footerCodeText = "SYSTEM CODE: ND3-DECISION";
    const codeWidth = fontBold.widthOfTextAtSize(footerCodeText, 8);
    const codePad = 6;
    const codeBoxW = codeWidth + (codePad * 2);
    const codeBoxH = 14;
    const codeX = (width / 2) - (codeBoxW / 2);
    page.drawRectangle({ x: codeX, y: 33, width: codeBoxW, height: codeBoxH, color: primaryPink });
    page.drawText(footerCodeText, { x: codeX + codePad, y: 37, size: 8, font: fontBold, color: rgb(1, 1, 1) });

    // Save PDF
    const pdfBytes = await pdfDoc.save();
    const pdfPath = path.join(printablesDir, "Decision-Card.pdf");
    await fs.writeFile(pdfPath, pdfBytes);
    console.log("Decision-Card.pdf generated successfully.");

    // 5. Delete redundant files
    const redundantFiles = [
        "README.txt", "README.md", "README.docx",
        "Decision-Card.txt", "Decision-Card.md", "Decision-Card.docx"
    ];
    for (const file of redundantFiles) {
        const filePath = path.join(bundleDir, file);
        try {
            await fs.unlink(filePath);
            console.log(`Deleted redundant file: ${file}`);
        } catch (e) {
            console.log(`Redundant file ${file} already deleted or not found: ${e.message}`);
        }
    }

    // 6. Create START-HERE.txt
    const startHereText = `COMMUNICATION TEMPLATES BUNDLE
neurodivers3.co.uk

Thank you for buying this.

WHAT THIS IS
24 ready-to-send messages for the conversations that cost more words than
you have: cancelling, holding a boundary, and going quiet on a recovery day.
Each one comes in three tones (warm, neutral, brief) and two formats (a short
message and a longer email).

WHAT'S INSIDE
Printables/
  Overview.pdf .................... what's in the bundle, at a glance
  Decision-Card.pdf ............... "which template do I need?" quick reference
  Bad-Day-Protocol.pdf ............ the one-page bad-day printable
  Signal-and-Status-Templates.pdf
  Protocol-Conversation-Guide.pdf
Editable-Templates/
  1-Cancellations/ ................ 8 templates (.txt, .md, .docx)
  2-Boundaries/ ................... 8 templates (.txt, .md, .docx)
  3-Recovery-Days/ ................ 8 templates (.txt, .md, .docx)

HOW TO USE IT
1. Open the Decision Card if you are not sure which template you need.
2. Find the template, pick the tone that fits (warm, neutral, or brief).
3. Copy it, swap the [square bracket] bits for your details, send.
4. The .txt files open anywhere. The .docx files open in Word, Google Docs or
   Pages. The .md files are for anyone who prefers plain markdown.
Use the printable PDFs if you would rather keep a copy by your desk or on the fridge.

A NOTE ON THE WORDS
These are a starting point, not a script you owe anyone. Change anything that
does not sound like you. The "x" sign-offs are optional: keep them for someone
close, drop them for something colder.

REFUNDS
Refundable for 14 days, no questions. Email hello@neurodivers3.co.uk within
14 days of purchase.

LICENCE
Personal use only. Use and adapt these as much as you like for yourself.
Please do not resell them, redistribute them, or pass them off as your own work.

VERSION
v1.0, June 2026. Future updates are included free.

CONTACT
hello@neurodivers3.co.uk
neurodivers3.co.uk

Ollie`;

    const startHerePath = path.join(bundleDir, "START-HERE.txt");
    await fs.writeFile(startHerePath, startHereText, "utf-8");
    console.log("START-HERE.txt created successfully.");
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
