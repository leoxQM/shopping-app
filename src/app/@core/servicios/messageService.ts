import { inject, Injectable } from "@angular/core";
import { MessageService } from 'primeng/api';
import { I_ToastBody } from "../interfaces/toast.interface";

@Injectable({
  providedIn: "root",
})
export class ToastService  {
  private messageService = inject(MessageService);

  constructor() {}
  showMessage(objeto: I_ToastBody) {
    this.messageService.clear();
    this.messageService.add(objeto);
  }
  showSuccess(message: string) {
    this.showMessage({
      severity: 'success',
      summary: 'Éxito',
      detail: message,
    });
  }

  showError(message: string) {
    this.showMessage({
      severity: 'error',
      summary: 'Error',
      detail: message,
    });
  }

  showInfo(message: string) {
    this.showMessage({
      severity: 'info',
      summary: 'Información',
      detail: message,
    });
  }

  showWarn(message: string) {
    this.showMessage({
      severity: 'warn',
      summary: 'Advertencia',
      detail: message,
    });
  }

  clear() {
    this.messageService.clear();
  }
}
