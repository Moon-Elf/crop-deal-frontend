import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';  // Import RoleGuard
import { DashboardComponent } from './features/farmer/dashboard/dashboard.component';
import { MarketplaceComponent } from './features/marketplace/marketplace/marketplace.component';
import { HomeComponent } from './pages/home/home.component';
import { DetailsComponent } from './features/marketplace/details/details.component';

export const routes: Routes = [
    { path: '', pathMatch: 'full', component: HomeComponent },
    {
        path: 'auth',
        loadChildren: () =>
            import('./features/auth/auth.module').then(m => m.AuthModule),
    },
    {
        path: 'farmer',
        loadChildren:() => import('./features/farmer/farmer.module').then(m => m.FarmerModule),
        canActivate: [AuthGuard, RoleGuard],
        data: { expectedRole: 'Farmer' }
    },
    {
        path: 'dealer',
        loadChildren:() => import('./features/dealer/dealer.module').then(m => m.DealerModule),
        canActivate: [AuthGuard, RoleGuard],
        data: { expectedRole: 'Dealer' }
    },
    {
        path: 'admin',
        loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule),
        canActivate: [AuthGuard, RoleGuard],
        data: { expectedRole: 'Admin' }
    },
    {
        path: 'marketplace',
        component: MarketplaceComponent,
        // canActivate: [AuthGuard]
    },
    {
        path: 'marketplace/:id',
        component: DetailsComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'profile',
        loadChildren: () => import('./features/profile/profile.module').then(m => m.ProfileModule),
        canActivate: [AuthGuard]
    },
    {
        path: 'bankaccount',
        loadChildren: () => import('./features/bank-account/bank-account.module').then(m => m.BankAccountModule),
        canActivate: [AuthGuard]
    },
    {
        path: 'address',
        loadChildren: () => import('./features/address/address.module').then(m => m.AddressModule),
        canActivate: [AuthGuard]
    },
    {
        path: 'transactions',
        loadChildren: () => import('./features/transactions/transactions.module').then(m => m.TransactionsModule),
        canActivate: [AuthGuard]
    }
];
