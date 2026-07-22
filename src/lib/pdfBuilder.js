// src/lib/pdfBuilder.js

/**
 * Technical compiler that runs vector coordinate transformations,
 * embeds custom typography, registers interactive form checkboxes/inputs,
 * and generates branded, fillable PDF documents from active user layouts.
 */
export async function compileBrandedPDF(sheet, exportMode) {
  const { PDFDocument, rgb, StandardFonts } = await import('pdf-lib');
  
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4 Dimension in points
  const { width, height } = page.getSize();
  
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const courier = await pdfDoc.embedFont(StandardFonts.Courier);
  const courierBold = await pdfDoc.embedFont(StandardFonts.CourierBold);

  let bgColor = rgb(1, 1, 1);
  let fgColor = rgb(0.067, 0.067, 0.067);
  let accentColor = rgb(1, 0.18, 0.53);
  let softAccentColor = rgb(1, 0.92, 0.97);
  
  if (sheet.theme === 'warm-charcoal') {
    bgColor = rgb(0.988, 0.984, 0.969);
    fgColor = rgb(0.067, 0.067, 0.067);
    accentColor = rgb(0.18, 0.384, 1);
  } else if (sheet.theme === 'incubation') {
    bgColor = rgb(1, 1, 1);
    fgColor = rgb(0.067, 0.067, 0.067);
    accentColor = rgb(0.29, 0.42, 0.33);
  }

  const fontStyle = sheet.font === 'mono' ? courier : helvetica;
  const fontStyleBold = sheet.font === 'mono' ? courierBold : helveticaBold;
  const isBlankMode = exportMode === 'blank';

  // Helper function for wrapping text
  const wrapText = (text, maxWidth, font, fontSize) => {
    if (!text) return [];
    const words = text.split(' ');
    let lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const testWidth = font.widthOfTextAtSize(currentLine + " " + word, fontSize);
      if (testWidth < maxWidth) {
        currentLine += " " + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  };

  // Canonical Layout Spec Dimensions (in pt)
  const MARGIN = 51;
  const USABLE_WIDTH = width - (MARGIN * 2); // 493.28
  const COL_GAP = 34;
  const COL_WIDTH = (USABLE_WIDTH - COL_GAP) / 2; // 229.64

  // Enforce near-black instead of pure black for calming visual contrast
  fgColor = rgb(0.1, 0.1, 0.1); 

  // 1. Page background (No outer border per brutalist spec guidelines)
  page.drawRectangle({ x: 0, y: 0, width, height, color: bgColor });

  const formFields = [];
  const form = pdfDoc.getForm();

  let currentY = height - MARGIN; // 790.89

  // --- HEADER AREA ---

  // 1.1 Kicker / System Tag
  const tagText = "NEURODIVERS\u00B3 \u00B7 SYSTEM SHEET";
  const tagTextWidth = fontStyleBold.widthOfTextAtSize(tagText, 10);
  const tagHeight = 15;
  page.drawRectangle({
    x: MARGIN, y: currentY - tagHeight, width: tagTextWidth + 12, height: tagHeight,
    color: accentColor
  });
  page.drawText(tagText, {
    x: MARGIN + 6, y: currentY - tagHeight + 4, size: 10, font: fontStyleBold, color: rgb(1, 1, 1)
  });
  currentY -= (tagHeight + 12);

  // 1.2 Title & Subtitle vs Date Box
  const dateBoxWidth = 100;
  const dateBoxHeight = 22;
  
  // Title
  page.drawText(sheet.title.toUpperCase(), {
    x: MARGIN, y: currentY - 26, size: 30, font: fontStyleBold, color: fgColor
  });
  
  // Date Box (Top right, aligned vertically with Title)
  page.drawRectangle({
    x: width - MARGIN - dateBoxWidth, y: currentY - 28, width: dateBoxWidth, height: dateBoxHeight,
    borderColor: fgColor, borderWidth: 1.0, color: rgb(1, 1, 1)
  });
  page.drawText("DATE:", {
    x: width - MARGIN - dateBoxWidth + 6, y: currentY - 21, size: 9, font: fontStyleBold, color: fgColor
  });
  formFields.push(() => {
    const dateField = form.createTextField('date_field');
    dateField.addToPage(page, {
      x: width - MARGIN - dateBoxWidth + 36, y: currentY - 27, width: dateBoxWidth - 38, height: 20, 
      borderWidth: 0, borderColor: undefined, backgroundColor: undefined
    });
    dateField.defaultUpdateAppearances(fontStyle);
    dateField.setFontSize(10);
  });

  currentY -= 40; 

  // Subtitle (Wrapped to prevent overflow)
  const subtitleLines = wrapText(sheet.subtitle, USABLE_WIDTH, fontStyle, 11);
  for (const line of subtitleLines) {
    page.drawText(line, {
      x: MARGIN, y: currentY - 11, size: 11, font: fontStyle, color: fgColor
    });
    currentY -= 14;
  }
  
  currentY -= 16; // Margin below subtitle

  // 1.3 Heavy Divider Rule
  page.drawLine({
    start: { x: MARGIN, y: currentY }, end: { x: width - MARGIN, y: currentY },
    thickness: 2.0, color: fgColor
  });
  currentY -= 20;

  // --- FOCUS CAPACITY (BATTERY) ---
  if (sheet.scaleLabel) {
    const batteryHeight = 55;
    const batteryPad = 17;
    
    page.drawRectangle({
      x: MARGIN, y: currentY - batteryHeight, width: USABLE_WIDTH, height: batteryHeight,
      borderColor: fgColor, borderWidth: 1.0, color: rgb(1, 1, 1)
    });
    
    page.drawText(sheet.scaleLabel.toUpperCase(), {
      x: MARGIN + batteryPad, y: currentY - 18, size: 10, font: fontStyleBold, color: fgColor
    });
    
    const levelText = `LEVEL: ${sheet.scaleVal}/10`;
    const levelTextWidth = fontStyleBold.widthOfTextAtSize(levelText, 10);
    const levelBadgeW = levelTextWidth + 12;
    const levelBadgeH = 15;
    page.drawRectangle({
      x: width - MARGIN - batteryPad - levelBadgeW, y: currentY - 20, width: levelBadgeW, height: levelBadgeH,
      color: accentColor
    });
    page.drawText(levelText, {
      x: width - MARGIN - batteryPad - levelBadgeW + 6, y: currentY - 16, size: 10, font: fontStyleBold, color: rgb(1, 1, 1)
    });

    const blockSize = 18;
    const blockGap = 6;
    for (let v = 1; v <= 10; v++) {
      const blockX = MARGIN + batteryPad + (v - 1) * (blockSize + blockGap);
      const blockY = currentY - batteryHeight + 12; // Moved down so it doesn't overlap label
      
      page.drawRectangle({
        x: blockX, y: blockY, width: blockSize, height: blockSize,
        borderColor: fgColor, borderWidth: 1.0, color: rgb(1, 1, 1)
      });

      formFields.push(() => {
        const batteryCb = form.createCheckBox(`battery_${v}`);
        if (!isBlankMode && v <= sheet.scaleVal) {
          batteryCb.check();
        }
        batteryCb.addToPage(page, {
          x: blockX, y: blockY, width: blockSize, height: blockSize,
          borderWidth: 0, borderColor: undefined, backgroundColor: undefined
        });
      });
    }
    currentY -= (batteryHeight + 20);
  }

  // --- SECTIONS (2 COLUMNS) ---
  const drawSectionInCol = (sec, secIdx, colX, colY) => {
    const secPadding = 17;
    const itemGap = 8;
    const rowHeight = 28; // Increased row height to allow 2 lines of text
    const headingHeight = 28;

    const itemsHeight = sec.items ? sec.items.length * rowHeight : 100; // 100 fallback for notes
    const sectionHeight = secPadding + headingHeight + itemsHeight + secPadding - itemGap;

    page.drawRectangle({
      x: colX, y: colY - sectionHeight, width: COL_WIDTH, height: sectionHeight,
      borderColor: fgColor, borderWidth: 1.0, color: rgb(1, 1, 1)
    });

    // Wrapped Section Heading
    const titleLines = wrapText(sec.title.toUpperCase(), COL_WIDTH - (secPadding * 2), fontStyleBold, 9);
    let titleY = colY - secPadding - 8;
    for (const tLine of titleLines) {
      page.drawText(tLine, {
        x: colX + secPadding, y: titleY, size: 9, font: fontStyleBold, color: fgColor
      });
      titleY -= 12;
    }

    page.drawLine({
      start: { x: colX + secPadding, y: titleY - 2 },
      end: { x: colX + COL_WIDTH - secPadding, y: titleY - 2 },
      thickness: 0.5, color: fgColor
    });

    if (sec.type === 'notes') {
      const fieldY = colY - sectionHeight + secPadding;
      const fieldH = sectionHeight - secPadding - headingHeight - secPadding;
      formFields.push(() => {
        const notesField = form.createTextField(`notes_${sec.id}_${secIdx}`);
        if (!isBlankMode && sec.text) notesField.setText(sec.text);
        notesField.enableMultiline();
        notesField.addToPage(page, {
          x: colX + secPadding, y: fieldY, width: COL_WIDTH - (secPadding * 2), height: fieldH, 
          borderWidth: 0, borderColor: undefined, backgroundColor: undefined
        });
        notesField.defaultUpdateAppearances(fontStyle);
        notesField.setFontSize(9.5);
      });
    } else if (sec.type === 'checklist') {
      for (let itemIdx = 0; itemIdx < sec.items.length; itemIdx++) {
        const item = sec.items[itemIdx];
        const cbSize = 13;
        const textGap = 8;
        const rowY = colY - secPadding - headingHeight - 12 - (itemIdx * rowHeight);

        page.drawRectangle({
          x: colX + secPadding, y: rowY - cbSize, width: cbSize, height: cbSize,
          borderColor: fgColor, borderWidth: 1.0, color: rgb(1, 1, 1)
        });

        formFields.push(() => {
          const checkbox = form.createCheckBox(`check_${sec.id}_${itemIdx}_${secIdx}`);
          if (!isBlankMode && item.checked) checkbox.check();
          checkbox.addToPage(page, {
            x: colX + secPadding, y: rowY - cbSize, width: cbSize, height: cbSize, 
            borderWidth: 0, borderColor: undefined, backgroundColor: undefined
          });
        });

        const textX = colX + secPadding + cbSize + textGap;
        const textW = COL_WIDTH - secPadding - cbSize - textGap - secPadding;
        
        formFields.push(() => {
          const itemTextField = form.createTextField(`item_text_${sec.id}_${itemIdx}_${secIdx}`);
          if (!isBlankMode && item.text) itemTextField.setText(item.text);
          itemTextField.enableMultiline();
          itemTextField.addToPage(page, {
            x: textX, y: rowY - rowHeight + 8, width: textW, height: rowHeight - 2, 
            borderWidth: 0, borderColor: undefined, backgroundColor: undefined
          });
          itemTextField.defaultUpdateAppearances(fontStyle);
          itemTextField.setFontSize(9.5);
        });
      }
    }

    return sectionHeight;
  };

  // Row 1
  let row1Y = currentY;
  const h0 = sheet.sections[0] ? (sheet.sections[0].type === 'notes' ? 140 : 17 + 28 + (sheet.sections[0].items.length * 28) + 17 - 8) : 0;
  const h1 = sheet.sections[1] ? (sheet.sections[1].type === 'notes' ? 140 : 17 + 28 + (sheet.sections[1].items.length * 28) + 17 - 8) : 0;
  
  if (sheet.sections[0]) drawSectionInCol(sheet.sections[0], 0, MARGIN, row1Y);
  if (sheet.sections[1]) drawSectionInCol(sheet.sections[1], 1, MARGIN + COL_WIDTH + COL_GAP, row1Y);

  currentY -= (Math.max(h0, h1) + 20);

  // Row 2
  if (sheet.sections[2]) drawSectionInCol(sheet.sections[2], 2, MARGIN, currentY);
  if (sheet.sections[3]) drawSectionInCol(sheet.sections[3], 3, MARGIN + COL_WIDTH + COL_GAP, currentY);

  // --- FOOTER ---
  if (sheet.watermark) {
    const footerY = 51; 
    
    page.drawLine({
      start: { x: MARGIN, y: footerY }, end: { x: width - MARGIN, y: footerY },
      thickness: 2.0, color: fgColor
    });

    const textY = footerY - 14;
    
    page.drawText(`\u00A9 ${new Date().getFullYear()} neurodivers3.co.uk`, {
      x: MARGIN, y: textY, size: 8, font: fontStyle, color: fgColor
    });

    const footerCodeText = `SYSTEM CODE: ND3-${sheet.id.toUpperCase()}`;
    const codeWidth = fontStyleBold.widthOfTextAtSize(footerCodeText, 8);
    const codePad = 6;
    const codeBoxW = codeWidth + (codePad * 2);
    const codeBoxH = 14;
    const codeX = (width / 2) - (codeBoxW / 2);
    
    page.drawRectangle({
      x: codeX, y: textY - 4, width: codeBoxW, height: codeBoxH,
      color: accentColor
    });
    page.drawText(footerCodeText, {
      x: codeX + codePad, y: textY, size: 8, font: fontStyleBold, color: rgb(1, 1, 1)
    });

    const taglineText = "DESIGNS FOR AN UNMASKED LIFE";
    const taglineW = fontStyle.widthOfTextAtSize(taglineText, 8);
    page.drawText(taglineText, {
      x: width - MARGIN - taglineW, y: textY, size: 8, font: fontStyle, color: fgColor
    });
  }

  for (const addFieldFn of formFields) {
    addFieldFn();
  }

  form.updateFieldAppearances(fontStyle);

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
}
