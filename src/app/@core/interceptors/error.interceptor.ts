import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ConfirmationService } from 'primeng/api';
import { AuthService } from '../servicios/auth.service';


export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const confirmationService = inject(ConfirmationService);

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 403) {
        authService.logout();

        confirmationService.confirm({
          message: 'Su sesión ha expirado, por favor inicie sesión nuevamente.',
          header: 'Sesión expirada',
          closeOnEscape: true,
          icon: 'pi pi-exclamation-triangle',
          acceptLabel: 'OK',
          rejectVisible: false,
          accept: () => {
            router.navigate(['/ShoppingApp/login']);
          },
          closable: false,
        });
      }
      return throwError(() => error);
    })
  );
};
