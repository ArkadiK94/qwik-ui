import { component$, Slot } from '@builder.io/qwik';
import {
  Combobox,
  ComboboxControl,
  ComboboxInput,
  ComboboxLabel,
  ComboboxListbox,
  ComboboxPortal,
  ComboboxTrigger,
} from '@qwik-ui/headless';

import {
  ComboboxOption,
  type ResolvedOption,
} from '../../../../../../../../packages/kit-headless/src/components/combobox';

import { PreviewCodeExample } from '../../../_components/preview-code-example/preview-code-example';

const stringsExample = [
  'Caleb',
  'Olivia',
  'James',
  'Ava',
  'Noah',
  'Emma',
  'Oliver',
  'Amelia',
  'Theodore',
  'Elizabeth',
];

type Trainer = {
  testValue: string;
  testLabel: string;
  disabled: boolean;
};

const objectExample: Array<Trainer> = [
  { testValue: 'alice', testLabel: 'Alice', disabled: true },
  { testValue: 'joana', testLabel: 'Joana', disabled: true },
  { testValue: 'malcolm', testLabel: 'Malcolm', disabled: false },
  { testValue: 'zack', testLabel: 'Zack', disabled: true },
  { testValue: 'brian', testLabel: 'Brian', disabled: false },
  { testValue: 'ryan', testLabel: 'Ryan', disabled: false },
  { testValue: 'joe', testLabel: 'Joe', disabled: false },
  { testValue: 'randy', testLabel: 'Randy', disabled: false },
  { testValue: 'david', testLabel: 'David', disabled: true },
  { testValue: 'joseph', testLabel: 'Joseph', disabled: false },
];

export const HeroExample = component$(() => {
  return (
    <>
      <PreviewCodeExample>
        <div class="flex flex-col gap-4" q:slot="actualComponent">
          <Combobox<Trainer>
            options={objectExample}
            optionValueKey="testValue"
            optionLabelKey="testLabel"
            optionDisabledKey="disabled"
            renderOption$={(resolved, index: number) => (
              <ComboboxOption
                key={resolved.key}
                resolved={resolved}
                index={index}
                style={resolved.disabled ? { color: 'gray' } : {}}
                class="rounded-sm px-2 hover:bg-[#496080] aria-selected:bg-[#496080]  border-2 border-transparent aria-selected:border-[#abbbce] group"
              >
                <span class="block group-aria-selected:translate-x-[3px] transition-transform duration-350">
                  {resolved.option.testLabel}
                </span>
              </ComboboxOption>
            )}
            class="relative"
          >
            <ComboboxLabel class=" font-semibold dark:text-white text-[#333333]">
              Personal Trainers ⚡
            </ComboboxLabel>
            <ComboboxControl class="bg-[#1f2532] flex items-center rounded-sm border-[#7d95b3] border-[1px] relative">
              <ComboboxInput
                placeholder="Jim"
                class="px-2 w-44 bg-inherit px-d2 pr-6 text-white"
              />
              <ComboboxTrigger class="w-6 h-6 group absolute right-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke-width="2"
                  class="stroke-white group-aria-expanded:-rotate-180 transition-transform duration-[450ms]"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </ComboboxTrigger>
            </ComboboxControl>
            <ComboboxPortal>
              <ComboboxListbox
                position="bottom"
                gap={8}
                class="text-white w-44 bg-[#1f2532] px-4 py-2 rounded-sm border-[#7d95b3] border-[1px]"
              />
            </ComboboxPortal>
          </Combobox>
        </div>

        <div q:slot="codeExample">
          <Slot />
        </div>
      </PreviewCodeExample>
    </>
  );
});

