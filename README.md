# Context Hub Template 🧠

> **A starter template for your organization's AI Knowledge Base.**

This repository is designed to be forked. It provides the standard folder structure and automation infrastructure needed to use [nocaap](https://github.com/niteshpant99/nocaap).

## 🏁 Quick Start

### 1. Fork this Repository

Click the "Use this template" or "Fork" button to create `YOUR_ORG/context-hub`.

### 2. Configure the Script

1.  Open `scripts/generate-registry.js`.
2.  Edit line 6:

    ```javascript
    const REPO_URL = "git@github.com:YOUR_ORG_NAME/context-hub.git";
    ```

3.  Commit and push.

### 3. Initialize Automation

Clone your new repo and run the setup:

```bash
git clone git@github.com:YOUR_ORG/context-hub.git
cd context-hub
npm install
```

*Running `npm install` installs the tools and activates the automatic Git hooks.*

### 4. Add Your Knowledge

We have provided sample folders (`engineering`, `product`, `general`).

1.  Delete the sample files.
2.  Create your own folders (e.g., `engineering/standards`, `sales/playbooks`).
3.  Add Markdown files.

**The Magic:** When you run `git commit`, the registry file will automatically update itself!

---

## 📂 How to Structure

We recommend organizing by **Business Domain**:

*   **`engineering/`**: Coding standards, security, architecture.
*   **`product/`**: PRD templates, roadmaps.
*   **`general/`**: HR handbook, onboarding.

You can add any folder you like - the script auto-discovers all top-level directories!

### Example Structure

```
context-hub/
├── engineering/
│   ├── standards/
│   │   ├── README.md
│   │   └── typescript.md
│   └── architecture/
│       └── README.md
├── product/
│   └── templates/
│       └── README.md
└── sales/
    └── playbooks/
        └── README.md
```

---

## 🤖 How the Automation Works

*   **Local:** A `pre-commit` hook runs `scripts/generate-registry.js` every time you commit.
*   **Remote:** A GitHub Action ensures the registry stays in sync even if you edit files on the web.

### The Registry

The script generates a `nocaap-registry.json` file that looks like this:

```json
{
  "name": "Organizational Knowledge",
  "updated_at": "2025-01-15T10:30:00.000Z",
  "contexts": [
    {
      "name": "ENGINEERING - Standards",
      "description": "Coding standards and best practices...",
      "repo": "git@github.com:YOUR_ORG/context-hub.git",
      "path": "/engineering/standards",
      "tags": ["engineering"]
    }
  ]
}
```

---

## 🔗 Using with nocaap

Once your repo is set up, your engineers can run:

```bash
npx nocaap setup
```

And paste the Raw URL of your `nocaap-registry.json` file:

```
https://raw.githubusercontent.com/YOUR_ORG/context-hub/main/nocaap-registry.json
```

That's it! They can now browse and install context packages from your knowledge base.

---

## 📋 Configuration Reference

### Ignored Folders

The script automatically ignores these folders:

- `node_modules`
- `.git`
- `.github`
- `scripts`
- `dist`
- `build`
- Any folder starting with `.`

### Adding More Ignored Folders

Edit `scripts/generate-registry.js` line 12:

```javascript
const IGNORED_DIRS = new Set([
  'node_modules', '.git', '.github', 'scripts', 'dist', 'build',
  'your-folder-to-ignore'
]);
```

---

## 🛡️ License

MIT - Feel free to use this template for your organization!
