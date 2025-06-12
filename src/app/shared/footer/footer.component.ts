import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [RouterModule, CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
  standalone: true
})
export class FooterComponent {

  constructor(private router: Router) {}

  irPrivacidad() {
    this.router.navigate(['/aviso']);
  }

  irterminos() {
    this.router.navigate(['/terminos']);
  }

}
