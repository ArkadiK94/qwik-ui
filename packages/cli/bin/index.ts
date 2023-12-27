#!/usr/bin/env node

import {
  cancel,
  confirm,
  intro,
  isCancel,
  log,
  multiselect,
  outro,
  select,
  spinner,
  text,
} from '@clack/prompts';
import { getPackageManagerCommand, readJsonFile, workspaceRoot } from '@nx/devkit';

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { bold, green, red } from 'kleur/colors';
import yargs, { type CommandModule } from 'yargs';
import { QWIK_UI_CONFIG_FILENAME, styledPackagesMap } from '../src/generators';
import { StyledKit } from '../src/generators/init/styled-kit.enum';
import { QwikUIConfig } from '../types/qwik-ui-config.type';

const COMMANDS = ['init', 'add'];
const listOfCommands = COMMANDS.join(', ');

main();

async function main() {
  console.clear();

  const command = process.argv[2];

  if (!command) {
    exitWithError(
      `A command is missing, please choose one of the following commands: ${green(
        listOfCommands,
      )}`,
    );
  }

  intro('🐨 Qwik UI');

  if (command === 'init') {
    await handleInit();
  } else if (command === 'add') {
    await handleAdd();
  } else {
    exitWithError(
      `Invalid command: ${red(command)}
Please choose one of the following commands: ${green(listOfCommands)}`,
    );
  }
  outro('Successfully initialized Qwik UI! 🎉');
}

async function handleInit() {
  const InitCommand: CommandModule = {
    command: 'init',
    describe: 'Initialize Qwik UI',
    builder: (yargs) =>
      yargs
        .option('projectRoot', {
          description: 'The root of the project (default: "/")',
          type: 'string',
        })
        .option('styledKit', {
          description: 'Preferred styled kit',
          type: 'string',
          choices: [StyledKit.FLUFFY, StyledKit.MINIMAL],
        })
        .option('uiComponentsPath', {
          description: 'Generated components folder',
          type: 'string',
        })
        .option('rootCssPath', {
          description:
            'Global css file location (where you defined your tailwind directives)',
          type: 'string',
        }),
    handler: () => {},
  };

  const args = await parseCommands(InitCommand);

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  await installNxIfNeeded();

  interface InitConfig {
    projectRoot?: string;
    styledKit?: StyledKit;
    uiComponentsPath?: string;
    rootCssPath?: string;
  }

  const config: InitConfig = {
    projectRoot: args['projectRoot'] as string,
    styledKit: args['styledKit'] as StyledKit,
    uiComponentsPath: args['uiComponentsPath'] as string,
    rootCssPath: args['rootCssPath'] as string,
  };

  if (!config.projectRoot) {
    config.projectRoot = cancelable(
      await text({
        message: 'Specify the root of the project (leave empty for "/")',
        initialValue: '/',
      }),
    );
  }

  if (!config.styledKit) {
    config.styledKit = cancelable(
      await select({
        message: 'What is your preferred styled kit?',

        options: [
          { label: 'Fluffy', value: StyledKit.FLUFFY },
          { label: 'Minimal', value: StyledKit.MINIMAL },
        ],
        initialValue: 'fluffy',
      }),
    );
  }

  if (!config.uiComponentsPath) {
    config.uiComponentsPath = cancelable(
      await text({
        message: 'UI components folder',
        initialValue: 'src/components/ui',
      }),
    );
  }

  if (!config.rootCssPath) {
    config.rootCssPath = await collectFileLocationFromUser({
      message:
        'Your global css file location (where you defined your tailwind directives)',
      errorMessageName: 'Global css file',
      initialValue: 'src/global.css',
    });
  }

  // INSTALL TAILWIND IF NEEDED
  const tailwindInstalled = cancelable(
    await confirm({
      message: 'Do you already have Tailwind installed? (required)',
      initialValue: true,
    }),
  );

  if (!tailwindInstalled) {
    execSync(`${getPackageManagerCommand().exec} qwik add tailwind`, {
      stdio: 'inherit',
    });
  }

  // ADD QWIK UI CLI TO DEPENDENCIES
  execSync(`${getPackageManagerCommand().add} qwik-ui@latest`, {
    stdio: 'inherit',
  });

  // CREATE CONFIG FILE
  execSync(
    `${
      getPackageManagerCommand().exec
    } nx g qwik-ui:init --interactive false --project-root=${
      config.projectRoot
    } --ui-components-path=${config.uiComponentsPath} --styled-kit=${config.styledKit}`,
    {
      stdio: 'inherit',
    },
  );

  // INSTALL STYLED KIT
  const styledPackage = styledPackagesMap[config.styledKit];

  execSync(`${getPackageManagerCommand().add} ${styledPackage}@latest`, {
    stdio: 'inherit',
  });

  // SETUP TAILWIND
  execSync(
    `${
      getPackageManagerCommand().exec
    } nx g ${styledPackage}:setup-tailwind --interactive false --project-root=${
      config.projectRoot
    }  --root-css-path=${config.rootCssPath}`,
    {
      stdio: 'inherit',
    },
  );

  handleAdd(config.projectRoot);
}

