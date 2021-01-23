import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './routes/dashboard/dashboard.component';
import { DevicesComponent } from './routes/devices/devices.component';
import { HomeComponent } from './routes/home/home.component';
import { OperatorsComponent } from './routes/operators/operators.component';
import { CashInComponent } from './routes/transactions/cash-in/cash-in.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'operators', component: OperatorsComponent },
      { path: 'devices', component: DevicesComponent },
      { path: 'transactions/cash-in', component: CashInComponent },
    ],
  },
  { path: 'login', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
