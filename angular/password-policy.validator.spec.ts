import { FormControl, FormGroup } from '@angular/forms';
import { createPasswordPolicyValidatorFactory } from './password-policy.validator';

describe('Password policy', () => {
  let form;
  let control;

  beforeAll(() => {
    form = new FormGroup({
      control: new FormControl('', [
        createPasswordPolicyValidatorFactory(),
      ]),
    });
    control = form.get('control');
  });

  test('verify password is valid when empty', () => {
    control.setValue('');
    expect(control.valid).toEqual(true);
  });

  test('verify password is at least eight characters, one alphabetic character and one number', () => {
    control.setValue('1a');
    expect(control.valid).toEqual(true);
    control.setValue('a1');
    expect(control.valid).toEqual(true);
    control.setValue('a');
    expect(control.getError('passwordPolicy')).toEqual(true);
    control.setValue('1');
    expect(control.getError('passwordPolicy')).toEqual(true);
  });

  test('verify password is valid when symbols are used', () => {
    control.setValue('1a$');
    expect(control.valid).toEqual(true);
    control.setValue('a1Ã¸');
    expect(control.valid).toEqual(true);
  });
});
