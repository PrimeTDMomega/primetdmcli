const fs = require('fs');
const path = require('path');
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

module.exports = {
  createFile,
  deleteFile,
};
