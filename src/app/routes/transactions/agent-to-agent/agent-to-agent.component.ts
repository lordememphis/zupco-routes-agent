import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { A2ATransaction } from 'src/app/shared/models/transaction.model';
import { SubSink } from 'subsink';
import * as UUID from 'uuid-int';
import { TransactionService } from '../transaction.service';

@Component({
  selector: 'app-agent-to-agent',
  templateUrl: './agent-to-agent.component.html',
})
export class AgentToAgentComponent implements OnInit, OnDestroy {
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
    titleService.setTitle('Transactions — Agent to Agent Transfer');
  }

  ngOnInit(): void {
    this.transactionCode = this.transactionService.A2A_CODE;
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

  agentTransfer(): void {
    const transaction: A2ATransaction = {
      originalRef: this.transactionForm.get('reference').value,
      senderAgentId: this.auth.agentId,
      receiverAgentMobile: this.transactionForm.get('rMobile').value,
      amount: this.transactionForm.get('amount').value,
      operatorId: this.auth.operatorId,
      operatorCode: this.authForm.get('code').value,
      channel: 'WEB',
      transactionTypes: this.transactionForm.get('type').value,
    };

    this.processing = true;

    this.subs.add(
      this.transactionService.agentToAgent(transaction).subscribe(
        () => {
          this.transactionForm.reset();
          this.authForm.reset();
          this.onReqSuccess('Your agent to agent transfer was successful.');
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
    this.router.navigate(['transactions', 'agent-to-agent']);
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
