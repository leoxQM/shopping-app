import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appOnlyTwoDigits]',
  standalone: true
})
export class OnlyTwoDigitsDirective {

  constructor() { }

  @HostListener('input', ['$event'])
  onInput(event: InputEvent) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '').slice(0, 2);
    // Para que se actualice el FormControl
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
    nativeInputValueSetter?.call(input, input.value);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }

}
