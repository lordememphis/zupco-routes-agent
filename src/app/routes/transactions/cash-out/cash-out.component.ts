import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Transaction } from 'src/app/shared/transaction';
import { SubSink } from 'subsink';
import { TransactionService } from '../transaction.service';

@Component({
  selector: 'app-cash-out',
  templateUrl: './cash-out.component.html',
  styleUrls: ['./cash-out.component.scss'],
})
export class CashOutComponent implements OnInit, OnDestroy {
  private _subs = new SubSink();

  cashOutForm: FormGroup;

  error = false;
  success = false;
  aMessage: string;
  processing = false;

  constructor(private _ts: TransactionService) {}

  ngOnInit() {
    this.cashOutForm = new FormGroup({
      reference: new FormControl(null, Validators.required),
      sMobile: new FormControl(null, Validators.required),
      imei: new FormControl(null, Validators.required),
      type: new FormControl('CASHOUT', Validators.required),
      amount: new FormControl(null, Validators.required),
    });
  }

  cashOut() {
    const transaction: Transaction = {
      originalRef: this.cashOutForm.get('reference').value,
      agentId: 7,
      subscriberMobile: this.cashOutForm.get('sMobile').value,
      amount: this.cashOutForm.get('amount').value,
      operatorId: 7,
      imei: this.cashOutForm.get('imei').value,
      operatorCode: 'operatorCode',
      channel: 'WEB',
      transactionTypes: this.cashOutForm.get('type').value,
    };

    this.processing = true;

    this._subs.add(
      this._ts.cashOut(transaction).subscribe(
        (res) => {
          console.log(res);
          this.processing = false;
        },
        (e) => {
          this.processing = false;
          this.error = true;
          this.aMessage = 'Something has gone wrong. Try again.';

          setTimeout(() => {
            this.error = false;
          }, 5000);
        }
      )
    );
  }

  ngOnDestroy() {
    this._subs.unsubscribe();
  }
}
