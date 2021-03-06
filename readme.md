# File Version for monolith project

## Install package
Run `npm install -D ufv`

## Set up your script
Create your own script for updating file version with options:
```js
const FileVersion  = require('ufv');

const ALLOWED_EXTENSIONS = [
    '.js',
    '.css',
    '.scss',
    '.sass'
    ];

const options = {
    allowedExtensions: ALLOWED_EXTENSIONS,
    filePath: './file-version.json',
    addToGit: true
};

(new FileVersion(options)).update();

```

## Add scripts to `package.json`:
```json
"scripts": {
    "ufv": "node path/to/your-ufv-script.js",
    "ufv-only": "node path/to/your-ufv-script.js --onlyUpdate",
    "ufv-force": "node path/to/your-ufv-script.js --force --onlyUpdate",
    "ufv-git-hook": "npm run ufv"
  }
```

## Add git pre commit

Install package `npm install -D pre-commit`

And then add to `package.json`:
```json
"pre-commit": [
    "...",
    "ufv-git-hook"
]
```