import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

interface NavLink {
  texto: string;
  url: string;
  filtro?: string;
}

@Component({
  selector: 'app-navbar',
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  standalone: true
})
export class NavbarComponent {
  enlaces: NavLink[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
      const rol = localStorage.getItem('rol');

      const enlacesBase: NavLink[] = [
        { texto: 'Catálogo', url: '/catalogo' },
        { texto: 'Stickers', url: '/catalogo', filtro: 'stickers' },
        { texto: 'Lápices', url: '/catalogo', filtro: 'lapices' },
        { texto: 'Plumones', url: '/catalogo', filtro: 'plumones' },
        { texto: 'Plumas', url: '/catalogo', filtro: 'plumas' },
        { texto: 'Cintas', url: '/catalogo', filtro: 'cintas' },
        { texto: 'Sobre Nosotros', url: '/about' }
      ];

      if (rol === 'admin') {
        this.enlaces = [
          ...enlacesBase.slice(0, 6),
          { texto: 'Inventario', url: '/inventario' },
          //{ texto: 'Usuarios', url: '/usuarios' },
          //{ texto: 'Pedidos', url: '/pedidos' },
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

  irHome() {
    this.router.navigate(['/home']);
  }

  navegarConFiltro(enlace: NavLink) {
    if (enlace.filtro) {
      this.router.navigate([enlace.url], { queryParams: { tipo: enlace.filtro } });
    } else {
      this.router.navigate([enlace.url]);
    }
  }
}
