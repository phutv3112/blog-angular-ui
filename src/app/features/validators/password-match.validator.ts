import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordMatchValidator(password: string, passwordConfirm: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const passwordValue = control.get(password)?.value;
    const passwordConfirmValue = control.get(passwordConfirm)?.value;
    
    if (passwordValue !== passwordConfirmValue) {
      return { passwordMismatch: true };
    }
    
    return null;
  };
}
