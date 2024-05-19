import { component$, useSignal, useStyles$ } from '@builder.io/qwik';
import { Checkbox, CheckboxIndicator } from '@qwik-ui/headless';
export default component$(() => {
  return (
    <>
      <Checkbox class="flex items-center gap-3 border-2 border-black p-2 ">
        <CheckboxIndicator class="flex h-[25px] w-[25px] items-center justify-center bg-slate-600">
          ✅
        </CheckboxIndicator>
        I have read the README file
      </Checkbox>
    </>
  );
});
