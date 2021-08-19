import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { AccountComponent } from './routes/account/account.component';
import { ReportsComponent } from './routes/account/reports/reports.component';
import { TransactionHistoryComponent } from './routes/account/reports/transaction-history/transaction-history.component';
import { SettingsComponent } from './routes/account/settings/settings.component';
import { DashboardComponent } from './routes/dashboard/dashboard.component';
import { OverviewComponent } from './routes/dashboard/overview/overview.component';
import { DevicesComponent } from './routes/dashboard/reps/devices/devices.component';
import { OperatorsComponent } from './routes/dashboard/reps/operators/operators.component';
import { RepsComponent } from './routes/dashboard/reps/reps.component';
import { HomeComponent } from './routes/home/home.component';
import { AgentToAgentComponent } from './routes/transactions/agent-to-agent/agent-to-agent.component';
import { CashInComponent } from './routes/transactions/cash-in/cash-in.component';
import { CashOutComponent } from './routes/transactions/cash-out/cash-out.component';
import { DeviceTransactionsComponent } from './routes/transactions/device-transactions/device-transactions.component';
import { OperatorTransactionsComponent } from './routes/transactions/operator-transactions/operator-transactions.component';
import { TransactionsComponent } from './routes/transactions/transactions.component';
import { WalletToBankComponent } from './routes/transactions/wallet-to-bank/wallet-to-bank.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'account',
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: { title: 'Dashboard' },
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'overview' },
          { path: 'overview', component: OverviewComponent },
          {
            path: 'reps',
            component: RepsComponent,
            children: [
              { path: '', pathMatch: 'full', redirectTo: 'operators' },
              { path: 'operators', component: OperatorsComponent },
              { path: 'devices', component: DevicesComponent },
            ],
          },
        ],
        canActivate: [false],
      },
      {
        path: 'transactions',
        component: TransactionsComponent,
        data: { title: 'Dashboard' },
        children: [
          { path: 'cash-in', component: CashInComponent },
          { path: 'cash-out', component: CashOutComponent },
          { path: 'agent-to-agent', component: AgentToAgentComponent },
          { path: 'wallet-to-bank', component: WalletToBankComponent },
        ],
        canActivate: [false],
      },
      {
        path: 'account',
        component: AccountComponent,
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'reports' },
          { path: 'settings', component: SettingsComponent },
          {
            path: 'reports',
            component: ReportsComponent,
            children: [
              {
                path: '',
                pathMatch: 'full',
                redirectTo: 'transactions',
              },
              {
                path: 'transactions',
                component: TransactionHistoryComponent,
                children: [
                  {
                    path: '',
                    pathMatch: 'full',
                    redirectTo: 'merchant',
                  },
                  {
                    path: 'merchant',
                    component: OperatorTransactionsComponent,
                  },
                  {
                    path: 'device',
                    component: DeviceTransactionsComponent,
                    canActivate: [false],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always',
  },
  { path: 'login', component: LoginComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'resetPassword/changePassword', redirectTo: 'reset-password' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      onSameUrlNavigation: 'reload',
      useHash: true,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
