import { Routes } from '@angular/router';
import { CatalogoComponent } from './components/catalogo/catalogo.component';
import { CarritoComponent } from './components/carrito/carrito.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';


export const routes: Routes = [

    
    //{path: '', component : CatalogoComponent},

    {path: '', component : RegisterComponent},
    
    {path: 'carrito', component : CarritoComponent}
];
