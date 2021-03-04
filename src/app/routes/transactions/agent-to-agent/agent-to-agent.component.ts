import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { A2ATransaction } from 'src/app/shared/models/transaction';
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
    this.transactionCode = this._transactionService.A2A_CODE;
    this.transactionForm = new FormGroup({
      reference: new FormControl(
        { value: UUID(0).uuid(), disabled: true },
        Validators.required
      ),
      rMobile: new FormControl(null, Validators.required),
      type: new FormControl(this.transactionCode, Validators.required),
      amount: new FormControl(null, Validators.required),
    });

    this.authForm = new FormGroup({
      code: new FormControl(null, Validators.required),
    });
  }

  agentTransfer() {
    const transaction: A2ATransaction = {
      originalRef: this.transactionForm.get('reference').value,
      senderAgentId: this._auth.agentId,
      receiverAgentMobile: this.transactionForm.get('rMobile').value,
      amount: this.transactionForm.get('amount').value,
      operatorId: this._auth.operatorId,
      operatorCode: this.authForm.get('code').value,
      channel: 'WEB',
      transactionTypes: this.transactionForm.get('type').value,
    };

    this.processing = true;

    this._subs.add(
      this._transactionService.agentToAgent(transaction).subscribe(
        () => {
          this.transactionForm.reset();
          this.authForm.reset();
          this._onReqSuccess('Your agent to agent transfer was successful.');
        },
        (e) => {
          this.authForm.reset();
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
    this._router.navigate(['transactions', 'agent-to-agent']);
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
