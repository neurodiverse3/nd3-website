import fs from 'fs/promises';
import path from 'path';
import { execSync } from 'child_process';
import { workspacePaths } from './workspace-paths.js';

const finalProductsDir = workspacePaths.finalProducts;
const pdfsDir = workspacePaths.productPdfs;
const tempDir = workspacePaths.packagingTemp;

const NOTION_LINKS = {
  dopamineMenu: 'https://app.notion.com/p/Dopamine-Menu-Template-Customer-Notion-Template-322859cf782a4f16b569fb38824eca80?t=38323712644980ecb74a00a94937309b',
  maskingRecovery: 'https://app.notion.com/p/Mask-Load-Tracker-Customer-Notion-Template-26266e586d524e50818155264c2ee2d9?t=38323712644980ecb74a00a94937309b',
  weeklyPlanner: 'https://app.notion.com/p/378bb46fdcfc4814a0e3da3baad3d2f5',
  burnoutRoadmap: 'https://app.notion.com/p/f7c678228f71466e8bfa7bc4ff01786f'
};

function getREADME(name, description, link = '', fileList = []) {
  let content = `# ${name}\n\nThank you for buying this neurodivers³ product.\n\n## What you bought\n\n${description}\n\n## How to use it\n\n1. Open the file or Notion template link below.\n2. If this is a Notion template, duplicate it into your own workspace.\n3. Start with the page called Start Here, README, or Day One.\n4. Ignore anything that feels like too much today. Come back later.\n\n`;

  if (link) {
    content += `## Notion template link\n\n${link}\n\nIf the link does not work, email hello@neurodivers3.co.uk and I will send a fresh one.\n\n`;
  }

  content += `## Files included\n\n`;
  fileList.forEach(file => {
    content += `- ${file}\n`;
  });

  content += `\n## Refunds\n\nEvery product is refundable for 14 days, no questions. Email hello@neurodivers3.co.uk within 14 days of purchase to request one.\n\n## License\n\nPersonal use only. Duplicate it into your own Notion workspace as many times as you like. Please do not resell it, redistribute it, or pass it off as your own work.\n\n— Ollie\nneurodivers3.co.uk\n`;
  return content;
}

