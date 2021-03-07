import { Component } from '@angular/core';

@Component({
  selector: 'app-transactions',
  template: ` <main>
    <div class="py-6 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold leading-tight text-gray-900">
        Transactions
      </h1>
      <router-outlet></router-outlet>
    </div>
  </main>`,
})
export class TransactionsComponent {}
