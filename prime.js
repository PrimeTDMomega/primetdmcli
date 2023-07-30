#!/usr/bin/env node
const commander = require('commander');
const { createFile, deleteFile, runFile } = require('./commands/fileCommands');

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
  .command('help')
  .description('Sends the available commands')
  .action(() => {
    console.log('Usage:');
    console.log('  prime add <filename>');
    console.log('  prime remove <filename>');
    console.log('  prime run <filename>');
  });

commander.parse(process.argv);
