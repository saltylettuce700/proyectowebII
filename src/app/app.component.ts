import { Component } from '@angular/core';
import { Router, NavigationEnd, RouterModule, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NgIf } from '@angular/common';
import { CatalogoComponent } from "./components/catalogo/catalogo.component";
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [RouterModule,NavbarComponent, FooterComponent, NgIf],
  standalone: true,
  
  template: `
    <app-navbar *ngIf="mostrarNavbarFooter"></app-navbar>
    <router-outlet></router-outlet>
    <app-footer *ngIf="mostrarNavbarFooter"></app-footer>
  `,
})

export class AppComponent {
  mostrarNavbarFooter = true;

    constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const rutasSinNav = ['/', '/registro'];
        this.mostrarNavbarFooter = !rutasSinNav.includes(event.urlAfterRedirects);
      }
    });
  }
}