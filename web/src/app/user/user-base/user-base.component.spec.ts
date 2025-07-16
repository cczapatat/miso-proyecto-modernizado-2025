// Path: web/src/app/user/user-base/user-base.component.spec.ts
import { UserBaseComponent } from './user-base.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { positiveNumberValidator } from '../../validators/positive-number.validator'; // Correct import

describe('UserBaseComponent', () => {
  let component: UserBaseComponent;
  let testForm: FormGroup;

  beforeEach(() => {
    component = new UserBaseComponent();
    testForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      // Corrected: Pass the function reference, not the result of calling it
      age: new FormControl(0, [Validators.required, positiveNumberValidator, Validators.pattern(/^\d+$/)]),
      height: new FormControl(0, [Validators.required, positiveNumberValidator]),
      email: new FormControl('', [Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]),
    });
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  describe('isFieldInvalid', () => {
    it('should return false if control is valid and untouched/undirty', () => {
      testForm.get('name')?.setValue('Test Name');
      expect(component.isFieldInvalid(testForm, 'name')).toBeFalse();
    });

    it('should return true if control is invalid and dirty', () => {
      testForm.get('name')?.markAsDirty();
      expect(component.isFieldInvalid(testForm, 'name')).toBeTrue();
    });

    it('should return true if control is invalid and touched', () => {
      testForm.get('name')?.markAsTouched();
      expect(component.isFieldInvalid(testForm, 'name')).toBeTrue();
    });

    it('should return false if control does not exist', () => {
      expect(component.isFieldInvalid(testForm, 'nonExistentControl')).toBeFalse();
    });
  });

  describe('getErrorMessage', () => {
    it('should return "COMMON.VALIDATION.REQUIRED" for required error', () => {
      testForm.get('name')?.markAsTouched();
      expect(component.getErrorMessage(testForm, 'name')).toBe('COMMON.VALIDATION.REQUIRED');
    });

    it('should return "COMMON.VALIDATION.MAX_LENGTH" for maxlength error', () => {
      testForm.get('name')?.setValue('a'.repeat(51));
      testForm.get('name')?.markAsTouched();
      expect(component.getErrorMessage(testForm, 'name')).toBe('COMMON.VALIDATION.MAX_LENGTH');
    });

    it('should return "COMMON.VALIDATION.POSITIVE_NUMBER" for positiveNumber error', () => {
      testForm.get('age')?.setValue(-10);
      testForm.get('age')?.markAsTouched();
      expect(component.getErrorMessage(testForm, 'age')).toBe('COMMON.VALIDATION.POSITIVE_NUMBER');
    });

    it('should return "COMMON.VALIDATION.INVALID_FORMAT" for pattern error (age not integer)', () => {
      testForm.get('age')?.setValue(10.5);
      testForm.get('age')?.markAsTouched();
      expect(component.getErrorMessage(testForm, 'age')).toBe('COMMON.VALIDATION.INVALID_FORMAT');
    });

    it('should return "COMMON.VALIDATION.INVALID_FORMAT" for pattern error (email)', () => {
      testForm.get('email')?.setValue('invalid-email');
      testForm.get('email')?.markAsTouched();
      expect(component.getErrorMessage(testForm, 'email')).toBe('COMMON.VALIDATION.INVALID_FORMAT');
    });

    it('should return null if no errors', () => {
      testForm.get('name')?.setValue('Valid Name');
      testForm.get('name')?.markAsTouched();
      expect(component.getErrorMessage(testForm, 'name')).toBeNull();
    });

    it('should return null if control does not exist', () => {
      expect(component.getErrorMessage(testForm, 'nonExistentControl')).toBeNull();
    });
  });
});