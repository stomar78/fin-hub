const fs = require('fs');
const path = require('path');

const repoRoot = process.cwd();
const registryPath = path.join(repoRoot, 'lib', 'tool-registry.ts');
const registrySource = fs.readFileSync(registryPath, 'utf8');

const slugRegex = /slug:\s*'([^']+)'/g;
const slugs = [];
const seen = new Set();

let match;
while ((match = slugRegex.exec(registrySource))) {
  const slug = match[1];
  if (seen.has(slug)) {
    continue;
  }
  seen.add(slug);
  slugs.push(slug);
}

const baseDir = path.join(repoRoot, 'app', 'tools');

slugs.forEach((slug) => {
  const dir = path.join(baseDir, slug);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${path.relative(repoRoot, dir)}`);
  }

  const pagePath = path.join(dir, 'page.tsx');
  if (fs.existsSync(pagePath)) {
    console.log(`Skipped existing file: ${path.relative(repoRoot, pagePath)}`);
    return;
  }

  const componentName = `${slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')}ToolPage`;

  const fileContents = `import { notFound } from 'next/navigation';

import ToolPage from '@/components/tools/tool-page';
import { getToolDefinition } from '@/lib/tool-registry';

export default function ${componentName}() {
  const tool = getToolDefinition('${slug}');

  if (!tool) {
    notFound();
  }

  return <ToolPage tool={tool} />;
}
`;

  fs.writeFileSync(pagePath, fileContents, 'utf8');
  console.log(`Created file: ${path.relative(repoRoot, pagePath)}`);
});

console.log('Tool page generation complete.');
