import { Component, computed, inject, OnChanges, OnInit, signal, SimpleChanges } from '@angular/core';
import { Button } from 'primeng/button';
import { usePreset } from '@primeng/themes';
import MyPreset from '../../../mypreset';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { NgClass, NgStyle } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { CarritoService } from '../../../@core/servicios/carrito.service';
import { Tooltip } from 'primeng/tooltip';
import { AuthService } from '../../../@core/servicios/auth.service';
@Component({
  selector: 'app-navbar',
  imports: [
    Button,
    RouterLink,
    ReactiveFormsModule,
    ToggleSwitch,
    NgClass,
    OverlayBadgeModule,
    NgStyle
],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit, OnChanges {

  private carritoService = inject(CarritoService);
  private authService = inject(AuthService)
  private router = inject(Router);

  estaLogueado = computed(() => this.authService.usuarioActual() !== null);
  usuarioActual = computed(()=>this.authService.usuarioActual());

  darkMode: boolean = false;
  formGroup!: FormGroup;
  cantidadProductos = this.carritoService.cantidadProductos;
  isLogin = signal('')


  ngOnInit(): void {
    this.formData();
    this.listenToToggle();
    //console.log('cantidad', this.cantidadProductos());
  }

  ngOnChanges(changes: SimpleChanges): void {
    //this.cantidadProductos.set(this.carritoService.productos().length);
  }
  formData() {
    this.formGroup = new FormGroup({
      checked: new FormControl<boolean>(false)
    });
  }

  cerrarSesion(){
    this.authService.logout();
    this.router.navigate(['/ShoppingApp'])
  }

  listenToToggle() {
    this.formGroup.get('checked')?.valueChanges.subscribe((isDark) => {
      if (isDark) {
        document.documentElement.classList.add('my-app-dark');
      } else {
        document.documentElement.classList.remove('my-app-dark');
      }
    });
  }

  formatear(valor: string | null | undefined): string {
    if (!valor) return '';
    return valor!.charAt(0).toUpperCase() + valor.slice(1).toLowerCase();
  }

  //otro modo dark

  // toggleDarkMode() {
  // const element = document.documentElement;

  // // Alterna la clase y guarda el resultado (true si está en modo oscuro)
  // const isDark = element.classList.toggle('my-app-dark');

  // // Guarda el estado en localStorage
  // localStorage.setItem('darkMode', isDark ? 'true' : 'false');

  // // (opcional) si quieres tener una variable local para rastrear
  // this.darkMode = isDark;
  // console.log('Dark mode:', isDark);
  // }
}


