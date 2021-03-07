import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { Bank } from 'src/app/shared/models/bank';
import { WTBTransaction } from 'src/app/shared/models/transaction';
import { SubSink } from 'subsink';
import * as UUID from 'uuid-int';
import { TransactionService } from '../transaction.service';

@Component({
  selector: 'app-wallet-to-bank',
  templateUrl: './wallet-to-bank.component.html',
})
export class WalletToBankComponent implements OnInit, OnDestroy {
  private _subs = new SubSink();
  banks: Bank[] = [];

  transactionForm: FormGroup;
  authForm: FormGroup;
  transactionCode: string;

  error = false;
  success = false;
  aMessage: string;
  processing = false;
  fsDialog = false;

  constructor(
    private _transactionService: TransactionService,
    private _router: Router,
    private _auth: AuthService
  ) {
    this._subs.add(
      this._router.events.subscribe((e: any) => {
        if (e instanceof NavigationEnd) this.ngOnInit();
      })
    );
  }

  ngOnInit() {
    this._subs.add(
      this._transactionService
        .getBanks()
        .subscribe((banks) => (this.banks = banks))
    );
    this.transactionCode = this._transactionService.WTB_CODE;
    this.transactionForm = new FormGroup({
      reference: new FormControl(
        { value: UUID(0).uuid(), disabled: true },
        Validators.required
      ),
      bankId: new FormControl(null, Validators.required),
      account: new FormControl(null, Validators.required),
      type: new FormControl(this.transactionCode, Validators.required),
      amount: new FormControl(null, Validators.required),
    });

    this.authForm = new FormGroup({
      code: new FormControl(null, Validators.required),
    });
  }

  walletTransfer() {
    const transaction: WTBTransaction = {
      originalRef: this.transactionForm.get('reference').value,
      agentId: this._auth.agentId,
      bankId: this.transactionForm.get('bankId').value,
      bankAccount: this.transactionForm.get('account').value,
      amount: this.transactionForm.get('amount').value,
      operatorId: this._auth.operatorId,
      operatorCode: this.authForm.get('code').value,
      channel: 'WEB',
      transactionTypes: this.transactionForm.get('type').value,
    };

    this.processing = true;

    this._subs.add(
      this._transactionService.walletToBank(transaction).subscribe(
        () => {
          this._onReqSuccess('Your wallet to bank transfer was successful.');
        },
        (e) => {
          this.authForm.reset();
          if (!e.response) {
            this._onReqError(
              'The server cannot be reached at the moment. Check your internet connection and try again later'
            );
            return;
          }
          e.error.message
            ? this._onReqError(e.error.message)
            : this._onReqError('Something went wrong. Try again.');
        }
      )
    );
  }

  private _onReqSuccess(message: string) {
    this.processing = false;
    this.fsDialog = false;
    this.success = true;
    this.aMessage = message;

    setTimeout(() => {
      this.success = false;
    }, 2000);
    this._router.navigate(['transactions', 'wallet-to-bank']);
  }

  private _onReqError(message: string) {
    this.processing = false;
    this.fsDialog = false;
    this.error = true;
    this.aMessage = message;

    setTimeout(() => {
      this.error = false;
    }, 5000);
  }

  ngOnDestroy() {
    this._subs.unsubscribe();
  }
}
