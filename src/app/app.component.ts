import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CatalogoComponent } from "./components/catalogo/catalogo.component";
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [RouterModule,NavbarComponent, FooterComponent],
  standalone: true,
  
  template: `
    <app-navbar></app-navbar>
    <router-outlet></router-outlet>
    <app-footer></app-footer>
  `,
})
export class AppComponent {
  title = 'proyectowebII';
}
