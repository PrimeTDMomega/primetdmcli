#!/usr/bin/env node
const commander = require('commander');
const { createFile, deleteFile } = require('./commands/fileCommands');

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
  .command('help')
  .description('Sends the 2 commands above')
  .action(() => {
    console.log('Usage:');
    console.log('  prime add <filename>');
    console.log('  prime remove <filename>');
  });

commander.parse(process.argv);
