import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { Operator } from 'src/app/shared/models/operator.model';
import { SubSink } from 'subsink';
import { OperatorService } from './operator.service';

@Component({
  selector: 'app-operators',
  templateUrl: './operators.component.html',
})
export class OperatorsComponent implements OnInit, OnDestroy {
  editOperatorForm: FormGroup;
  registerOperatorForm: FormGroup;
  operators: Operator[] = [];
  operator: Operator;
  hasOperators: boolean;
  totalOperators: number;
  error = false;
  success = false;
  aMessage: string;
  processing = true;
  viewingOperators: boolean;
  registeringOperator: boolean;
  editingOperator: boolean;
  deletingOperator: boolean;
  fsDialog: boolean;
  private subs = new SubSink();

  constructor(
    private operatorService: OperatorService,
    private router: Router,
    titleService: Title
  ) {
    this.subs.add(
      this.router.events.subscribe((e: any) => {
        if (e instanceof NavigationEnd) this.ngOnInit();
      })
    );
    titleService.setTitle('Dashboard — Account Operators');
  }

  ngOnInit(): void {
    this.viewingOperators = true;
    this.registeringOperator = false;
    this.editingOperator = false;
    this.deletingOperator = false;
    this.fsDialog = false;

    this.subs.add(
      this.operatorService.getOperators().subscribe(
        (res) => {
          this.processing = false;
          this.operators = res.operators;
          this.hasOperators = !res.empty;
          this.totalOperators = res.total;
        },
        (e) => {
          e.error.message
            ? this.onReqError(e.error.message)
            : this.onReqError('Something went wrong. Try again.');
        }
      )
    );

    this.editOperatorForm = new FormGroup({
      firstname: new FormControl(null, Validators.required),
      lastname: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      mobile: new FormControl(null, Validators.required),
    });

    this.registerOperatorForm = new FormGroup({
      firstname: new FormControl(null, Validators.required),
      lastname: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      mobile: new FormControl(null, Validators.required),
    });
  }

  registerOperator(): void {
    this.processing = true;
    const operator: Operator = {
      id: null,
      firstname: this.registerOperatorForm.get('firstname').value,
      lastname: this.registerOperatorForm.get('lastname').value,
      email: this.registerOperatorForm.get('email').value,
      mobile: this.registerOperatorForm.get('mobile').value,
      status: 'ACTIVE',
      agent: 7,
    };

    this.subs.add(
      this.operatorService.registerOperator(operator).subscribe(
        () => {
          this.onReqSuccess('Operator successfully registered.');
        },
        (e) => {
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

  onEditOperator(operator: Operator): void {
    this.operator = operator;
    this.editingOperator = true;
    this.fsDialog = true;

    this.editOperatorForm.patchValue({
      firstname: operator.firstname,
      lastname: operator.lastname,
      email: operator.email,
      mobile: operator.mobile,
    });
  }

  updateOperator(): void {
    this.processing = true;

    const op: Operator = {
      id: this.operator.id,
      firstname: this.editOperatorForm.get('firstname').value,
      lastname: this.editOperatorForm.get('lastname').value,
      email: this.editOperatorForm.get('email').value,
      mobile: this.editOperatorForm.get('mobile').value,
      status: this.operator.status,
      agent: null,
    };

    this.subs.add(
      this.operatorService.updateOperator(op).subscribe(
        () => {
          this.onReqSuccess('Operator information changed successfully.');
        },
        (e) => {
          e.error.message
            ? this.onReqError(e.error.message)
            : this.onReqError('Something went wrong. Try again.');
        }
      )
    );
  }

  changeOperatorStatus(operator: Operator): void {
    this.processing = true;
    const { ...op } = operator;

    operator.status === 'ACTIVE'
      ? (op.status = 'BLOCKED')
      : (op.status = 'ACTIVE');

    this.subs.add(
      this.operatorService.updateOperator(op).subscribe(
        () => {
          this.onReqSuccess('Operator status changed successfully.');
        },
        (e) => {
          if (e.error)
            e.error.message
              ? this.onReqError(e.error.message)
              : this.onReqError(
                  'Something went wrong. Could not change operator status. Try again.'
                );
          else
            this.onReqError(
              'Something went wrong. Could not change operator status. Try again.'
            );
        }
      )
    );
  }

  deleteOperator(): void {
    this.processing = true;
    this.subs.add(
      this.operatorService.deleteOperator(this.operator.id).subscribe(
        () => {
          this.onReqSuccess('Operator successfully deleted.');
        },
        (e) => {
          e.error.message
            ? this.onReqError(e.error.message)
            : this.onReqError('Something went wrong. Try again.');
        }
      )
    );
  }

  closeFsDialog(): void {
    this.fsDialog = false;
    this.editingOperator = false;
    this.deletingOperator = false;
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
    this.router.navigate(['dashboard', 'reps', 'operators']);
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
