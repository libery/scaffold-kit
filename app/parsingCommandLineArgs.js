const commandLineArgs = require('command-line-args');
const kebabCase = require('lodash/kebabCase');
const concat = require('lodash/concat');
const map = require('lodash/map');
const pick = require('lodash/pick');
const assign = require('lodash/assign');

const basicOptions = [
  { name: 'version', alias: 'v', type: Boolean, defaultValue: false },
  { name: 'help', alias: 'h', type: Boolean, defaultValue: false }
];

const convertOptions = (options, savedOptions) => {
  return map(options, (option) => {
    const sanitized = pick(option, [
      'name',
      'type',
      'alias',
      'multiple',
      'lazyMultiple',
      'defaultOption',
      'defaultValue',
      'group'
    ]);
    if (savedOptions[sanitized.name] !== undefined) {
      sanitized.defaultValue = savedOptions[sanitized.name];
    }
    sanitized.name = kebabCase(option.name);
    return sanitized;
  });
};

const parsingCommandLineArgs = (
  argv = process.argv, optionList, savedOptions
) => {
  const parsed = commandLineArgs(
    concat(basicOptions, convertOptions(optionList, savedOptions)),
    {
      camelCase: true,
      partial: true,
      argv
    }
  );
  const { _unknown: [ command, ...args ], ...options } =
    assign({ _unknown: [] }, parsed);
  return { command, args, options };
};

module.exports = parsingCommandLineArgs;
