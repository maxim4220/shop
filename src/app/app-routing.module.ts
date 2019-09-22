import { Routes, RouterModule } from '@angular/router';

import { CatalogComponent } from '../app/components/catalog/catalog.component';
import { LoginComponent } from '../app/components/login/login.component';
import { RegisterComponent } from '../app/components/register/register.component';
import { SingleProductComponent } from './components/single-product/single-product.component';

const routes: Routes = [
    { path: 'products', component: CatalogComponent },
    { path: 'product/:id', component: SingleProductComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },

    // otherwise redirect to home
    { path: '**', redirectTo: 'products' }
];

export const appRoutingModule = RouterModule.forRoot(routes);