import { FormGroup } from '@angular/forms';

export class UserBaseComponent {
  // Common properties or methods for user components can go here.
  // For example, a method to check if a form control has errors.

  /**
   * Checks if a form control is invalid and touched/dirty.
   * @param form The FormGroup instance.
   * @param controlName The name of the form control.
   * @returns True if the control is invalid and has been interacted with, false otherwise.
   */
  isFieldInvalid(form: FormGroup, controlName: string): boolean {
    const control = form.get(controlName);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  /**
   * Gets the error message for a specific form control.
   * @param form The FormGroup instance.
   * @param controlName The name of the form control.
   * @returns The error message string or null if no error.
   */
  getErrorMessage(form: FormGroup, controlName: string): string | null {
    const control = form.get(controlName);
    if (control && control.errors) {
      if (control.errors['required']) {
        return 'This field is required.';
      }
      if (control.errors['minlength']) {
        return `Minimum length is ${control.errors['minlength'].requiredLength}.`;
      }
      if (control.errors['maxlength']) {
        return `Maximum length is ${control.errors['maxlength'].requiredLength}.`;
      }
      if (control.errors['positiveNumber']) {
        return 'Please enter a positive number.';
      }
      if (control.errors['pattern']) {
        return 'Invalid format.';
      }
    }
    return null;
  }
}