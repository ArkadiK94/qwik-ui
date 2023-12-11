import { component$, Slot, QwikIntrinsicElements } from '@builder.io/qwik';

export enum NoteStatus {
  Info = 'info',
  Warning = 'warning',
  Caution = 'caution',
}

export interface NoteProps {
  status?: NoteStatus;
}

function getIconByStatus(status?: NoteStatus) {
  switch (status) {
    case NoteStatus.Info:
      return <InfoIcon class="text-secondary" />;
    case NoteStatus.Warning:
      return <WarningIcon class="text-yellow-500" />;
    case NoteStatus.Caution:
      return <CautionIcon class="text-destructive" />;

    default:
      return <InfoIcon class="text-secondary" />;
  }
}

function getBackgroundByStatus(status?: NoteStatus) {
  switch (status) {
    case NoteStatus.Info:
      return 'bg-secondary/20 border-secondary border-l-2 mb-4 rounded-lg block';
    case NoteStatus.Warning:
      return 'bg-[#FBF0CD] dark:bg-[#3B3623] border-yellow-500 border-l-2 dark:border-yellow-500 mb-4 rounded-lg block';
    case NoteStatus.Caution:
      return 'bg-destructive/20 border-desctructive border-l-2 mb-4 rounded-lg block';
    default:
      return 'bg-secondary/20 border-secondary border-l-2 mb-4 rounded-lg block';
  }
}

export const Note = component$<NoteProps>(({ status, ...props }) => {
  return (
    <aside
      class={`${getBackgroundByStatus(
        status ?? NoteStatus.Info,
      )} note-link relative mx-[-24px] px-5 py-4 lg:mx-[-32px] lg:px-8 lg:py-6 `}
    >
      <div class="absolute left-[-17.5px] top-[-17.5px] hidden h-8 w-8 rounded-full bg-white dark:bg-slate-900 lg:block">
        <div class="flex h-8 w-8 items-center justify-center ">
          {getIconByStatus(status ?? NoteStatus.Info)}
        </div>
      </div>
      <blockquote {...props}>
        <Slot />
      </blockquote>
    </aside>
  );
});

export function InfoIcon(props: QwikIntrinsicElements['svg'], key: string) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 256 256"
      key={key}
      {...props}
    >
      <g fill="currentColor">
        <path d="M224 128a96 96 0 1 1-96-96a96 96 0 0 1 96 96Z" opacity=".2"></path>
        <path d="M144 176a8 8 0 0 1-8 8a16 16 0 0 1-16-16v-40a8 8 0 0 1 0-16a16 16 0 0 1 16 16v40a8 8 0 0 1 8 8Zm88-48A104 104 0 1 1 128 24a104.11 104.11 0 0 1 104 104Zm-16 0a88 88 0 1 0-88 88a88.1 88.1 0 0 0 88-88Zm-92-32a12 12 0 1 0-12-12a12 12 0 0 0 12 12Z"></path>
      </g>
    </svg>
  );
}

export function WarningIcon(props: QwikIntrinsicElements['svg'], key: string) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 256 256"
      {...props}
      key={key}
    >
      <g fill="currentColor">
        <path d="M224 128a96 96 0 1 1-96-96a96 96 0 0 1 96 96Z" opacity=".2"></path>
        <path d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24Zm0 192a88 88 0 1 1 88-88a88.1 88.1 0 0 1-88 88Zm-8-80V80a8 8 0 0 1 16 0v56a8 8 0 0 1-16 0Zm20 36a12 12 0 1 1-12-12a12 12 0 0 1 12 12Z"></path>
      </g>
    </svg>
  );
}

export function CautionIcon(props: QwikIntrinsicElements['svg'], key: string) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 256 256"
      {...props}
      key={key}
    >
      <g fill="currentColor">
        <path
          d="M195.88 195.88a96 96 0 0 1-135.76 0L195.88 60.12a96 96 0 0 1 0 135.76Z"
          opacity=".2"
        ></path>
        <path d="M201.54 54.46A104 104 0 0 0 54.46 201.54A104 104 0 0 0 201.54 54.46ZM65.78 65.77a88.08 88.08 0 0 1 118.52-5.38L60.38 184.31a88 88 0 0 1 5.4-118.54Zm124.44 124.46a88.1 88.1 0 0 1-118.52 5.38L195.62 71.69a88 88 0 0 1-5.4 118.54Z"></path>
      </g>
    </svg>
  );
}
