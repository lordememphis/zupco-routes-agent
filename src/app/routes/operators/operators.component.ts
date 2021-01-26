import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { Operator } from 'src/app/shared/models/operator';
import { SubSink } from 'subsink';
import { OperatorService } from './operator.service';

@Component({
  selector: 'app-operators',
  templateUrl: './operators.component.html',
  styleUrls: ['./operators.component.scss'],
})
export class OperatorsComponent implements OnInit, OnDestroy {
  private _subs = new SubSink();

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

  constructor(
    private _operatorService: OperatorService,
    private _router: Router
  ) {
    this._subs.add(
      this._router.events.subscribe((e: any) => {
        if (e instanceof NavigationEnd) this.ngOnInit();
      })
    );
  }

  ngOnInit() {
    this.viewingOperators = true;
    this.registeringOperator = false;
    this.editingOperator = false;
    this.deletingOperator = false;
    this.fsDialog = false;

    this._subs.add(
      this._operatorService.getOperators().subscribe(
        (res) => {
          this.processing = false;
          this.operators = res.operators;
          this.hasOperators = !res.empty;
          this.totalOperators = res.total;
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

    this._subs.add(
      this._operatorService.registerOperator(operator).subscribe(
        () => {
          this.processing = false;
          this.success = true;
          this.aMessage = 'Operator successfully registered.';

          setTimeout(() => {
            this.success = false;
            this._router.navigate(['operators']);
          }, 2000);
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
      agent: 'Memphis',
    };

    this._subs.add(
      this._operatorService.updateOperator(op).subscribe(
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

  deleteOperator(): void {
    this.processing = true;
    this._subs.add(
      this._operatorService.deleteOperator(this.operator.id).subscribe(
        () => {
          this.processing = false;
          this.success = true;
          this.aMessage = 'Operator successfully deleted.';

          setTimeout(() => {
            this.success = false;
          }, 2000);
          this._router.navigate(['operators']);
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

  closeFsDialog(): void {
    this.fsDialog = false;
    this.editingOperator = false;
    this.deletingOperator = false;
  }

  ngOnDestroy(): void {
    this._subs.unsubscribe();
  }
}
