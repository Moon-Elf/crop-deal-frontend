import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';  // Import RoleGuard
import { DashboardComponent } from './features/farmer/dashboard/dashboard.component';
import { MarketplaceComponent } from './features/marketplace/marketplace.component';

export const routes: Routes = [
    { path: '', redirectTo: 'farmer', pathMatch: 'full' },
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
        canActivate: [AuthGuard]
    }      
];
