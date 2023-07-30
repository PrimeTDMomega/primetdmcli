#!/usr/bin/env node
const commander = require('commander');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

const {
  createFile,
  deleteFile,
  runFile,
  downloadRepo,
  fileInfo,
  viewFileMetadata, 
} = require('./commands/fileCommands');

const packageJson = require('./package.json');


commander.version('1.0.0');
  

commander
  .command('add <filename>')
  .description('Creates a file')
  .action(createFile);

commander
  .command('remove <filename>')
  .description('Deletes a file')
  .action(deleteFile);

commander
  .command('run <filename>')
  .description('Runs the specified file in the terminal')
  .action(runFile);

commander
  .command('download <githubRepoLink>')
  .description('Downloads the code from the GitHub repository')
  .action(downloadRepo);

  commander
  .command('info <filename>')
  .description('Displays file size, last modified date, and permissions')
  .action(fileInfo);

  commander
  .command('version')
  .description('Display the current version of PrimeTDMCLI')
  .action(() => {
    console.log(chalk.green(`PrimeTDMCLI Version: ${packageJson.version}`));
  });

  commander
  .command('move <filename> <directory>')
  .description('Move a file to the specified directory')
  .action((filename, directory) => {
    const currentPath = path.join(process.cwd(), filename);
    const targetPath = path.join(process.cwd(), directory, filename);

    fs.access(currentPath, fs.constants.F_OK, (err) => {
      if (err) {
        console.error(chalk.red(`File '${filename}' does not exist in the current path.`));
      } else {
        // Move the file to the target path
        fs.rename(currentPath, targetPath, (moveErr) => {
          if (moveErr) {
            console.error(chalk.red(`Error moving file '${filename}': ${moveErr.message}`));
          } else {
            console.log(chalk.green(`File '${filename}' moved to '${directory}' successfully.`));
          }
        });
      }
    });
  });

  function caesarEncrypt(text, shift) {
    let result = '';
    for (let i = 0; i < text.length; i++) {
      let char = text[i];
      if (char.match(/[a-z]/i)) {
        const code = text.charCodeAt(i);
        if (code >= 65 && code <= 90) {
          char = String.fromCharCode(((code - 65 + shift) % 26) + 65);
        } else if (code >= 97 && code <= 122) {
          char = String.fromCharCode(((code - 97 + shift) % 26) + 97);
        }
      }
      result += char;
    }
    return result;
  }

  function caesarDecrypt(text, shift) {
    return caesarEncrypt(text, 26 - shift);
  }

  commander
  .command('encrypt <filename>')
  .description('Encrypts the contents of the specified file using Caesar cipher')
  .action((filename) => {
    const filePath = path.join(process.cwd(), filename);
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error(chalk.red(`Error reading file '${filename}': ${err.message}`));
      } else {
        const encryptedData = caesarEncrypt(data, 3); // You can choose any shift value
        fs.writeFile(filePath, encryptedData, 'utf8', (writeErr) => {
          if (writeErr) {
            console.error(chalk.red(`Error encrypting file '${filename}': ${writeErr.message}`));
          } else {
            console.log(chalk.green(`File '${filename}' encrypted successfully.`));
          }
        });
      }
    });
  });

  commander
  .command('decrypt <filename>')
  .description('Decrypts the contents of the specified file encrypted using Caesar cipher')
  .action((filename) => {
    const filePath = path.join(process.cwd(), filename);
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error(chalk.red(`Error reading file '${filename}': ${err.message}`));
      } else {
        const decryptedData = caesarDecrypt(data, 3); // You need to use the same shift value as used during encryption
        fs.writeFile(filePath, decryptedData, 'utf8', (writeErr) => {
          if (writeErr) {
            console.error(chalk.red(`Error decrypting file '${filename}': ${writeErr.message}`));
          } else {
            console.log(chalk.green(`File '${filename}' decrypted successfully.`));
          }
        });
      }
    });
  });

commander
  .command('help')
  .description('Sends the available commands')
  .action(() => {
    console.log('Usage:');
    console.log('  prime add <filename>');
    console.log('  prime remove <filename>');
    console.log('  prime run <filename>');
    console.log('  prime download <githubRepoLink>');
    console.log('  prime info <filename>');
    console.log('  prime move <fileName> <directory>')
    console.log('  prime help')
  });

commander.parse(process.argv);
