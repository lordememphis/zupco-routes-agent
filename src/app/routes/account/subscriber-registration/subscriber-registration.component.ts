import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SubSink } from 'subsink';
import { Title } from '@angular/platform-browser';
import { AuthService } from '../../../auth/auth.service';
import * as UUID from 'uuid-int';
import { NavigationEnd, Router } from '@angular/router';
import {
  ICreateSubscriberProfileDto,
  TransactionService,
} from '../../transactions/transaction.service';

@Component({
  selector: 'app-subscriber-registration',
  templateUrl: './subscriber-registration.component.html',
})
export class SubscriberRegistrationComponent implements OnInit, OnDestroy {
  registerSubscriberForm!: FormGroup;

  error = false;
  success = false;
  aMessage: string;
  processing = false;
  fsDialog = false;

  private subs = new SubSink();

  constructor(
    private transactionService: TransactionService,
    private authService: AuthService,
    private router: Router,
    titleService: Title
  ) {
    this.subs.add(
      this.router.events.subscribe((e: any) => {
        if (e instanceof NavigationEnd) this.ngOnInit();
      })
    );
    titleService.setTitle('Misc. — Account Subscribers');
  }

  ngOnInit(): void {
    this.registerSubscriberForm = new FormGroup({
      mobile: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      firstname: new FormControl(null, Validators.required),
      lastname: new FormControl(null, Validators.required),
      idNumber: new FormControl(null, Validators.required),
      originalRef: new FormControl(
        { value: UUID(0).uuid(), disabled: true },
        Validators.required
      ),
    });
  }

  registerSubscriber(): void {
    this.processing = true;
    const dto: ICreateSubscriberProfileDto = {
      mobile: this.registerSubscriberForm.get('mobile').value,
      email: this.registerSubscriberForm.get('email').value,
      firstname: this.registerSubscriberForm.get('firstname').value,
      lastname: this.registerSubscriberForm.get('lastname').value,
      idNumber: this.registerSubscriberForm.get('idNumber').value,
      subscriberProfile: 1,
      agentId: this.authService.agentId,
      originalRef: this.registerSubscriberForm.get('originalRef').value,
      channel: 'WEB',
    };

    this.subs.add(
      this.transactionService.registerSubscriber(dto).subscribe(
        () => this.onReqSuccess('Subscriber registered successfully'),
        () => this.onReqError('Could not register subscriber')
      )
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  private onReqSuccess(message: string): void {
    this.processing = false;
    this.success = true;
    this.aMessage = message;

    setTimeout(() => {
      this.success = false;
    }, 2000);
    this.router.navigate(['account', 'subscriber-registration']).then();
  }

  private onReqError(message: string): void {
    this.processing = false;
    this.error = true;
    this.aMessage = message;

    setTimeout(() => {
      this.error = false;
    }, 5000);
  }
}
