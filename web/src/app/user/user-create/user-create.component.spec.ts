// Path: web/src/app/user/user-create/user-create.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';

import { UserCreateComponent } from './user-create.component';
import { UserService } from '../../services/user.service';
import { UserDto } from '../../dtos/user.dto';
import { positiveNumberValidator } from '../../validators/positive-number.validator';
import { Router } from '@angular/router';

describe('UserCreateComponent', () => {
  let component: UserCreateComponent;
  let fixture: ComponentFixture<UserCreateComponent>;
  let userService: UserService;
  let toastrService: ToastrService;
  let translateService: TranslateService;
  let router: Router;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserCreateComponent],
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        ReactiveFormsModule,
        ToastrModule.forRoot(),
        TranslateModule.forRoot()
      ],
      providers: [
        UserService,
        ToastrService,
        TranslateService,
        FormBuilder // Provide FormBuilder here
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserCreateComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    toastrService = TestBed.inject(ToastrService);
    translateService = TestBed.inject(TranslateService);
    router = TestBed.inject(Router);
    formBuilder = TestBed.inject(FormBuilder); // Inject FormBuilder

    // Initialize translations for tests
    spyOn(translateService, 'get').and.returnValue(of('Translated Message'));
    spyOn(translateService, 'instant').and.returnValue('Instant Translated Message');

    fixture.detectChanges(); // ngOnInit is called here
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with correct controls and validators', () => {
    expect(component.userForm).toBeDefined();
    expect(component.userForm.get('name')).toBeDefined();
    expect(component.userForm.get('last_name')).toBeDefined();
    expect(component.userForm.get('age')).toBeDefined();
    expect(component.userForm.get('height')).toBeDefined();
    expect(component.userForm.get('weight')).toBeDefined();
    expect(component.userForm.get('arm')).toBeDefined();
    expect(component.userForm.get('chest')).toBeDefined();
    expect(component.userForm.get('waist')).toBeDefined();
    expect(component.userForm.get('leg')).toBeDefined();
    expect(component.userForm.get('withdrawal_date')).toBeDefined();
    expect(component.userForm.get('withdrawal_reason')).toBeDefined();

    // Test validators by checking validation errors
    const nameControl = component.userForm.get('name');
    nameControl?.setValue('');
    expect(nameControl?.errors?.['required']).toBeTruthy();

    const ageControl = component.userForm.get('age');
    ageControl?.setValue('');
    expect(ageControl?.errors?.['required']).toBeTruthy();
    
    ageControl?.setValue(-5);
    expect(ageControl?.errors?.['positiveNumber']).toBeTruthy();
    
    ageControl?.setValue(10.5);
    expect(ageControl?.errors?.['pattern']).toBeTruthy();
  });

  describe('onSubmit', () => {
    const newUser: UserDto = {
      name: 'Test', last_name: 'User', age: 30, height: 1.75, weight: 70,
      arm: 30, chest: 100, waist: 80, leg: 90, withdrawal_date: '', withdrawal_reason: ''
    };

    it('should call userService.createUser and navigate on success', () => {
      spyOn(userService, 'createUser').and.returnValue(of(newUser));
      spyOn(toastrService, 'success');
      spyOn(router, 'navigate');

      component.userForm.patchValue(newUser);
      component.onSubmit();

      expect(userService.createUser).toHaveBeenCalled();
      expect(toastrService.success).toHaveBeenCalledWith('Translated Message', 'Instant Translated Message');
      expect(router.navigate).toHaveBeenCalledWith(['/users']);
    });

    it('should show error toast and set isSubmitting to false on API error', () => {
      const errorResponse = new Error('API Error');
      spyOn(userService, 'createUser').and.returnValue(throwError(() => errorResponse));
      spyOn(toastrService, 'error');

      component.userForm.patchValue(newUser);
      component.onSubmit();

      expect(userService.createUser).toHaveBeenCalled();
      expect(toastrService.error).toHaveBeenCalledWith('Translated Message', 'Instant Translated Message');
      expect(component.isSubmitting).toBeFalse();
    });

    it('should mark all fields as touched and show error if form is invalid', () => {
      spyOn(userService, 'createUser');
      spyOn(toastrService, 'error');
      spyOn(component.userForm, 'markAllAsTouched');

      // Set name to empty to make it invalid
      component.userForm.get('name')?.setValue('');
      component.onSubmit();

      expect(component.userForm.valid).toBeFalse();
      expect(component.userForm.markAllAsTouched).toHaveBeenCalled();
      expect(toastrService.error).toHaveBeenCalledWith('Translated Message', 'Instant Translated Message');
      expect(userService.createUser).not.toHaveBeenCalled();
    });
  });

  describe('onCancel', () => {
    it('should navigate to the users list', () => {
      spyOn(router, 'navigate');
      component.onCancel();
      expect(router.navigate).toHaveBeenCalledWith(['/users']);
    });
  });

  describe('inherited methods', () => {
    it('isFieldInvalid should work correctly', () => {
      // Test required field
      component.userForm.get('name')?.setValue('');
      component.userForm.get('name')?.markAsTouched();
      expect(component.isFieldInvalid(component.userForm, 'name')).toBeTrue();

      component.userForm.get('name')?.setValue('Valid');
      expect(component.isFieldInvalid(component.userForm, 'name')).toBeFalse();
    });

    it('getErrorMessage should return correct messages', () => {
      // Test required
      component.userForm.get('name')?.setValue('');
      component.userForm.get('name')?.markAsTouched();
      expect(component.getErrorMessage(component.userForm, 'name')).toBe('COMMON.VALIDATION.REQUIRED');

      // Test positiveNumber
      component.userForm.get('age')?.setValue(-5);
      component.userForm.get('age')?.markAsTouched();
      expect(component.getErrorMessage(component.userForm, 'age')).toBe('COMMON.VALIDATION.POSITIVE_NUMBER');

      // Test pattern (age not integer)
      component.userForm.get('age')?.setValue(10.5);
      component.userForm.get('age')?.markAsTouched();
      expect(component.getErrorMessage(component.userForm, 'age')).toBe('COMMON.VALIDATION.INVALID_FORMAT');
    });
  });

  it('should unsubscribe from subscriptions on destroy', () => {
    const sub = of(null).subscribe();
    component['subscriptions'].push(sub);
    spyOn(sub, 'unsubscribe');
    component.ngOnDestroy();
    expect(sub.unsubscribe).toHaveBeenCalled();
  });
});