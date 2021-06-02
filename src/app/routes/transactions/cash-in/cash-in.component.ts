import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { CashInOutTransaction } from 'src/app/shared/models/transaction.model';
import { SubSink } from 'subsink';
import { TransactionService } from '../transaction.service';
import * as UUID from 'uuid-int';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-cash-in',
  templateUrl: './cash-in.component.html',
})
export class CashInComponent implements OnInit, OnDestroy {
  private subs = new SubSink();

  transactionForm: FormGroup;
  authForm: FormGroup;
  transactionCode: string;

  error = false;
  success = false;
  aMessage: string;
  processing = false;
  fsDialog = false;

  constructor(
    private transactionService: TransactionService,
    private router: Router,
    private auth: AuthService,
    titleService: Title
  ) {
    this.subs.add(
      this.router.events.subscribe((e: any) => {
        if (e instanceof NavigationEnd) this.ngOnInit();
      })
    );
    titleService.setTitle('Transactions — Cash In');
  }

  ngOnInit(): void {
    this.transactionCode = this.transactionService.CASHIN_CODE;
    this.transactionForm = new FormGroup({
      reference: new FormControl(
        { value: UUID(0).uuid(), disabled: true },
        Validators.required
      ),
      sMobile: new FormControl(null, Validators.required),
      imei: new FormControl(null),
      type: new FormControl(this.transactionCode, Validators.required),
      amount: new FormControl(null, Validators.required),
    });

    this.authForm = new FormGroup({
      code: new FormControl(null, Validators.required),
    });
  }

  cashIn(): void {
    const transaction: CashInOutTransaction = {
      originalRef: this.transactionForm.get('reference').value,
      agentId: this.auth.agentId,
      subscriberMobile: this.transactionForm.get('sMobile').value,
      amount: this.transactionForm.get('amount').value,
      operatorId: this.auth.operatorId,
      imei: this.transactionForm.get('reference').value,
      operatorCode: this.authForm.get('code').value,
      channel: 'WEB',
      transactionTypes: this.transactionForm.get('type').value,
    };

    this.processing = true;

    this.subs.add(
      this.transactionService.cashIn(transaction).subscribe(
        () => {
          this.onReqSuccess('Your cash in transaction was successful');
        },
        (e) => {
          this.authForm.reset();
          if (!e.error) {
            this.onReqError(
              'The server cannot be reached at the moment. Check your internet connection and try again later'
            );
          } else if (e.error.message) {
            this.onReqError(e.error.message);
          } else {
            this.onReqError('Something went wrong. Try again.');
          }
        }
      )
    );
  }

  private onReqSuccess(message: string): void {
    this.processing = false;
    this.fsDialog = false;
    this.success = true;
    this.aMessage = message;

    setTimeout(() => {
      this.success = false;
    }, 2000);
    this.router.navigate(['transactions', 'cash-in']);
  }

  private onReqError(message: string): void {
    this.processing = false;
    this.fsDialog = false;
    this.error = true;
    this.aMessage = message;

    setTimeout(() => {
      this.error = false;
    }, 5000);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
