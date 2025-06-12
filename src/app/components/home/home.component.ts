import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [CommonModule],
  standalone: true,

})
export class HomeComponent implements OnInit, OnDestroy {
  imagenes: string[] = [
    'assets/huge.jpg',
     'assets/placeholder.jpg',
     'assets/huge.jpg'
  ];
  imagenActual: number = 0;
  intervaloCarrusel: any;

  productosZebra = [
  {
    nombre: 'Zebra Mildliner Double-Sided Highlighter - 2025 Calm Mild Colors New Set',
    imagen: 'assets/huge.jpg'
  },
  {
    nombre: 'Zebra Mildliner Double-Sided Highlighter 2025 - Fine / Bold - Mild Iris',
    imagen: 'assets/placeholder.jpg'
  },
  {
    nombre: 'Zebra Mildliner Double-Sided',
    imagen: 'assets/huge.jpg'
  }
];

productosJournal = [
  {
    nombre: 'Stationery Pal Bullet Journal Set - Black',
    imagen: 'assets/placeholder.jpg'
  },
  {
    nombre: 'Stationery Pal Stationery Set - Meow',
    imagen: 'assets/huge.jpg'
  }
];


  testimonios = [
    { nombre: 'Eva Elle', handle: '@evaelle', comentario: 'Thank you for building such an empowering tool!' },
    { nombre: 'Guy Mccoy', handle: '@mccoy', comentario: 'This makes animation so easy!' },
    { nombre: 'Kayla Ray', handle: '@kaylaray', comentario: 'CMS integration is mind-blowing.' }
  ];

  ngOnInit(): void {
    this.intervaloCarrusel = setInterval(() => {
      this.imagenActual = (this.imagenActual + 1) % this.imagenes.length;
    }, 5000); // cambia cada 5 segundos
  }

  ngOnDestroy(): void {
    clearInterval(this.intervaloCarrusel);
  }

  anterior() {
  this.imagenActual = (this.imagenActual - 1 + this.imagenes.length) % this.imagenes.length;
}

siguiente() {
  this.imagenActual = (this.imagenActual + 1) % this.imagenes.length;
}

}
