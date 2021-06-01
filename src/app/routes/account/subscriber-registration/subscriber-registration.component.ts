import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  ICreateSubscriberProfileDto,
  SubscriberService,
} from './subscriber.service';
import { SubSink } from 'subsink';
import { Title } from '@angular/platform-browser';

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
    private subscriberService: SubscriberService,
    titleService: Title
  ) {
    titleService.setTitle('Misc. — Account Subscribers');
  }

  ngOnInit(): void {
    this.registerSubscriberForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required),
    });
  }

  registerSubscriber(): void {
    this.processing = true;
    const dto: ICreateSubscriberProfileDto = {
      name: this.registerSubscriberForm.get('name').value,
      description: this.registerSubscriberForm.get('description').value,
    };

    this.subs.add(
      this.subscriberService.registerSubscriber(dto).subscribe(
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
    this.registerSubscriberForm.reset();
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
