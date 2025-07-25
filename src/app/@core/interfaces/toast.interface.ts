export interface I_ToastBody {
  severity: 'success' | 'info' | 'warn' | 'error';
  summary: string;
  detail: string;
}