async function installNxIfNeeded() {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  // const nxVersion = require('../package.json').dependencies['@nx/devkit'];

  if (existsSync('nx.json')) {
    log.info('seems like nx.json already exists. cool!');
  } else {
    // const haveNxInstalled = cancelable(
    //   await confirm({
    //     message: 'Do you already have Nx installed? (required)',
    //     initialValue: false,
    //   }),
    // );

    // if (!haveNxInstalled) {
    const initSpinner = spinner();
    log.info('Installing Nx...');
    initSpinner.start('Installing Nx...');
    execSync(`${getPackageManagerCommand().add} nx@latest`, {
      stdio: 'inherit',
    });
    execSync(`${getPackageManagerCommand().exec} nx init --interactive false`, {
      stdio: 'inherit',
    });
    initSpinner.stop('Installed Nx!');
  }
  log.success('nx init done');
  // }
}

async function handleAdd(projectRoot?: string) {
  if (!existsSync(QWIK_UI_CONFIG_FILENAME)) {
    exitWithError(
      `${QWIK_UI_CONFIG_FILENAME} not found, please run ${green('qwik-ui init')} first`,
    );
  }
  const config = await readJsonFile<QwikUIConfig>(QWIK_UI_CONFIG_FILENAME);
  const styledPackage = styledPackagesMap[config.styledKit];

  // read config file to collect components and add to description below

  const componentsJsonPath = require.resolve(`${styledPackage}/components.json`);
  const componentsJson = readJsonFile<{
    componentsRoot: string;
    components: {
      displayName: string;
      type: string;
      componentFolder: string;
      files: string[];
    }[];
  }>(componentsJsonPath);

  const possibleComponents = componentsJson.components;
  const possibleComponentNames = componentsJson.components.map((c) => c.displayName);
  const componentsMap = componentsJson.components.reduce((acc, curr) => {
    acc[curr.displayName] = curr;
    return acc;
  }, {} as Record<string, (typeof componentsJson.components)[0]>);

  const AddCommand: CommandModule = {
    command: 'add <components>',

    describe: 'Add components to your project',
    builder: (yargs) =>
      yargs
        .positional('components', {
          description: `Choose which components to add
Options: [${possibleComponentNames.join(', ')}]`,
          type: 'string',
          coerce: (components) => componentTypesFromString(components),
        })
        .option('projectRoot', {
          description: 'The root of the project (default: "/")',
          type: 'string',
        }),
    handler: () => {},
  };

  function componentTypesFromString(components: string) {
    return components.split(',').map((c) => {
      return componentsMap[c.trim()].type;
    });
  }

  const args = parseCommands(AddCommand);

  if (!projectRoot && !args['projectRoot']) {
    projectRoot = cancelable(
      await text({
        message: 'Specify the root of the project (leave empty for "/")',
        initialValue: '/',
      }),
    );
  }

  // CHOOSE COMPONENTS TO ADD

  let componentsToAdd = args['components'] as string[];
  if (!componentsToAdd) {
    componentsToAdd = cancelable(
      await multiselect({
        message: `Choose which components to add`,
        options: possibleComponents.map((c) => ({
          label: c.displayName,
          value: c.type,
        })),
      }),
    );
  }

  // GENERATE COMPONENTS
  execSync(
    `${
      getPackageManagerCommand().exec
    } nx g ${styledPackage}:component ${componentsToAdd.join(
      ',',
    )} --interactive false --project-root=${projectRoot}`,
    {
      stdio: 'inherit',
    },
  );
}

function parseCommands(command: CommandModule) {
  return yargs(process.argv.slice(2))
    .strict()
    .scriptName('qwik-ui')
    .usage(bold('Usage: $0 <command> [options]'))
    .demandCommand(1)
    .command(command)
    .help().argv;
}

interface FilePromptInfo {
  message: string;
  errorMessageName: string;
  initialValue?: string;
}

async function collectFileLocationFromUser(config: FilePromptInfo) {
  const filePath = cancelable(
    await text({
      message: config.message,
      initialValue: config.initialValue,
    }),
  );

  if (!existsSync(filePath)) {
    log.error(`${config.errorMessageName} not found at ${filePath}, want to try again?`);
    return collectFileLocationFromUser({ ...config, initialValue: filePath });
  }
  return filePath;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function cancelable(result: any) {
  if (isCancel(result)) {
    cancel('Operation canceled');
    process.exit(0);
  }
  return result;
}

// function capitalizeFirstLetter(word: string) {
//   return word.charAt(0).toUpperCase() + word.slice(1);
// }

function exitWithError(message: string) {
  log.error(message);
  cancel();
  process.exit(1);
}

export function getCwd(): string {
  return process.env.INIT_CWD?.startsWith(workspaceRoot)
    ? process.env.INIT_CWD
    : process.cwd();
}
