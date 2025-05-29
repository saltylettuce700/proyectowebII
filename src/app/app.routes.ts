import { Routes } from '@angular/router';
import { CatalogoComponent } from './components/catalogo/catalogo.component';
import { CarritoComponent } from './components/carrito/carrito.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { CambiopasswordComponent } from './components/cambiopassword/cambiopassword.component';
import { InventarioService } from './services/inventario.service';
import { InventarioComponent } from './components/inventario/inventario.component';


export const routes: Routes = [

    
    //{path: '', component : CatalogoComponent},

    {path: '', component : LoginComponent},
    {path: 'registro', component : RegisterComponent},
    {path: 'carrito', component : CarritoComponent},
    {path: 'catalogo', component : CatalogoComponent},
    { path: 'cambiopassword', component: CambiopasswordComponent },
    {path: 'inventario', component : InventarioComponent},
];