export const StringCombobox = component$(() => {
  const fruits = [
    'Apple',
    'Apricot',
    'Avocado 🥑',
    'Banana',
    'Bilberry',
    'Blackberry',
    'Blackcurrant',
    'Blueberry',
    'Boysenberry',
    'Currant',
    'Cherry',
    'Coconut',
    'Cranberry',
    'Cucumber',
  ];

  return (
    <PreviewCodeExample>
      <div class="flex flex-col items-center gap-4 p-4" q:slot="actualComponent">
        <div class=" text-left">
          This uses a custom filter to only filter from the beginning of the options.
        </div>
        <div>
          <Combobox
            class="w-fit"
            options={fruits}
            defaultLabel="Currant"
            filter$={(value: string, options) =>
              options.filter(({ option }) => {
                return option.toLowerCase().startsWith(value.toLowerCase());
              })
            }
            renderOption$={(resolved: ResolvedOption, index: number) => (
              <ComboboxOption
                key={resolved.key}
                class="rounded-sm px-2 hover:bg-[#496080] aria-selected:bg-[#496080]  border-2 border-transparent aria-selected:border-[#abbbce] group"
                index={index}
                resolved={resolved}
              >
                {resolved.label}
              </ComboboxOption>
            )}
          >
            <ComboboxLabel class=" font-semibold dark:text-white text-[#333333]">
              Fruits 🍓
            </ComboboxLabel>
            <ComboboxControl class="bg-[#1f2532] flex items-center rounded-sm border-[#7d95b3] border-[1px] relative">
              <ComboboxInput
                class="px-2 w-44 bg-inherit px-d2 pr-6 text-white"
                placeholder="Papaya"
              />
              <ComboboxTrigger class="w-6 h-6 group absolute right-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  class="stroke-white group-aria-expanded:-rotate-180 transition-transform duration-[450ms]"
                  stroke-linecap="round"
                  stroke-width="2"
                  stroke-linejoin="round"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </ComboboxTrigger>
            </ComboboxControl>
            <ComboboxPortal>
              <ComboboxListbox class="text-white w-44 bg-[#1f2532] px-4 py-2 rounded-sm border-[#7d95b3] border-[1px]" />
            </ComboboxPortal>
          </Combobox>
        </div>
      </div>

      <div q:slot="codeExample">
        <Slot />
      </div>
    </PreviewCodeExample>
  );
});

// Using context example.

import { createContextId, useContext, useContextProvider } from '@builder.io/qwik';

// Create a context ID
export const AnimalContext = createContextId<string[]>('animal-context');

export const ParentComponent = component$(() => {
  const animals = ['Armadillo', 'Donkey', 'Baboon', 'Badger', 'Barracuda', 'Bat', 'Bear'];
  // Provide the animals array to the context under the context ID
  useContextProvider(AnimalContext, animals);

  return <ContextExample />;
});

export const ContextExample = component$(() => {
  const animals = useContext(AnimalContext);

  return (
    <PreviewCodeExample>
      <div class="flex flex-col gap-4" q:slot="actualComponent">
        <Combobox
          options={animals}
          renderOption$={(resolved: ResolvedOption, index: number) => (
            <ComboboxOption
              index={index}
              resolved={resolved}
              class="rounded-sm px-2 hover:bg-[#496080] aria-selected:bg-[#496080]  border-2 border-transparent aria-selected:border-[#abbbce] group"
            >
              <span class="block group-aria-selected:translate-x-[3px] transition-transform duration-350">
                {resolved.label}
              </span>
            </ComboboxOption>
          )}
          class="relative"
        >
          <ComboboxLabel class="font-semibold dark:text-white text-[#333333]">
            Animals 🐖
          </ComboboxLabel>
          <ComboboxControl class="bg-[#1f2532] flex items-center rounded-sm border-[#7d95b3] border-[1px] relative">
            <ComboboxInput class="px-2 w-44 bg-inherit px-d2 pr-6 text-white" />
            <ComboboxTrigger class="w-6 h-6 group absolute right-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke-width="2"
                class="stroke-white group-aria-expanded:-rotate-180 transition-transform duration-[450ms]"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </ComboboxTrigger>
          </ComboboxControl>
          <ComboboxPortal>
            <ComboboxListbox class="text-white w-44 bg-[#1f2532] px-4 py-2 rounded-sm border-[#7d95b3] border-[1px]" />
          </ComboboxPortal>
        </Combobox>
      </div>

      <div q:slot="codeExample">
        <Slot />
      </div>
    </PreviewCodeExample>
  );
});
