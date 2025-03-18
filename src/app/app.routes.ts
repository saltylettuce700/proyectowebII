import { Routes } from '@angular/router';
import { CatalogoComponent } from './components/catalogo/catalogo.component';
import { CarritoComponent } from './components/carrito/carrito.component';


export const routes: Routes = [

    {path: '', component : CatalogoComponent},
    
    {path: 'carrito', component : CarritoComponent}
];
