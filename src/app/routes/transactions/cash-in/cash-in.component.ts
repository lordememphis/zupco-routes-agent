import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Transaction } from 'src/app/shared/transaction';
import { TransactionService } from '../transaction.service';

@Component({
  selector: 'app-cash-in',
  templateUrl: './cash-in.component.html',
  styleUrls: ['./cash-in.component.scss'],
})
export class CashInComponent implements OnInit {
  cashInForm: FormGroup;

  alert = null;

  constructor(private _ts: TransactionService) {}

  ngOnInit(): void {
    this.cashInForm = new FormGroup({
      reference: new FormControl(null, Validators.required),
      sMobile: new FormControl(null, Validators.required),
      imei: new FormControl(null, Validators.required),
      type: new FormControl('CASHIN', Validators.required),
      amount: new FormControl(null, Validators.required),
    });
  }

  cashIn() {
    const transaction: Transaction = {
      originalRef: this.cashInForm.get('reference').value,
      agentId: 7,
      subscriberMobile: this.cashInForm.get('sMobile').value,
      amount: this.cashInForm.get('amount').value,
      operatorId: 7,
      imei: this.cashInForm.get('imei').value,
      operatorCode: 'operatorCode',
      channel: 'WEB',
      transactionTypes: this.cashInForm.get('type').value,
    };

    this._ts.cashIn(transaction).subscribe(
      (res) => console.log(res),
      (e) => {
        this.alert = 'Something has gone wrong. Try again.';
        setTimeout(() => {
          this.alert = null;
        }, 5000);
      }
    );
  }
}
