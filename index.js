/**
 * FileVersion main class
 * 
 * Need update file version or not by files extensions
 * 
 * TODO::use webpack
 * 
 */
 class FileVersion {

    filePath = './file-version.json';
    allowedExtensions = [];
    addToGit = false;
    force = false;

    constructor(options = {}) {

        if (options?.allowedExtensions) {
            this.allowedExtensions = options.allowedExtensions;
        } else {
            this.allowedExtensions = [
                '.js',
                '.css',
                '.scss',
                '.sass'
            ];
        }

        if (options?.filePath) {
            this.filePath = options.filePath;
        }

        if (options?.addToGit) {
            this.addToGit = options.addToGit;
        }

        if (process.argv.includes('--onlyUpdate')) {
            this.addToGit = false;
        }

        if (process.argv.includes('--force')) {
            this.force = true;
        }

    }

    updateVersion() {

        const fs = require('fs');
        const { v4: uuidv4 } = require('uuid');

        let fileExist = fs.existsSync(this.filePath);

        let version = uuidv4();        
        let json = JSON.stringify({ version: version } );

        console.log({version});

        if (!fileExist) {
            fs.writeFile(this.filePath, json, () => {
                process.exit(0);
            });

            console.log('File version is changed!');

        } else {

            fs.readFile(this.filePath, 'utf-8', (err, data) => {
                if (err) {
                    console.log({err});
                    process.exit(1);
                }
            
                fs.writeFile(this.filePath, json, () => {
                    process.exit(0);
                });
            
                console.log('File version is updated!');
            
            });

        }

        return true;

    }

    update() {

        const { exec } = require('child_process');
        exec('git diff --relative --name-status --diff-filter=ACDMRTUXB --staged', (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }

            let files = stdout.toString().split('\n');
            files = files.slice(0,-1); // While splitting there is an empty string at last position.

            let needChange = this.needUpdateCallback(files);

            if (needChange) {
                this.updateVersion();
                this.gitAdd();
            } else {
                console.log('File version does not need to be updated!');
            }

        });

    }

    needUpdateCallback(filesInStage) {

        if (this.force) {
            return true;
        }

        if (!filesInStage.length) {
            return false;
        }
        
        return filesInStage.some((fileName) => {
            return this.allowedExtensions.some((ext) => {
                return fileName.includes(ext);
            });
        });
        
    }

    gitAdd() {

        if (!this.addToGit) {
            return false;
        }

        const { exec } = require('child_process');
        const command = `git add ${this.filePath}`;
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`git add exec error: ${error}`);
                return;
            }

        });

        console.log('File version added to stage!');

    }

}

module.exports = FileVersion;
