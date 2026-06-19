import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const projectRoot = path.resolve(__dirname, '..');

export const workspacePaths = {
  workspaceRoot: path.join(projectRoot, 'workspace'),
  contentRoot: path.join(projectRoot, 'workspace', 'content'),
  mediaRoot: path.join(projectRoot, 'workspace', 'media'),
  artifactsRoot: path.join(projectRoot, 'workspace', 'artifacts'),
  productPdfs: path.join(projectRoot, 'workspace', 'content', 'product-pdfs'),
  finalProducts: path.join(projectRoot, 'workspace', 'content', 'final-products'),
  productBundleSource: path.join(projectRoot, 'workspace', 'content', 'final-products', 'Communication-Templates-Bundle'),
  blogDrafts: path.join(projectRoot, 'workspace', 'content', 'Master Blog Posts.md'),
  styleGuide: path.join(projectRoot, 'workspace', 'content', 'neurodivers3_master_style_guide.md'),
  templatesRoot: path.join(projectRoot, 'workspace', 'content', 'templates'),
  designAssets: path.join(projectRoot, 'workspace', 'media', 'polar-store-design-assets'),
  previewVideos: path.join(projectRoot, 'workspace', 'media', 'product-preview-videos'),
  audits: path.join(projectRoot, 'workspace', 'artifacts', 'audit'),
  screenshots: path.join(projectRoot, 'workspace', 'artifacts', 'screenshots'),
  tempStore: path.join(projectRoot, 'workspace', 'artifacts', 'temp_store'),
  packagingTemp: path.join(projectRoot, 'workspace', 'artifacts', 'temp_packaging'),
  auditReport: path.join(projectRoot, 'workspace', 'artifacts', 'AUDIT_REPORT.md'),
  buildOutput: path.join(projectRoot, 'workspace', 'artifacts', 'build-output.txt')
};