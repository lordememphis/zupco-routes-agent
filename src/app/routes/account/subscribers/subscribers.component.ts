import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  ICreateSubscriberProfileDto,
  SubscriberService,
} from './subscriber.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-subscriber-registration',
  templateUrl: './subscribers.component.html',
})
export class SubscribersComponent implements OnInit {
  registrationForm!: FormGroup;

  error = false;
  success = false;
  aMessage: string;
  processing = false;
  fsDialog = false;

  constructor(
    private subscriberService: SubscriberService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registrationForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required),
    });
  }

  onRegisterSubscriber(): void {
    this.processing = true;
    const dto: ICreateSubscriberProfileDto = {
      name: this.registrationForm.get('name').value,
      description: this.registrationForm.get('description').value,
    };

    this.subscriberService.registerSubscriber(dto).subscribe(
      (data) => this.onReqSuccess('Subscriber registered successfully'),
      () => this.onReqError('Could not register subscriber')
    );
  }

  private onReqSuccess(message: string): void {
    this.processing = false;
    this.fsDialog = false;
    this.success = true;
    this.aMessage = message;

    setTimeout(() => {
      this.success = false;
      this.router.navigate(['account', 'subscribers']);
    }, 2000);
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
