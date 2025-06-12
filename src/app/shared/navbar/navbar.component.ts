import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

interface NavLink {
  texto: string;
  url: string;
}

@Component({
  selector: 'app-navbar',
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  standalone: true
})
/*export class NavbarComponent {
  constructor(private router: Router) {}

  irAlCarrito() {
    this.router.navigate(['/carrito']);
  }
}*/

export class NavbarComponent {
  enlaces: NavLink[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
  if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
    const rol = sessionStorage.getItem('rol');

    const enlacesBase: NavLink[] = [
      { texto: 'Catálogo', url: '/catalogo' },
      { texto: 'Stickers', url: '/stickers' },
      { texto: 'Lápices', url: '/lapices' },
      { texto: 'Plumones', url: '/plumones' },
      { texto: 'Plumas', url: '/plumas' },
      { texto: 'Cintas', url: '/cintas' },
      { texto: 'Sobre Nosotros', url: '/sobre-nosotros' }
    ];

    if (rol === 'admin') {
      this.enlaces = [
        ...enlacesBase.slice(0, 6),
        { texto: 'Inventario', url: '/inventario' },
        { texto: 'Usuarios', url: '/usuarios' },
        { texto: 'Pedidos', url: '/pedidos' },
        enlacesBase[6]
      ];
    } else {
      this.enlaces = enlacesBase;
    }
  }
}

  irAlCarrito() {
    this.router.navigate(['/carrito']);
  }

  irAccount() {
    this.router.navigate(['/account']);
  }
}
