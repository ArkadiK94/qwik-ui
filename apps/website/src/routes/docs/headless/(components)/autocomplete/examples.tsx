import { component$, Slot } from '@builder.io/qwik';
import {
  AutocompleteRoot,
  AutocompleteLabel,
  AutocompleteTrigger,
  AutocompleteInput,
  AutocompleteButton,
  AutocompleteListbox,
  AutocompleteOption,
} from '@qwik-ui/headless';
import { PreviewCodeExample } from '../../../../../components/preview-code-example/preview-code-example';

const trainers = [
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

export const Example01 = component$(() => {
  return (
    <PreviewCodeExample>
      <div q:slot="actualComponent">
        <AutocompleteRoot class="relative text-white">
          <AutocompleteLabel class="text-inherit font-semibold">
            Personal Trainers ⚡
          </AutocompleteLabel>
          <AutocompleteTrigger class="bg-[#1f2532] flex items-center rounded-sm border-[#7d95b3] border-[1px] relative">
            <AutocompleteInput class="w-44 bg-inherit px-2 pr-6" />
            <AutocompleteButton class="w-6 h-6 group absolute right-0">
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
            </AutocompleteButton>
          </AutocompleteTrigger>
          <AutocompleteListbox class="w-full bg-[#1f2532] px-4 py-2 mt-2 rounded-sm border-[#7d95b3] border-[1px]">
            {trainers.map((trainer, index) => (
              <AutocompleteOption
                optionValue={trainer}
                key={index}
                class="rounded-sm px-2 hover:bg-[#496080] focus:bg-[#496080]"
              >
                {trainer}
              </AutocompleteOption>
            ))}
          </AutocompleteListbox>
        </AutocompleteRoot>
      </div>

      <div q:slot="codeExample">
        <Slot />
      </div>
    </PreviewCodeExample>
  );
});

export const Example02 = component$(() => {
  return <PreviewCodeExample></PreviewCodeExample>;
});

export const Example03 = component$(() => {
  return <PreviewCodeExample></PreviewCodeExample>;
});
