const fs = require('fs');
const path = require('path');
const { exec } = require('child_process'); // added this line
const chalk = require('chalk');
const unzipper = require('unzipper');
const diff = require('diff');

function createFile(filename) {
  fs.writeFile(filename, '', (err) => {
    if (err) {
      console.error(chalk.red('Error creating file:'), err.message);
    } else {
      console.log(chalk.green(`File '${filename}' created successfully.`));
    }
  });
}

function deleteFile(filename) {
  fs.unlink(filename, (err) => {
    if (err) {
      console.error(chalk.red('Error deleting file:'), err.message);
    } else {
      console.log(chalk.green(`File '${filename}' deleted successfully.`));
    }
  });
}

function runFile(filename) {
  const filePath = path.join(process.cwd(), filename); // <-- Updated line to resolve the correct file path
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error(chalk.red(`File '${filename}' does not exist.`));
    } else {
      console.log(chalk.green(`Running file '${filename}' in the terminal:`));
      exec(`node "${filePath}"`, (error, stdout, stderr) => { // <-- Added double quotes to the file path
        if (error) {
          console.error(chalk.red('Error executing file:'), error.message);
        } else {
          console.log(chalk.cyan(stdout));
          console.error(chalk.red(stderr));
        }
      });
    }
  });
}

function downloadRepo(githubRepoLink) {
  console.log(chalk.green('Downloading the code from the GitHub repository...'));
  exec(`git clone ${githubRepoLink}`, (error, stdout, stderr) => {
    if (error) {
      console.error(chalk.red('Error downloading repository:'), error.message);
    } else {
      console.log(chalk.cyan(stdout));
      console.error(chalk.red(stderr));
    }
  });
}

function fileInfo(filename) {
  const filePath = path.join(process.cwd(), filename);
  fs.stat(filePath, (err, stats) => {
    if (err) {
      console.error(chalk.red(`File '${filename}' does not exist.`));
    } else {
      console.log(chalk.cyan(`File Info for '${filename}':`));
      console.log(chalk.yellow(`Size: ${stats.size} bytes`));
      console.log(chalk.yellow(`Last Modified: ${stats.mtime}`));
      console.log(chalk.yellow(`Permissions: ${stats.mode.toString(8).slice(-3)}`));
    }
  });
}

function unzipFile(filename) {
  const filePath = path.join(process.cwd(), filename);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error(chalk.red(`File '${filename}' does not exist.`));
    } else {
      console.log(chalk.green(`Unzipping '${filename}'...`));

      fs.createReadStream(filePath)
        .pipe(unzipper.Extract({ path: process.cwd() }))
        .on('close', () => {
          console.log(chalk.green(`File '${filename}' has been successfully unzipped.`));
        })
        .on('error', (unzipError) => {
          console.error(chalk.red(`Error unzipping file '${filename}': ${unzipError.message}`));
        });
    }
  });
}

function deleteDirectory(directoryName) {
  const directoryPath = path.join(process.cwd(), directoryName);

  fs.access(directoryPath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error(chalk.red(`Directory '${directoryName}' does not exist.`));
    } else {
      console.log(chalk.green(`Deleting directory '${directoryName}' and its contents...`));
      deleteDirectoryRecursive(directoryPath);
    }
  });
}

function deleteDirectoryRecursive(directoryPath) {
  if (fs.existsSync(directoryPath)) {
    fs.readdirSync(directoryPath).forEach((file) => {
      const curPath = path.join(directoryPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteDirectoryRecursive(curPath); // Recursive call for nested directories
      } else {
        fs.unlinkSync(curPath); // Delete the file
      }
    });
    fs.rmdirSync(directoryPath); // Delete the empty directory once its contents are removed
    console.log(chalk.green(`Directory '${path.basename(directoryPath)}' and its contents have been successfully deleted.`));
  }
}

function compareFiles(file1, file2) {
  const filePath1 = path.join(process.cwd(), file1);
  const filePath2 = path.join(process.cwd(), file2);

  fs.readFile(filePath1, 'utf8', (err, data1) => {
    if (err) {
      console.error(chalk.red(`Error reading file '${file1}': ${err.message}`));
    } else {
      fs.readFile(filePath2, 'utf8', (err, data2) => {
        if (err) {
          console.error(chalk.red(`Error reading file '${file2}': ${err.message}`));
        } else {
          console.log(chalk.green(`Comparing files '${file1}' and '${file2}':`));
          const differences = diff.diffLines(data1, data2);

          differences.forEach((part) => {
            const color = part.added ? 'green' : part.removed ? 'red' : 'grey';
            process.stdout.write(chalk[color](part.value));
          });
        }
      });
    }
  });
}

module.exports = {
  createFile,
  deleteFile,
  runFile,
  downloadRepo,
  fileInfo,
  unzipFile,
  deleteDirectory,
  compareFiles,
};