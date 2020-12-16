import { FormGroup } from '@angular/forms';
import { FormSubmitterService } from '../services/form-submitter.service';
import { HttpHeaders } from '@angular/common/http';
import { Directive, ElementRef, ViewChild } from '@angular/core';

@Directive()
export class AbstractForm {

  protected action;
  protected method = 'POST';
  protected headers: HttpHeaders | { [header: string]: string | string[] } = {};
  protected data: { [k: string]: any } = {};

  @ViewChild('submitButton', { static: true })
  public submitButton: ElementRef = null;

  @ViewChild('passwordField', { static: true })
  public passwordField: ElementRef = null;

  public formGroup: FormGroup;

  public isSent = false;
  public isSending = false;
  public isSubmitted = false;
  public isFileProcessing = false;

  public hasError = false;
  public errors: { [k: string]: any } = {};

  constructor(action: string, method: string = null, protected formSubmitterService: FormSubmitterService) {
    this.action = action;

    if (method) {
      this.method = method;
    }
  }

  get form() {
    return this.formGroup.controls;
  }

  public isInputInvalid(name: string) {
    const input = this.formGroup.controls[name];

    return input && input.invalid && (input.dirty || input.touched || this.isSubmitted);
  }

  public isError(name: string, error: string) {
    const input = this.formGroup.controls[name];

    return this.isInputInvalid(name) && input.errors && input.errors[error];
  }

  public beforeSubmit() {
  }

  public onSubmitSuccess(data: ArrayBuffer) {
  }

  public onSubmitError(data: any) {
  }

  public onSubmitComplete() {
  }

  public changePasswordType(): void {
    let type = 'password';

    if (this.passwordField) {
      if (this.passwordField.nativeElement.type === type) {
        type = 'text';
      }

      this.passwordField.nativeElement.type = type;
    }
  }

  public submit() {
    this.isSubmitted = true;

    if (this.formGroup.invalid || this.isSending) {
      return;
    }

    this.beforeSubmit();
    this.startSending();

    this.formSubmitterService.action = this.action;
    this.formSubmitterService.method = this.method;

    this.formSubmitterService
      .submit(this.perepareData(), {
        headers: this.headers
      })
      .subscribe(
        (data) => {
          // this.isSending = false;
          this.isSent = true;
          this.onSubmitSuccess(data);
        },
        (data) => {
          this.completeSending();
          this.hasError = true;

          if (data.error) {
            if (data.error.errors) {
              this.errors = data.error.errors;
            }

            for (const field in this.errors) {
              const message = this.errors[field];
              const control = this.formGroup.controls[field];

              if (control) {
                control.setErrors({
                  general: message
                });
              }
            }
          }

          this.onSubmitError(data);
        },
        () => {
          this.completeSending();
          this.onSubmitComplete();
        }
      );
  }

  perepareData(): FormData {
    const formData: any = new FormData();

    if (this.data) {
      this.data = { ...this.data, ...this.formGroup.value };
    } else {
      this.data = this.formGroup.value;
    }

    for (const key in this.data) {
      formData.append(key, this.data[key]);
    }

    return formData;
  }

  protected resetErrors() {
    this.hasError = false;
    this.errors = {};
  }

  protected startSending() {
    this.isSending = true;

    this.resetErrors();

    if (this.submitButton) {
      this.submitButton.nativeElement.disabled = true;
    }
  }

  protected completeSending() {
    this.isSending = false;

    if (this.submitButton) {
      this.submitButton.nativeElement.disabled = false;
    }
  }
}
