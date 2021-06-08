import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { Bank } from 'src/app/shared/models/bank.model';
import { WTBTransaction } from 'src/app/shared/models/transaction.model';
import { SubSink } from 'subsink';
import * as UUID from 'uuid-int';
import { TransactionService } from '../transaction.service';

@Component({
  selector: 'app-wallet-to-bank',
  templateUrl: './wallet-to-bank.component.html',
})
export class WalletToBankComponent implements OnInit, OnDestroy {
  banks: Bank[] = [];
  transactionForm: FormGroup;
  authForm: FormGroup;
  transactionCode: string;
  error = false;
  success = false;
  aMessage: string;
  processing = false;
  fsDialog = false;
  showOpPin = false;
  private subs = new SubSink();

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
    titleService.setTitle('Transactions — Wallet to Bank Transfer');
  }

  ngOnInit(): void {
    this.subs.add(
      this.transactionService
        .getBanks()
        .subscribe((banks) => (this.banks = banks))
    );
    this.transactionCode = this.transactionService.WTB_CODE;
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

  walletTransfer(): void {
    const transaction: WTBTransaction = {
      originalRef: this.transactionForm.get('reference').value,
      agentId: this.auth.agentId,
      bankId: this.transactionForm.get('bankId').value,
      bankAccount: this.transactionForm.get('account').value,
      amount: this.transactionForm.get('amount').value,
      operatorId: this.auth.operatorId,
      operatorCode: this.authForm.get('code').value,
      channel: 'WEB',
      transactionTypes: this.transactionForm.get('type').value,
    };

    this.processing = true;

    this.subs.add(
      this.transactionService.walletToBank(transaction).subscribe(
        () => {
          this.onReqSuccess('Your wallet to bank transfer was successful.');
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

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  private onReqSuccess(message: string): void {
    this.processing = false;
    this.fsDialog = false;
    this.success = true;
    this.aMessage = message;

    setTimeout(() => {
      this.success = false;
    }, 2000);
    this.router.navigate(['transactions', 'wallet-to-bank']);
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
}
