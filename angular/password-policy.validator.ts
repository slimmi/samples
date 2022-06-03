import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

const AT_LEAST_ALPHA_NUMERIC_REGEX = /^(?=.*[\d])(?=.*[a-z])(.*)$/i;

export function createPasswordPolicyValidatorFactory(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    let isValidPassword = false;

    if (!value) {
      return null;
    }

    isValidPassword = AT_LEAST_ALPHA_NUMERIC_REGEX.test(value);

    return !isValidPassword ? { passwordPolicy: true } : null;
  };
}
