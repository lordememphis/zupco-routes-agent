import { Component, OnDestroy, OnInit } from '@angular/core';
import { Operator } from 'src/app/shared/models/operator';
import { Device } from 'src/app/shared/models/device';
import { DeviceService } from '../devices/device.service';
import { OperatorService } from '../operators/operator.service';
import { SubSink } from 'subsink';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  private _subs = new SubSink();
  initialSubs$: Observable<{ devices: Device[]; operators: Operator[] }>;

  devices: Device[] = [];
  operators: Operator[] = [];

  domDevices: number;
  domOperators: number;
  activeDevices = true;
  activeOperators = true;

  processing = true;
  error = false;
  aMessage: string;

  constructor(
    private _deviceService: DeviceService,
    private _operatorService: OperatorService
  ) {}

  ngOnInit(): void {
    this._subs.add(
      forkJoin([
        this._deviceService.getDevices(),
        this._operatorService.getOperators(),
      ])
        .pipe(
          map(([devices, operators]) => {
            return { devices, operators };
          })
        )
        .subscribe((data) => {
          this.devices = data.devices.devices;
          this.operators = data.operators.operators;

          this.domDevices = this.devices.filter(
            (device) => device.status === 'ACTIVE'
          ).length;

          this.domOperators = this.operators.filter(
            (operator) => operator.status === 'ACTIVE'
          ).length;

          this.processing = false;
        })
    );
  }

  onFilterDevices(e: any) {
    this.activeDevices = !this.activeDevices;
    this.domDevices = this.devices.filter(
      (device) => device.status === e.target.value
    ).length;
  }

  onFilterOperators(e: any) {
    this.activeOperators = !this.activeOperators;
    this.domOperators = this.operators.filter(
      (operator) => operator.status === e.target.value
    ).length;
  }

  ngOnDestroy() {
    this._subs.unsubscribe();
  }
}