async function main() {
  await fs.mkdir(finalProductsDir, { recursive: true });
  await fs.mkdir(tempDir, { recursive: true });

  console.log('--- PACKAGING PRODUCTS ---');

  // 1. Dopamine Menu Template
  {
    console.log('Packaging Dopamine Menu Template...');
    const itemTemp = path.join(tempDir, 'dopamine_menu');
    await fs.mkdir(itemTemp, { recursive: true });
    
    const readmeContent = getREADME(
      'Dopamine Menu Template',
      'A pre-built menu of inputs your brain finds rewarding, sorted by intensity. Designed for the activation step: the bit before the task, where ordinary productivity advice usually collapses.',
      NOTION_LINKS.dopamineMenu,
      ['README.md', 'template-link.txt', 'dopamine-menu-1pg-v2.pdf']
    );
    await fs.writeFile(path.join(itemTemp, 'README.md'), readmeContent, 'utf8');
    await fs.writeFile(path.join(itemTemp, 'template-link.txt'), NOTION_LINKS.dopamineMenu, 'utf8');
    await fs.copyFile(
      path.join(pdfsDir, 'ND3__DopamineMenu__1Page__v1.0.pdf'),
      path.join(itemTemp, 'dopamine-menu-1pg-v2.pdf')
    );

    const zipPath = path.join(finalProductsDir, 'ND3__DopamineMenuTemplate__Launch.zip');
    execSync(`tar -acf "${zipPath}" -C "${itemTemp}" README.md template-link.txt dopamine-menu-1pg-v2.pdf`);
  }

  // 2. Sensory Audit Workbook
  {
    console.log('Packaging Sensory Audit Workbook...');
    const itemTemp = path.join(tempDir, 'sensory_audit');
    await fs.mkdir(itemTemp, { recursive: true });

    const readmeContent = getREADME(
      'Sensory Audit Workbook',
      'A 28-page workbook to find the sensory drains you\'ve stopped noticing. Helps you look at your environment slowly and practically: light, sound, smell, temperature, clothing, posture, and screens.',
      '',
      ['README.md', 'ND3__SensoryAuditWorkbook__v1.0.pdf']
    );
    await fs.writeFile(path.join(itemTemp, 'README.md'), readmeContent, 'utf8');
    await fs.copyFile(
      path.join(pdfsDir, 'ND3__SensoryAuditWorkbook__v1.0.pdf'),
      path.join(itemTemp, 'ND3__SensoryAuditWorkbook__v1.0.pdf')
    );

    const zipPath = path.join(finalProductsDir, 'ND3__SensoryAuditWorkbook__Launch.zip');
    execSync(`tar -acf "${zipPath}" -C "${itemTemp}" README.md ND3__SensoryAuditWorkbook__v1.0.pdf`);
  }

  // 3. Masking Recovery Pack
  {
    console.log('Packaging Masking Recovery Pack...');
    const itemTemp = path.join(tempDir, 'masking_recovery');
    await fs.mkdir(itemTemp, { recursive: true });

    const readmeContent = getREADME(
      'Masking Recovery Pack',
      'A two-part pack for the slump after heavy masking. Combines a 12-page recovery PDF with a Notion tracker for spotting the pattern before the next crash.',
      NOTION_LINKS.maskingRecovery,
      ['README.md', 'template-link.txt', 'ND3__MaskingRecoveryPack__v1.0.pdf']
    );
    await fs.writeFile(path.join(itemTemp, 'README.md'), readmeContent, 'utf8');
    await fs.writeFile(path.join(itemTemp, 'template-link.txt'), NOTION_LINKS.maskingRecovery, 'utf8');
    await fs.copyFile(
      path.join(pdfsDir, 'ND3__MaskingRecoveryPack__v1.0.pdf'),
      path.join(itemTemp, 'ND3__MaskingRecoveryPack__v1.0.pdf')
    );

    const zipPath = path.join(finalProductsDir, 'ND3__MaskingRecoveryPack__Launch.zip');
    execSync(`tar -acf "${zipPath}" -C "${itemTemp}" README.md template-link.txt ND3__MaskingRecoveryPack__v1.0.pdf`);
  }

  // 4. Burnout Recovery Roadmap
  {
    console.log('Packaging Burnout Recovery Roadmap...');
    const itemTemp = path.join(tempDir, 'burnout_recovery');
    await fs.mkdir(itemTemp, { recursive: true });

    const readmeContent = getREADME(
      'Burnout Recovery Roadmap',
      'A Notion workspace for recovery, not productivity. A phase-gated Notion workspace for the slow climb out of autistic burnout: Survive, Stabilise, and Rebuild.',
      NOTION_LINKS.burnoutRoadmap,
      ['README.md', 'template-link.txt']
    );
    await fs.writeFile(path.join(itemTemp, 'README.md'), readmeContent, 'utf8');
    await fs.writeFile(path.join(itemTemp, 'template-link.txt'), NOTION_LINKS.burnoutRoadmap, 'utf8');

    const zipPath = path.join(finalProductsDir, 'ND3__BurnoutRecoveryRoadmap__Launch.zip');
    execSync(`tar -acf "${zipPath}" -C "${itemTemp}" README.md template-link.txt`);
  }

  // 5. Weekly Planner
  {
    console.log('Packaging Weekly Planner...');
    const itemTemp = path.join(tempDir, 'weekly_planner');
    await fs.mkdir(itemTemp, { recursive: true });

    const readmeContent = getREADME(
      'Weekly Planner',
      'A weekly planner built for a brain whose capacity varies. Uses brain-state tagging, a standing Momentum Protocol, and a Come-down List so the week can bend without becoming a failure.',
      NOTION_LINKS.weeklyPlanner,
      ['README.md', 'template-link.txt', 'ND3__WeeklyPlanner__Printable__v1.0.pdf']
    );
    await fs.writeFile(path.join(itemTemp, 'README.md'), readmeContent, 'utf8');
    await fs.writeFile(path.join(itemTemp, 'template-link.txt'), NOTION_LINKS.weeklyPlanner, 'utf8');
    await fs.copyFile(
      path.join(pdfsDir, 'ND3__WeeklyPlanner__Printable__v1.0.pdf'),
      path.join(itemTemp, 'ND3__WeeklyPlanner__Printable__v1.0.pdf')
    );

    const zipPath = path.join(finalProductsDir, 'ND3__WeeklyPlanner__Launch.zip');
    execSync(`tar -acf "${zipPath}" -C "${itemTemp}" README.md template-link.txt ND3__WeeklyPlanner__Printable__v1.0.pdf`);
  }

  // 6. 1-Page Dopamine Menu (Free)
  {
    console.log('Packaging 1-Page Dopamine Menu...');
    const itemTemp = path.join(tempDir, 'one_page_dopamine');
    await fs.mkdir(itemTemp, { recursive: true });

    // Use free readme template
    const readmeContent = `# 1-Page Dopamine Menu\n\nThank you for downloading this free neurodivers³ product.\n\n## What you downloaded\n\nA free single-page printable for trying the Dopamine Menu format. Contains energy level sections, sensory resets, connection and novelty prompts.\n\n## Files included\n\n- README.md\n- dopamine-menu-1pg-v2.pdf\n\n## Upgrades\n\nIf you want the full editable Notion version with pre-filled examples, worked templates, and low-spoon instructions, check out the full Dopamine Menu Template for £5:\nhttps://neurodivers3.co.uk/store/dopamine-menu-template\n\n— Ollie\nneurodivers3.co.uk\n`;
    await fs.writeFile(path.join(itemTemp, 'README.md'), readmeContent, 'utf8');
    await fs.copyFile(
      path.join(pdfsDir, 'ND3__DopamineMenu__1Page__v1.0.pdf'),
      path.join(itemTemp, 'dopamine-menu-1pg-v2.pdf')
    );

    const zipPath = path.join(finalProductsDir, 'ND3__OnePageDopamineMenu__Free.zip');
    execSync(`tar -acf "${zipPath}" -C "${itemTemp}" README.md dopamine-menu-1pg-v2.pdf`);
  }

  // 7. The Toolkit Bundle
  {
    console.log('Packaging The Toolkit Bundle...');
    const itemTemp = path.join(tempDir, 'toolkit_bundle');
    await fs.mkdir(itemTemp, { recursive: true });

    // Copy individual folder contents into subfolders of the bundle
    const subfolders = ['Dopamine-Menu-Template', 'Sensory-Audit-Workbook', 'Masking-Recovery-Pack', 'Burnout-Recovery-Roadmap', 'Weekly-Planner'];
    const sources = ['dopamine_menu', 'sensory_audit', 'masking_recovery', 'burnout_recovery', 'weekly_planner'];
    
    for (let i = 0; i < subfolders.length; i++) {
      const subDir = path.join(itemTemp, subfolders[i]);
      await fs.mkdir(subDir, { recursive: true });
      const srcDir = path.join(tempDir, sources[i]);
      const files = await fs.readdir(srcDir);
      for (const file of files) {
        await fs.copyFile(path.join(srcDir, file), path.join(subDir, file));
      }
    }

    // Also include Communication-Templates-Bundle (unzipped)
    const commsSubDir = path.join(itemTemp, 'Communication-Templates-Bundle');
    await fs.mkdir(commsSubDir, { recursive: true });
    const commsSourceDir = workspacePaths.productBundleSource;
    
    // Copy recursively
    async function copyRec(src, dest) {
      await fs.mkdir(dest, { recursive: true });
      const entries = await fs.readdir(src, { withFileTypes: true });
      for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        if (entry.isDirectory()) {
          await copyRec(srcPath, destPath);
        } else {
          await fs.copyFile(srcPath, destPath);
        }
      }
    }
    await copyRec(commsSourceDir, commsSubDir);

    // Write master README.md and copy Toolkit README PDF
    const masterReadme = `# The neurodivers³ Toolkit\n\nThank you for buying the full neurodivers³ launch set.\n\n## What is inside\n\n- **Dopamine-Menu-Template**: for when starting feels impossible.\n- **Sensory-Audit-Workbook**: for finding the environmental drains you have stopped noticing.\n- **Masking-Recovery-Pack**: for the slump after a heavy mask day.\n- **Burnout-Recovery-Roadmap**: for the longer recovery phase.\n- **Communication-Templates-Bundle**: for when words are expensive.\n- **Weekly-Planner**: for weeks where capacity changes by the day.\n\n## Notion Template Links\n\n- Dopamine Menu Template:\n  ${NOTION_LINKS.dopamineMenu}\n- Masking Recovery Pack (Mask Load Tracker):\n  ${NOTION_LINKS.maskingRecovery}\n- Weekly Planner:\n  ${NOTION_LINKS.weeklyPlanner}\n- Burnout Recovery Roadmap:\n  ${NOTION_LINKS.burnoutRoadmap}\n\n— Ollie\nneurodivers3.co.uk\n`;
    await fs.writeFile(path.join(itemTemp, 'README.md'), masterReadme, 'utf8');
    await fs.copyFile(
      path.join(pdfsDir, 'ND3__Toolkit__README__v1.0.pdf'),
      path.join(itemTemp, 'ND3__Toolkit__README__v1.0.pdf')
    );

    // Zip the entire directory structure
    const zipPath = path.join(finalProductsDir, 'ND3__TheToolkit__Launch.zip');
    // On Windows, tar handles directory structures cleanly if we specify the directory names
    execSync(`tar -acf "${zipPath}" -C "${itemTemp}" README.md ND3__Toolkit__README__v1.0.pdf Dopamine-Menu-Template Sensory-Audit-Workbook Masking-Recovery-Pack Burnout-Recovery-Roadmap Weekly-Planner Communication-Templates-Bundle`);
  }

  // Clean up temp directory
  await fs.rm(tempDir, { recursive: true, force: true });
  console.log('Packaging completed successfully!');
}

main().catch(console.error);
