import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-success-modal',
  template: `<div *ngIf="open" class="absolute inset-0">
    <div class="block min-h-screen text-center">
      <div
        class="my-8 align-middle max-w-lg w-full inline-block bg-white rounded-sm text-left overflow-hidden shadow-xl transform transition-all"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-headline"
      >
        <div class="bg-white p-6">
          <div class="flex items-start justify-between">
            <div class="flex items-start">
              <div
                class="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full bg-green-100"
              >
                <svg
                  class="w-6 h-6 text-green-600"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div class="ml-4 text-left">
                <h3
                  class="text-lg leading-6 font-medium text-gray-900"
                  id="modal-headline"
                >
                  {{ title }}
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    {{ message }}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <button type="button" (click)="close()">
                <svg
                  class="w-6 h-6 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`,
})
export class SuccessModalComponent {
  @Input() open = false;
  @Input() title = 'Success';
  @Input() message = 'Operation done successfully.';

  close(): void {
    this.open = false;
  }
}
