#!/usr/bin/env node
const commander = require('commander');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

const { createFile, deleteFile, runFile, downloadRepo, fileInfo } = require('./commands/fileCommands');

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
