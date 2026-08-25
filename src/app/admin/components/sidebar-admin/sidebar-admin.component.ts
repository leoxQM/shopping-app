import { Component, computed, inject } from '@angular/core';
import { AuthService } from '../../../@core/servicios/auth.service';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar-admin',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar-admin.component.html',
  styleUrl: './sidebar-admin.component.css',
})
export class SidebarAdminComponent {
  private authService = inject(AuthService);

  esAdmin = computed(() => this.authService.esAdmin());
}
