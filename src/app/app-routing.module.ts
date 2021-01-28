import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { DashboardComponent } from './routes/dashboard/dashboard.component';
import { DevicesComponent } from './routes/devices/devices.component';
import { HomeComponent } from './routes/home/home.component';
import { OperatorsComponent } from './routes/operators/operators.component';
import { SettingsComponent } from './routes/settings/settings.component';
import { CashInComponent } from './routes/transactions/cash-in/cash-in.component';
import { CashOutComponent } from './routes/transactions/cash-out/cash-out.component';
import { DeviceTransactionsComponent } from './routes/transactions/device-transactions/device-transactions.component';
import { OperatorTransactionsComponent } from './routes/transactions/operator-transactions/operator-transactions.component';

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
      { path: 'transactions/cash-out', component: CashOutComponent },
      {
        path: 'reports/account-transactions',
        component: OperatorTransactionsComponent,
      },
      {
        path: 'reports/device-transactions',
        component: DeviceTransactionsComponent,
      },
      { path: 'settings', component: SettingsComponent },
    ],
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always',
  },
  { path: 'login', component: LoginComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
