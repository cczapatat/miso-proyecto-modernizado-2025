// Path: web/src/app/user/user-edit/user-edit.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators'; // Import delay for async tests if needed

import { UserEditComponent } from './user-edit.component';
import { UserService } from '../../services/user.service';
import { UserDto } from '../../dtos/user.dto';
import { positiveNumberValidator } from '../../validators/positive-number.validator';

describe('UserEditComponent', () => {
  let component: UserEditComponent;
  let fixture: ComponentFixture<UserEditComponent>;
  let userService: UserService;
  let toastrService: ToastrService;
  let translateService: TranslateService;
  let router: Router;
  let activatedRoute: ActivatedRoute;
  let formBuilder: FormBuilder;

  const mockUser: UserDto = {
    id: 1, name: 'John', last_name: 'Doe', age: 30, height: 1.75, weight: 70,
    arm: 30, chest: 100, waist: 80, leg: 90, created_at: '2023-01-01', updated_at: '2023-01-01',
    withdrawal_date: '', withdrawal_reason: ''
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserEditComponent],
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
        FormBuilder,
        {
          provide: ActivatedRoute, // Default mock for ActivatedRoute
          useValue: {
            paramMap: of({ get: (key: string) => (key === 'id' ? '1' : null) })
          }
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserEditComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    toastrService = TestBed.inject(ToastrService);
    translateService = TestBed.inject(TranslateService);
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);
    formBuilder = TestBed.inject(FormBuilder);

    spyOn(translateService, 'get').and.returnValue(of('Translated Message'));
    spyOn(translateService, 'instant').and.returnValue('Instant Translated Message');

    fixture.detectChanges(); // ngOnInit is called here
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form and load user data on ngOnInit', () => {
    spyOn(userService, 'getUserById').and.returnValue(of(mockUser));
    component.ngOnInit(); // Call ngOnInit manually after setting up spy
    
    expect(component.userId).toBe(1);
    expect(component.isLoading).toBeFalse();
    expect(userService.getUserById).toHaveBeenCalledWith(1);
    expect(component.userForm.value.name).toBe(mockUser.name);
    expect(component.userForm.value.last_name).toBe(mockUser.last_name);
    expect(component.userForm.value.age).toBe(mockUser.age);
    
    // Test validators by checking validation errors
    const nameControl = component.userForm.get('name');
    nameControl?.setValue('');
    expect(nameControl?.errors?.['required']).toBeTruthy();

    const ageControl = component.userForm.get('age');
    ageControl?.setValue(-5);
    expect(ageControl?.errors?.['positiveNumber']).toBeTruthy();
  });

  it('should navigate to /users and show error if no ID is provided', () => {
    // Create a separate test for this scenario without overrideProvider
    const fixture2 = TestBed.createComponent(UserEditComponent);
    const component2 = fixture2.componentInstance;
    
    // Mock the ActivatedRoute directly on the component
    const mockActivatedRoute = {
      paramMap: of({ get: (key: string) => null }) // Simulate no ID
    };
    
    spyOn(router, 'navigate');
    spyOn(toastrService, 'error');
    spyOn(userService, 'getUserById');
    
    // Manually set the route
    (component2 as any).route = mockActivatedRoute;
    
    component2.ngOnInit(); // Call ngOnInit manually

    expect(component2.userId).toBe(0); // Number(null) results in 0
    expect(toastrService.error).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/users']);
    expect(userService.getUserById).not.toHaveBeenCalled(); // Verify getUserById was not called
  });

  it('should show error and navigate to /users if user data loading fails', () => {
    spyOn(router, 'navigate');
    spyOn(toastrService, 'error');
    
    // Create a new spy for this test to avoid conflicts
    const getUserByIdSpy = spyOn(userService, 'getUserById').and.returnValue(throwError(() => new Error('User not found')));

    component.loadUserData(1); // Manually call loadUserData to test error path

    expect(toastrService.error).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/users']);
    expect(component.isLoading).toBeFalse();
  });

  describe('onSubmit', () => {
    const updatedUser: UserDto = {
      id: 1, name: 'Updated John', last_name: 'Updated Doe', age: 31, height: 1.76, weight: 71,
      arm: 31, chest: 101, waist: 81, leg: 91, created_at: '2023-01-01', updated_at: '2023-01-02',
      withdrawal_date: '', withdrawal_reason: ''
    };

    beforeEach(() => {
      // Ensure the form is valid before each onSubmit test
      component.userForm.patchValue(mockUser);
      component.userId = mockUser.id;
      component.userForm.markAsPristine(); // Reset state
      component.userForm.markAsUntouched();
    });

    it('should call userService.updateUser and navigate on success', () => {
      spyOn(userService, 'updateUser').and.returnValue(of(updatedUser));
      spyOn(toastrService, 'success');
      spyOn(router, 'navigate');

      component.userForm.setValue(updatedUser);
      component.onSubmit();

      expect(userService.updateUser).toHaveBeenCalledWith(mockUser.id!, updatedUser);
      expect(toastrService.success).toHaveBeenCalledWith('Translated Message', 'Instant Translated Message');
      expect(router.navigate).toHaveBeenCalledWith(['/users']);
    });

    it('should show error toast and set isSubmitting to false on API error', () => {
      const errorResponse = new Error('API Error');
      spyOn(userService, 'updateUser').and.returnValue(throwError(() => errorResponse));
      spyOn(toastrService, 'error');

      component.userForm.setValue(updatedUser); // Ensure form is valid
      component.onSubmit();

      expect(userService.updateUser).toHaveBeenCalledWith(mockUser.id!, updatedUser);
      expect(toastrService.error).toHaveBeenCalledWith('Translated Message', 'Instant Translated Message');
      expect(component.isSubmitting).toBeFalse();
    });

    it('should mark all fields as touched and show error if form is invalid', () => {
      spyOn(userService, 'updateUser');
      spyOn(toastrService, 'error');
      spyOn(component.userForm, 'markAllAsTouched');

      component.userForm.get('name')?.setValue(''); // Make form invalid
      component.onSubmit();

      expect(component.userForm.valid).toBeFalse();
      expect(component.userForm.markAllAsTouched).toHaveBeenCalled();
      expect(toastrService.error).toHaveBeenCalledWith('Translated Message', 'Instant Translated Message');
      expect(userService.updateUser).not.toHaveBeenCalled();
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
      component.userForm.get('name')?.setValue('');
      component.userForm.get('name')?.markAsTouched();
      expect(component.isFieldInvalid(component.userForm, 'name')).toBeTrue();
    });

    it('getErrorMessage should return correct messages', () => {
      component.userForm.get('name')?.setValue('');
      component.userForm.get('name')?.markAsTouched();
      expect(component.getErrorMessage(component.userForm, 'name')).toBe('This field is required.');
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