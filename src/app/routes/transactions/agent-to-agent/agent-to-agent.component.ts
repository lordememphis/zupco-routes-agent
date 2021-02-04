import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import {
  A2ATransaction,
  CashInOutTransaction,
} from 'src/app/shared/models/transaction';
import { SubSink } from 'subsink';
import * as UUID from 'uuid-int';
import { TransactionService } from '../transaction.service';

@Component({
  selector: 'app-agent-to-agent',
  templateUrl: './agent-to-agent.component.html',
  styleUrls: ['./agent-to-agent.component.scss'],
})
export class AgentToAgentComponent implements OnInit, OnDestroy {
  private _subs = new SubSink();

  a2aForm: FormGroup;
  authForm: FormGroup;

  error = false;
  success = false;
  aMessage: string;
  processing = false;
  fsDialog = false;

  constructor(
    private _ts: TransactionService,
    private _router: Router,
    private _auth: AuthService
  ) {}

  ngOnInit() {
    this.a2aForm = new FormGroup({
      reference: new FormControl(
        { value: UUID(0).uuid(), disabled: true },
        Validators.required
      ),
      rMobile: new FormControl(null, Validators.required),
      type: new FormControl('CASHIN', Validators.required),
      amount: new FormControl(null, Validators.required),
    });

    this.authForm = new FormGroup({
      code: new FormControl(null, Validators.required),
    });
  }

  agentTransfer() {
    const transaction: A2ATransaction = {
      originalRef: this.a2aForm.get('reference').value,
      senderAgentId: this._auth.agentId,
      receiverAgentMobile: this.a2aForm.get('rMobile').value,
      amount: this.a2aForm.get('amount').value,
      operatorId: this._auth.userId,
      operatorCode: this.authForm.get('code').value,
      channel: 'WEB',
      transactionTypes: this.a2aForm.get('type').value,
    };

    this.processing = true;

    this._subs.add(
      this._ts.agentToAgent(transaction).subscribe(
        (res) => {
          console.log(res);
          this.processing = false;
        },
        (e) => {
          e.error.message
            ? this._onReqError(e.error.message)
            : this._onReqError('Something went wrong. Try again.');
        }
      )
    );
  }

  private _onReqSuccess(message: string) {
    this.processing = false;
    this.success = true;
    this.aMessage = message;

    setTimeout(() => {
      this.success = false;
    }, 2000);
    this._router.navigate(['devices']);
  }

  private _onReqError(message: string) {
    this.processing = false;
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
