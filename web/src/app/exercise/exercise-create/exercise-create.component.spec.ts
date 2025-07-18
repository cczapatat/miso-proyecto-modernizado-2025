import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';

import { ExerciseCreateComponent } from './exercise-create.component';
import { ExerciseService } from 'src/app/services/exercise.service';
import { ExerciseDto } from 'src/app/dtos/exercise.dto';

describe('ExerciseCreateComponent', () => {
  let component: ExerciseCreateComponent;
  let fixture: ComponentFixture<ExerciseCreateComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockToastr: jasmine.SpyObj<ToastrService>;
  let mockTranslate: jasmine.SpyObj<TranslateService>;
  let mockExerciseService: jasmine.SpyObj<ExerciseService>;

  const mockExercise: ExerciseDto = {
    id: '1',
    name: 'Test Exercise',
    description: 'Test description',
    calories: '100',
    youtube: 'https://youtube.com/watch?v=test'
  };

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);
    const translateSpy = jasmine.createSpyObj('TranslateService', ['instant']);
    const exerciseServiceSpy = jasmine.createSpyObj('ExerciseService', ['createExercise']);

    await TestBed.configureTestingModule({
      declarations: [ExerciseCreateComponent],
      imports: [ReactiveFormsModule, TranslateModule.forRoot()],
      providers: [
        FormBuilder,
        { provide: Router, useValue: routerSpy },
        { provide: ToastrService, useValue: toastrSpy },
        { provide: TranslateService, useValue: translateSpy },
        { provide: ExerciseService, useValue: exerciseServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ExerciseCreateComponent);
    component = fixture.componentInstance;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockToastr = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
    mockTranslate = TestBed.inject(TranslateService) as jasmine.SpyObj<TranslateService>;
    mockExerciseService = TestBed.inject(ExerciseService) as jasmine.SpyObj<ExerciseService>;

    mockTranslate.instant.and.returnValue('Translated text');
    mockExerciseService.createExercise.and.returnValue(of(mockExercise));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize form on init', () => {
      spyOn(component, 'initializeForm');

      component.ngOnInit();

      expect(component.initializeForm).toHaveBeenCalled();
    });
  });

  describe('initializeForm', () => {
    it('should create form with correct validators', () => {
      component.initializeForm();

      expect(component.exerciseForm).toBeDefined();
      expect(component.exerciseForm.get('name')).toBeDefined();
      expect(component.exerciseForm.get('description')).toBeDefined();
      expect(component.exerciseForm.get('calories')).toBeDefined();
      expect(component.exerciseForm.get('youtube')).toBeDefined();

      component.exerciseForm.get('name')?.setValue('');
      expect(component.exerciseForm.get('name')?.invalid).toBe(true);

      component.exerciseForm.get('description')?.setValue('');
      expect(component.exerciseForm.get('description')?.invalid).toBe(true);

      component.exerciseForm.get('calories')?.setValue('');
      expect(component.exerciseForm.get('calories')?.invalid).toBe(true);

      component.exerciseForm.get('youtube')?.setValue('');
      expect(component.exerciseForm.get('youtube')?.invalid).toBe(true);
    });

    it('should validate maxLength for name field', () => {
      component.initializeForm();
      const longName = 'a'.repeat(256);

      component.exerciseForm.get('name')?.setValue(longName);

      expect(component.exerciseForm.get('name')?.invalid).toBe(true);
      expect(component.exerciseForm.get('name')?.hasError('maxlength')).toBe(true);
    });

    it('should validate maxLength for description field', () => {
      component.initializeForm();
      const longDescription = 'a'.repeat(1001);

      component.exerciseForm.get('description')?.setValue(longDescription);

      expect(component.exerciseForm.get('description')?.invalid).toBe(true);
      expect(component.exerciseForm.get('description')?.hasError('maxlength')).toBe(true);
    });

    it('should validate calories field for positive numbers only', () => {
      component.initializeForm();

      component.exerciseForm.get('calories')?.setValue('-5');
      expect(component.exerciseForm.get('calories')?.invalid).toBe(true);

      component.exerciseForm.get('calories')?.setValue('0');
      expect(component.exerciseForm.get('calories')?.invalid).toBe(true);

      component.exerciseForm.get('calories')?.setValue('abc');
      expect(component.exerciseForm.get('calories')?.invalid).toBe(true);

      component.exerciseForm.get('calories')?.setValue('100');
      expect(component.exerciseForm.get('calories')?.valid).toBe(true);
    });

    it('should validate YouTube URL format', () => {
      component.initializeForm();

      component.exerciseForm.get('youtube')?.setValue('invalid-url');
      expect(component.exerciseForm.get('youtube')?.invalid).toBe(true);

      component.exerciseForm.get('youtube')?.setValue('https://youtube.com/watch?v=test');
      expect(component.exerciseForm.get('youtube')?.valid).toBe(true);

      component.exerciseForm.get('youtube')?.setValue('https://youtu.be/test123');
      expect(component.exerciseForm.get('youtube')?.invalid).toBe(true);
    });

    it('should initialize form with empty values', () => {
      component.initializeForm();

      expect(component.exerciseForm.get('name')?.value).toBe('');
      expect(component.exerciseForm.get('description')?.value).toBe('');
      expect(component.exerciseForm.get('calories')?.value).toBe('');
      expect(component.exerciseForm.get('youtube')?.value).toBe('');
    });
  });

  describe('onSubmit', () => {
    beforeEach(() => {
      component.initializeForm();
      component.exerciseForm.patchValue({
        name: 'New Exercise',
        description: 'New description',
        calories: '120',
        youtube: 'https://youtube.com/watch?v=newvideo'
      });
    });

    it('should submit form when valid', () => {
      component.onSubmit();

      expect(component.isSubmitting).toBe(true);
      expect(mockExerciseService.createExercise).toHaveBeenCalledWith(jasmine.any(ExerciseDto));
      expect(mockToastr.success).toHaveBeenCalledWith('Translated text', 'Translated text');
      expect(mockTranslate.instant).toHaveBeenCalledWith('EXERCISE_CREATE.SUCCESS_MESSAGE');
      expect(mockTranslate.instant).toHaveBeenCalledWith('EXERCISE_CREATE.SUCCESS_TITLE');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/exercises']);
    });

    it('should not submit when form is invalid', () => {
      component.exerciseForm.get('name')?.setValue('');
      spyOn(component, 'markFormGroupTouched' as any);

      component.onSubmit();

      expect(component['markFormGroupTouched']).toHaveBeenCalled();
      expect(mockExerciseService.createExercise).not.toHaveBeenCalled();
    });

    it('should handle error when creating exercise', () => {
      mockExerciseService.createExercise.and.returnValue(throwError(() => new Error('API Error')));

      component.onSubmit();

      expect(component.isSubmitting).toBe(false);
      expect(mockToastr.error).toHaveBeenCalledWith('Translated text', 'Translated text');
      expect(mockTranslate.instant).toHaveBeenCalledWith('EXERCISE_CREATE.ERROR_MESSAGE');
      expect(mockTranslate.instant).toHaveBeenCalledWith('EXERCISE_CREATE.ERROR_TITLE');
    });

    it('should create ExerciseDto without id', () => {
      component.onSubmit();

      const expectedDto = new ExerciseDto(
        'New Exercise',
        'New description',
        '120',
        'https://youtube.com/watch?v=newvideo'
      );

      expect(mockExerciseService.createExercise).toHaveBeenCalledWith(expectedDto);
    });
  });

  describe('onCancel', () => {
    it('should navigate to exercises list', () => {
      component.onCancel();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/exercises']);
    });
  });

  describe('formControls getter', () => {
    it('should return form controls', () => {
      component.initializeForm();

      const controls = component.formControls;

      expect(controls).toBe(component.exerciseForm.controls);
      expect(controls['name']).toBeDefined();
      expect(controls['description']).toBeDefined();
      expect(controls['calories']).toBeDefined();
      expect(controls['youtube']).toBeDefined();
    });
  });

  describe('markFormGroupTouched', () => {
    it('should mark all form controls as touched', () => {
      component.initializeForm();

      component['markFormGroupTouched']();

      Object.keys(component.exerciseForm.controls).forEach(key => {
        expect(component.exerciseForm.get(key)?.touched).toBe(true);
      });
    });
  });

  describe('Component initialization state', () => {
    it('should initialize with correct default values', () => {
      expect(component.isSubmitting).toBe(false);
    });
  });

  describe('Form validation integration', () => {
    beforeEach(() => {
      component.initializeForm();
    });

    it('should be valid with all correct inputs', () => {
      component.exerciseForm.patchValue({
        name: 'Valid Exercise',
        description: 'Valid description',
        calories: '100',
        youtube: 'https://youtube.com/watch?v=validvideo'
      });

      expect(component.exerciseForm.valid).toBe(true);
    });

    it('should be invalid with missing required fields', () => {
      component.exerciseForm.patchValue({
        name: '',
        description: '',
        calories: '',
        youtube: ''
      });

      expect(component.exerciseForm.invalid).toBe(true);
    });

    it('should be invalid with invalid field formats', () => {
      component.exerciseForm.patchValue({
        name: 'Valid Exercise',
        description: 'Valid description',
        calories: 'invalid-calories',
        youtube: 'invalid-url'
      });

      expect(component.exerciseForm.invalid).toBe(true);
      expect(component.exerciseForm.get('calories')?.invalid).toBe(true);
      expect(component.exerciseForm.get('youtube')?.invalid).toBe(true);
    });
  });

  describe('ExerciseDto creation', () => {
    beforeEach(() => {
      component.initializeForm();
      component.exerciseForm.patchValue({
        name: 'Test Exercise',
        description: 'Test description',
        calories: '100',
        youtube: 'https://youtube.com/watch?v=test'
      });
    });

    it('should create ExerciseDto with form values and no ID', () => {
      component.onSubmit();

      const expectedDto = new ExerciseDto(
        'Test Exercise',
        'Test description',
        '100',
        'https://youtube.com/watch?v=test'
      );

      expect(mockExerciseService.createExercise).toHaveBeenCalledWith(expectedDto);
    });
  });

  describe('Form field validation edge cases', () => {
    beforeEach(() => {
      component.initializeForm();
    });

    it('should handle boundary values for name field', () => {
      const maxValidName = 'a'.repeat(255);
      component.exerciseForm.get('name')?.setValue(maxValidName);
      expect(component.exerciseForm.get('name')?.valid).toBe(true);

      const tooLongName = 'a'.repeat(256);
      component.exerciseForm.get('name')?.setValue(tooLongName);
      expect(component.exerciseForm.get('name')?.invalid).toBe(true);
    });

    it('should handle boundary values for description field', () => {
      const maxValidDescription = 'a'.repeat(1000);
      component.exerciseForm.get('description')?.setValue(maxValidDescription);
      expect(component.exerciseForm.get('description')?.valid).toBe(true);

      const tooLongDescription = 'a'.repeat(1001);
      component.exerciseForm.get('description')?.setValue(tooLongDescription);
      expect(component.exerciseForm.get('description')?.invalid).toBe(true);
    });

    it('should handle boundary values for youtube field', () => {
      const validUrl = 'https://youtube.com/watch?v=abcdefghijk';
      component.exerciseForm.get('youtube')?.setValue(validUrl);
      expect(component.exerciseForm.get('youtube')?.valid).toBe(true);

      const baseUrl = 'https://youtube.com/watch?v=';
      const longVideoId = 'a'.repeat(500 - baseUrl.length + 1);
      const tooLongUrl = baseUrl + longVideoId;
      component.exerciseForm.get('youtube')?.setValue(tooLongUrl);
      expect(component.exerciseForm.get('youtube')?.hasError('maxlength')).toBe(true);
    });
  });

  describe('Error handling', () => {
    beforeEach(() => {
      component.initializeForm();
    });

    it('should handle network errors gracefully', () => {
      component.exerciseForm.patchValue({
        name: 'Test Exercise',
        description: 'Test description',
        calories: '100',
        youtube: 'https://youtube.com/watch?v=test'
      });

      const networkError = { status: 0, message: 'Network error' };
      mockExerciseService.createExercise.and.returnValue(throwError(() => networkError));

      component.onSubmit();

      expect(component.isSubmitting).toBe(false);
      expect(mockToastr.error).toHaveBeenCalled();
    });

    it('should handle server validation errors', () => {
      component.exerciseForm.patchValue({
        name: 'Test Exercise',
        description: 'Test description',
        calories: '100',
        youtube: 'https://youtube.com/watch?v=test'
      });

      const validationError = { status: 422, message: 'Validation failed' };
      mockExerciseService.createExercise.and.returnValue(throwError(() => validationError));

      component.onSubmit();

      expect(component.isSubmitting).toBe(false);
      expect(mockToastr.error).toHaveBeenCalled();
    });
  });
});
