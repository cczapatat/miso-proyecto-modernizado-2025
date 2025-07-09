import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';

import { ExerciseEditComponent } from './exercise-edit.component';
import { ExerciseService } from 'src/app/services/exercise.service';
import { ExerciseDto } from 'src/app/dtos/exercise.dto';

describe('ExerciseEditComponent', () => {
  let component: ExerciseEditComponent;
  let fixture: ComponentFixture<ExerciseEditComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: any;
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
    const exerciseServiceSpy = jasmine.createSpyObj('ExerciseService', [
      'getExerciseById',
      'updateExercise'
    ]);

    mockActivatedRoute = {
      snapshot: {
        params: { id: '1' }
      }
    };

    await TestBed.configureTestingModule({
      declarations: [ExerciseEditComponent],
      imports: [ReactiveFormsModule, TranslateModule.forRoot()],
      providers: [
        FormBuilder,
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: ToastrService, useValue: toastrSpy },
        { provide: TranslateService, useValue: translateSpy },
        { provide: ExerciseService, useValue: exerciseServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ExerciseEditComponent);
    component = fixture.componentInstance;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockToastr = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
    mockTranslate = TestBed.inject(TranslateService) as jasmine.SpyObj<TranslateService>;
    mockExerciseService = TestBed.inject(ExerciseService) as jasmine.SpyObj<ExerciseService>;

    mockTranslate.instant.and.returnValue('Translated text');
    mockExerciseService.getExerciseById.and.returnValue(of(mockExercise));
    mockExerciseService.updateExercise.and.returnValue(of(mockExercise));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize component correctly', () => {
      spyOn(component, 'initializeForm');
      spyOn(component, 'loadExercise');

      component.ngOnInit();

      expect(component.exerciseId).toBe('1');
      expect(component.initializeForm).toHaveBeenCalled();
      expect(component.loadExercise).toHaveBeenCalled();
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
    });
  });

  describe('loadExercise', () => {
    beforeEach(() => {
      component.initializeForm();
      component.exerciseId = '1';
    });

    it('should load exercise and populate form', () => {
      component.loadExercise();

      expect(mockExerciseService.getExerciseById).toHaveBeenCalledWith(1);
      expect(component.exerciseForm.get('name')?.value).toBe(mockExercise.name);
      expect(component.exerciseForm.get('description')?.value).toBe(mockExercise.description);
      expect(component.exerciseForm.get('calories')?.value).toBe(mockExercise.calories);
      expect(component.exerciseForm.get('youtube')?.value).toBe(mockExercise.youtube);
      expect(component.isLoading).toBe(false);
    });

    it('should handle error when loading exercise', () => {
      mockExerciseService.getExerciseById.and.returnValue(throwError(() => new Error('API Error')));

      component.loadExercise();

      expect(component.isLoading).toBe(false);
      expect(mockToastr.error).toHaveBeenCalledWith('Translated text', 'Translated text');
      expect(mockTranslate.instant).toHaveBeenCalledWith('EXERCISE_EDIT.ERROR_LOADING_MESSAGE');
      expect(mockTranslate.instant).toHaveBeenCalledWith('EXERCISE_EDIT.ERROR_LOADING_TITLE');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/exercises']);
    });
  });

  describe('onSubmit', () => {
    beforeEach(() => {
      component.initializeForm();
      component.exerciseId = '1';
      component.exerciseForm.patchValue({
        name: 'Updated Exercise',
        description: 'Updated description',
        calories: '150',
        youtube: 'https://youtube.com/watch?v=updated'
      });
    });

    it('should submit form when valid', () => {
      component.onSubmit();

      expect(component.isSubmitting).toBe(true);
      expect(mockExerciseService.updateExercise).toHaveBeenCalledWith(1, jasmine.any(ExerciseDto));
      expect(mockToastr.success).toHaveBeenCalledWith('Translated text', 'Translated text');
      expect(mockTranslate.instant).toHaveBeenCalledWith('EXERCISE_EDIT.SUCCESS_MESSAGE');
      expect(mockTranslate.instant).toHaveBeenCalledWith('EXERCISE_EDIT.SUCCESS_TITLE');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/exercises']);
    });

    it('should not submit when form is invalid', () => {
      component.exerciseForm.get('name')?.setValue('');
      spyOn(component, 'markFormGroupTouched' as any);

      component.onSubmit();

      expect(component['markFormGroupTouched']).toHaveBeenCalled();
      expect(mockExerciseService.updateExercise).not.toHaveBeenCalled();
    });

    it('should handle error when updating exercise', () => {
      mockExerciseService.updateExercise.and.returnValue(throwError(() => new Error('API Error')));

      component.onSubmit();

      expect(component.isSubmitting).toBe(false);
      expect(mockToastr.error).toHaveBeenCalledWith('Translated text', 'Translated text');
      expect(mockTranslate.instant).toHaveBeenCalledWith('EXERCISE_EDIT.ERROR_MESSAGE');
      expect(mockTranslate.instant).toHaveBeenCalledWith('EXERCISE_EDIT.ERROR_TITLE');
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
      expect(component.isLoading).toBe(true);
      expect(component.exerciseId).toBeUndefined();
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
  });

  describe('ExerciseDto creation', () => {
    beforeEach(() => {
      component.initializeForm();
      component.exerciseId = '1';
      component.exerciseForm.patchValue({
        name: 'Test Exercise',
        description: 'Test description',
        calories: '100',
        youtube: 'https://youtube.com/watch?v=test'
      });
    });

    it('should create ExerciseDto with form values and exercise ID', () => {
      component.onSubmit();

      const expectedDto = new ExerciseDto(
        'Test Exercise',
        'Test description',
        '100',
        'https://youtube.com/watch?v=test',
        '1'
      );

      expect(mockExerciseService.updateExercise).toHaveBeenCalledWith(1, expectedDto);
    });
  });
});
