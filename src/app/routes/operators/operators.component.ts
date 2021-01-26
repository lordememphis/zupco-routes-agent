import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Operator } from 'src/app/shared/operator';
import { SubSink } from 'subsink';
import { OperatorService } from '../operator.service';

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

  alert = null;
  viewingOperators = true;
  registeringOperator = false;
  editingOperator = false;
  deletingOperator = false;
  fsDialog = false;

  constructor(private _operatorService: OperatorService) {}

  ngOnInit() {
    this._subs.add(
      this._operatorService.getOperators().subscribe(
        (res) => {
          this.operators = res.operators;
          this.hasOperators = !res.empty;
          this.totalOperators = res.total;
        },
        (e) => {
          this.alert = 'Something has gone wrong. Try again.';
          setTimeout(() => {
            this.alert = null;
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
        (res) => console.log(res),
        (e) => {
          this.alert = 'Something has gone wrong. Try again.';
          setTimeout(() => {
            this.alert = null;
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
        (data) => console.log(data),
        (e) => {
          this.alert = 'Something has gone wrong. Try again.';
          setTimeout(() => {
            this.alert = null;
          }, 5000);
        }
      )
    );
  }

  deleteOperator(): void {
    this._subs.add(
      this._operatorService.deleteOperator(this.operator.id).subscribe(
        (res) => console.log(res),
        (e) => {
          this.alert = 'Something has gone wrong. Try again.';
          setTimeout(() => {
            this.alert = null;
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
