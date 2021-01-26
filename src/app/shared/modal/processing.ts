import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-processing-modal',
  template: `<div *ngIf="process" class="absolute inset-0 z-20">
    <div class="block min-h-screen text-center">
      <div
        class="my-8 align-middle inline-block bg-white rounded-full text-left overflow-hidden shadow-xl transform transition-all"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-headline"
      >
        <div class="bg-white p-2">
          <svg
            class="w-6 h-6 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      </div>
    </div>
  </div>`,
})
export class ProcessingModal {
  @Input() process: boolean = false;
}
