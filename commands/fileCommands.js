const fs = require('fs');
const path = require('path');
const { exec } = require('child_process'); // added this line
const chalk = require('chalk');

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

module.exports = {
  createFile,
  deleteFile,
  runFile,
  downloadRepo, 
};