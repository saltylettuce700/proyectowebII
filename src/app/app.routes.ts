import { Routes } from '@angular/router';
import { CatalogoComponent } from './components/catalogo/catalogo.component';
import { CarritoComponent } from './components/carrito/carrito.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { CambiopasswordComponent } from './components/cambiopassword/cambiopassword.component';
import { InventarioService } from './services/inventario.service';
import { InventarioComponent } from './components/inventario/inventario.component';
import { AccountComponent } from './components/account/account.component';

import { UsuariosAdminComponent } from './components/usuarios-admin/usuarios-admin.component';
import { PedidosAdminComponent } from './components/pedidos-admin/pedidos-admin.component';
import { ResumenPedidoComponent } from './components/resumen-pedido/resumen-pedido.component';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { TerminosComponent } from './components/terminos/terminos.component';
import { PrivacidadComponent } from './components/privacidad/privacidad.component';


export const routes: Routes = [

    
    //{path: '', component : CatalogoComponent},

    {path: '', component : LoginComponent},
    {path: 'registro', component : RegisterComponent},
    {path: 'carrito', component : CarritoComponent},
    {path: 'catalogo', component : CatalogoComponent},
    {path: 'cambiopassword', component: CambiopasswordComponent },
    {path: 'inventario', component : InventarioComponent},
    {path: 'account', component : AccountComponent},
    {path: 'usuarios', component : UsuariosAdminComponent},
    {path: 'pedidos', component : PedidosAdminComponent},
    {path: 'resumenpedidos', component : ResumenPedidoComponent},
    {path: 'home', component : HomeComponent},
    {path: 'about', component : AboutComponent},
    {path: 'terminos', component : TerminosComponent},
    {path: 'aviso', component : PrivacidadComponent},
];
