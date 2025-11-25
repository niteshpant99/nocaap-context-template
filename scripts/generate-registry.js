const fs = require('fs');
const path = require('path');

// --- CONFIGURATION ---
// TODO: Update this to your organization's repo URL
const REPO_URL = "git@github.com:YOUR_ORG/context-hub.git"; 
const ROOT_DIR = path.resolve(__dirname, '..');
const REGISTRY_FILE = path.join(ROOT_DIR, 'nocaap-registry.json');

// Folders to IGNORE when scanning (System folders)
const IGNORED_DIRS = new Set([
  'node_modules', '.git', '.github', 'scripts', 'dist', 'build'
]);
// ---------------------

function getAllDirectories(dirPath, arrayOfDirectories = []) {
  if (!fs.existsSync(dirPath)) return arrayOfDirectories;

  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const fullPath = path.join(dirPath, file);

    // Skip ignored folders
    if (IGNORED_DIRS.has(file) || file.startsWith('.')) return;

    if (fs.statSync(fullPath).isDirectory()) {
        const hasMarkdown = fs.readdirSync(fullPath).some(f => f.endsWith('.md'));
        if (hasMarkdown) {
            arrayOfDirectories.push(fullPath);
        }
        getAllDirectories(fullPath, arrayOfDirectories);
    }
  });

  return arrayOfDirectories;
}

function generateRegistry() {
  const contexts = [];
  
  // 1. Auto-scan all top-level folders
  const topLevelDirs = fs.readdirSync(ROOT_DIR).filter(file => {
      const fullPath = path.join(ROOT_DIR, file);
      return fs.statSync(fullPath).isDirectory() && !IGNORED_DIRS.has(file) && !file.startsWith('.');
  });

  topLevelDirs.forEach(domain => {
    const domainPath = path.join(ROOT_DIR, domain);
    const subDirs = getAllDirectories(domainPath);

    subDirs.forEach(dirPath => {
        const relPath = path.relative(ROOT_DIR, dirPath);
        const folderName = path.basename(dirPath);
        
        // Pretty Name: "api-standards" -> "Api Standards"
        const name = folderName.split('-')
            .map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

        // Description from README
        let description = `Context for ${name}`;
        const readmePath = path.join(dirPath, 'README.md');
        if (fs.existsSync(readmePath)) {
            let content = fs.readFileSync(readmePath, 'utf-8');
            
            // Remove Frontmatter if it exists (content between --- and ---)
            content = content.replace(/^---[\s\S]*?---\s*/, '');
            
            // Now match the first non-header line
            const match = content.match(/^(?![#\s]).+/m);
            if (match) description = match[0].slice(0, 80).trim() + "...";
        }

        contexts.push({
            name: `${domain.toUpperCase()} - ${name}`,
            description: description,
            repo: REPO_URL,
            path: `/${relPath.replace(/\\/g, '/')}`,
            tags: [domain]
        });
    });
  });

  // Deterministic Check
  let oldRegistry = null;
  if (fs.existsSync(REGISTRY_FILE)) {
    try { oldRegistry = JSON.parse(fs.readFileSync(REGISTRY_FILE, 'utf-8')); } catch(e) {}
  }

  const newHash = JSON.stringify(contexts);
  const oldHash = oldRegistry ? JSON.stringify(oldRegistry.contexts) : "";

  if (newHash === oldHash) {
    console.log("⚡ No content changes. Skipping registry update.");
    return;
  }

  const registry = {
    name: "Organizational Knowledge",
    updated_at: new Date().toISOString(),
    contexts: contexts
  };

  fs.writeFileSync(REGISTRY_FILE, JSON.stringify(registry, null, 2));
  console.log(`✅ Registry updated with ${contexts.length} contexts.`);
}

generateRegistry();

