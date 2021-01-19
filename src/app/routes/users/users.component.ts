import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Operator, UsersService } from '../users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  editOperatorForm: FormGroup;
  registerOperatorForm: FormGroup;

  operators: Operator[] = [];
  selectedOperator: Operator;

  editingOperator = false;

  constructor(private _userService: UsersService) {}

  ngOnInit(): void {
    this.operators = [
      {
        id: 1,
        firstname: 'Keanu',
        lastname: 'Reeves',
        email: 'keanu@reeves.com',
        mobile: 'string',
        status: 'ACTIVE',
        agent: 'Memphis',
      },
      {
        id: 2,
        firstname: 'Jackie',
        lastname: 'Chan',
        email: 'jchan@medallion.com',
        mobile: '+898329832',
        status: 'ACTIVE',
        agent: 'Memphis',
      },
    ];
    this._userService.getOperators().subscribe(
      (data) => {
        console.log(data);
      },
      (e) => console.error(e)
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

  onEditOperator(operator: Operator): void {
    this.selectedOperator = operator;
    this.editingOperator = true;

    this.editOperatorForm.patchValue({
      firstname: operator.firstname,
      lastname: operator.lastname,
      email: operator.email,
      mobile: operator.mobile,
    });
  }

  onRegisterOperator(): void {
    const operator: Operator = {
      id: null,
      firstname: this.registerOperatorForm.get('firstname').value,
      lastname: this.registerOperatorForm.get('lastname').value,
      email: this.registerOperatorForm.get('email').value,
      mobile: this.registerOperatorForm.get('mobile').value,
      status: 'INACTIVE',
      agent: 'Memphis',
    };

    this._userService.registerOperator(operator).subscribe(
      (res) => console.log(res),
      (e) => console.error(e)
    );
  }
}
