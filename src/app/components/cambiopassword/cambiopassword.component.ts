import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-cambiopassword',
  imports: [CommonModule, NgClass, ReactiveFormsModule],
  templateUrl: './cambiopassword.component.html',
  styleUrl: './cambiopassword.component.css'
})
export class CambiopasswordComponent implements OnInit {
  formularioCambio!: FormGroup;
  email: string = '';
  errorPassword: string = '';
  errorConfirmPassword: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'];
    });

    this.formularioCambio = this.fb.group({
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d).{8,}$/) // Mínimo 8, 1 mayúscula, 1 número
      ]],
      confirmPassword: ['', Validators.required]
    });
  }

  cambiarPassword() {
    this.errorPassword = '';
    this.errorConfirmPassword = '';

    if (this.formularioCambio.invalid) {
      if (this.formularioCambio.get('password')?.invalid) {
        this.errorPassword = 'La contraseña debe tener al menos 8 caracteres, una mayúscula y un número.';
      }
      if (this.formularioCambio.get('confirmPassword')?.invalid) {
        this.errorConfirmPassword = 'Debes confirmar tu contraseña.';
      }
      return;
    }

    const password = this.formularioCambio.get('password')?.value;
    const confirmPassword = this.formularioCambio.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      this.errorConfirmPassword = 'Las contraseñas no coinciden.';
      return;
    }

    this.http.post<any>('http://localhost:4242/api/reset-password', {
      email: this.email,
      nuevaPassword: password
    }).subscribe({
      next: () => {
        alert('Contraseña actualizada correctamente');
        this.router.navigate(['/login']);
      },
      error: err => {
        alert(err.error?.error || 'Error al cambiar contraseña');
      }
    });
  }
}
