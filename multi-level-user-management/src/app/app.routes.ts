import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './guards/auth-guards';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HomeComponent } from './components/dashboard/home/home.component';
import { DownlineComponent } from './components/dashboard/downline/downline.component';
import { TransferComponent } from './components/dashboard/transfer/transfer.component';
import {SummaryComponent} from './components/dashboard/summary/summary.component';
export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [authGuard],
        children: [
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: HomeComponent },
            { path: 'downline', component: DownlineComponent },
            { path: 'transfer', component: TransferComponent },
            { path: 'summary', component: SummaryComponent }
        ]
    },
    { path: '**', redirectTo: 'login' }
];
