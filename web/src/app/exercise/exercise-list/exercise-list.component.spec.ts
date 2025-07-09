import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

import { ExerciseListComponent } from './exercise-list.component';
import { ExerciseService } from 'src/app/services/exercise.service';
import { ExercisePageDto, ExerciseDto } from 'src/app/dtos/exercise.dto';
import { UtilPagination } from 'src/app/utils/util-pagination';

describe('ExerciseListComponent', () => {
  let component: ExerciseListComponent;
  let fixture: ComponentFixture<ExerciseListComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockToastr: jasmine.SpyObj<ToastrService>;
  let mockTranslate: jasmine.SpyObj<TranslateService>;
  let mockExerciseService: jasmine.SpyObj<ExerciseService>;

  const mockExercisePageDto: ExercisePageDto = {
    exercises: [
      { id: '1', name: 'Push-ups', description: 'Upper body exercise', calories: '50', youtube: 'https://youtube.com/watch?v=test1' },
      { id: '2', name: 'Squats', description: 'Lower body exercise', calories: '60', youtube: 'https://youtube.com/watch?v=test2' }
    ],
    page: 1,
    per_page: 10,
    total: 2,
    total_pages: 1
  };

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
    const translateSpy = jasmine.createSpyObj('TranslateService', ['instant', 'get', 'stream']);
    const exerciseServiceSpy = jasmine.createSpyObj('ExerciseService', [
      'getExercisesPaginated',
      'getExerciseById',
      'deleteExerciseById'
    ]);

    await TestBed.configureTestingModule({
      declarations: [ExerciseListComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: ToastrService, useValue: toastrSpy },
        { provide: TranslateService, useValue: translateSpy },
        { provide: ExerciseService, useValue: exerciseServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ExerciseListComponent);
    component = fixture.componentInstance;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockToastr = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
    mockTranslate = TestBed.inject(TranslateService) as jasmine.SpyObj<TranslateService>;
    mockExerciseService = TestBed.inject(ExerciseService) as jasmine.SpyObj<ExerciseService>;

    mockTranslate.instant.and.returnValue('Translated text');
    mockTranslate.get.and.returnValue(of('Translated text'));
    mockTranslate.stream.and.returnValue(of('Translated text'));
    mockExerciseService.getExercisesPaginated.and.returnValue(of(mockExercisePageDto));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call listExercises on initialization', () => {
      spyOn(component, 'listExercises');
      component.ngOnInit();
      expect(component.listExercises).toHaveBeenCalled();
    });
  });

  describe('listExercises', () => {
    it('should fetch exercises successfully', () => {
      component.listExercises();

      expect(mockExerciseService.getExercisesPaginated).toHaveBeenCalledWith(1, 10);
      expect(component.exercisesPage).toEqual(mockExercisePageDto);
    });

    it('should handle error when fetching exercises', () => {
      mockExerciseService.getExercisesPaginated.and.returnValue(throwError(() => new Error('API Error')));

      component.listExercises();

      expect(mockToastr.error).toHaveBeenCalledWith('Translated text', 'Translated text');
      expect(mockTranslate.instant).toHaveBeenCalledWith('EXERCISE_LIST.ERROR_LIST_EXERCISES');
      expect(mockTranslate.instant).toHaveBeenCalledWith('EXERCISE_LIST.ERROR_TITLE_EXERCISES');
    });

    it('should use current page and per_page from exercisesPage', () => {
      component.exercisesPage.page = 2;
      component.exercisesPage.per_page = 5;

      component.listExercises();

      expect(mockExerciseService.getExercisesPaginated).toHaveBeenCalledWith(2, 5);
    });
  });

  describe('changeExercisePage', () => {
    it('should increment page and call listExercises', () => {
      spyOn(component, 'listExercises');
      component.exercisesPage.page = 1;

      component.changeExercisePage(1);

      expect(component.exercisesPage.page).toBe(2);
      expect(component.listExercises).toHaveBeenCalled();
    });

    it('should decrement page and call listExercises', () => {
      spyOn(component, 'listExercises');
      component.exercisesPage.page = 3;

      component.changeExercisePage(-1);

      expect(component.exercisesPage.page).toBe(2);
      expect(component.listExercises).toHaveBeenCalled();
    });
  });

  describe('onClickExercisePage', () => {
    it('should change page and call listExercises when page is different', () => {
      spyOn(component, 'listExercises');
      component.exercisesPage.page = 1;

      component.onClickExercisePage(3);

      expect(component.exercisesPage.page).toBe(3);
      expect(component.listExercises).toHaveBeenCalled();
    });

    it('should not call listExercises when page is the same', () => {
      spyOn(component, 'listExercises');
      component.exercisesPage.page = 2;

      component.onClickExercisePage(2);

      expect(component.exercisesPage.page).toBe(2);
      expect(component.listExercises).not.toHaveBeenCalled();
    });

    it('should handle string page numbers', () => {
      spyOn(component, 'listExercises');
      component.exercisesPage.page = 1;

      component.onClickExercisePage('5');

      expect(component.exercisesPage.page).toBe(5);
      expect(component.listExercises).toHaveBeenCalled();
    });
  });

  describe('getPaginationExercisePages', () => {
    it('should call UtilPagination.getPages with correct parameters', () => {
      spyOn(UtilPagination, 'getPages').and.returnValue([1, 2, 3]);

      const result = component.getPaginationExercisePages(2, 5);

      expect(UtilPagination.getPages).toHaveBeenCalledWith(2, 5);
      expect(result).toEqual([1, 2, 3]);
    });
  });

  describe('navigate', () => {
    it('should navigate to the specified route', () => {
      component.navigate('/exercises/create');

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/exercises/create']);
    });
  });

  describe('viewExercise', () => {
    beforeEach(() => {
      mockExerciseService.getExerciseById.and.returnValue(of(mockExercise));
    });

    it('should open modal and load exercise details', () => {
      component.viewExercise(mockExercise);

      expect(component.isModalOpen).toBe(true);
      expect(mockExerciseService.getExerciseById).toHaveBeenCalledWith(1);
      expect(component.selectedExercise).toBe(mockExercise);
      expect(component.isLoadingExerciseDetails).toBe(false);
    });

    it('should set selectedExercise and stop loading on success', () => {
      component.viewExercise(mockExercise);

      expect(component.selectedExercise).toEqual(mockExercise);
      expect(component.isLoadingExerciseDetails).toBe(false);
    });

    it('should handle error when loading exercise details', () => {
      mockExerciseService.getExerciseById.and.returnValue(throwError(() => new Error('API Error')));
      spyOn(component, 'closeModal');

      component.viewExercise(mockExercise);

      expect(component.isLoadingExerciseDetails).toBe(false);
      expect(component.closeModal).toHaveBeenCalled();
      expect(mockToastr.error).toHaveBeenCalledWith('Translated text', 'Translated text');
      expect(mockTranslate.instant).toHaveBeenCalledWith('EXERCISE_LIST.ERROR_LOADING_EXERCISE');
      expect(mockTranslate.instant).toHaveBeenCalledWith('EXERCISE_LIST.ERROR_TITLE_EXERCISES');
    });
  });

  describe('closeModal', () => {
    it('should reset modal state', () => {
      component.isModalOpen = true;
      component.selectedExercise = mockExercise;
      component.isLoadingExerciseDetails = true;

      component.closeModal();

      expect(component.isModalOpen).toBe(false);
      expect(component.selectedExercise).toBe(null);
      expect(component.isLoadingExerciseDetails).toBe(false);
    });
  });

  describe('onModalBackdropClick', () => {
    it('should close modal when clicking on backdrop', () => {
      spyOn(component, 'closeModal');
      const mockEvent = {
        target: document.createElement('div'),
        currentTarget: document.createElement('div')
      } as any;
      mockEvent.target = mockEvent.currentTarget;

      component.onModalBackdropClick(mockEvent);

      expect(component.closeModal).toHaveBeenCalled();
    });

    it('should not close modal when clicking on modal content', () => {
      spyOn(component, 'closeModal');
      const mockEvent = {
        target: document.createElement('div'),
        currentTarget: document.createElement('div')
      } as any;

      component.onModalBackdropClick(mockEvent);

      expect(component.closeModal).not.toHaveBeenCalled();
    });
  });

  describe('editExercise', () => {
    it('should navigate to exercise edit page', () => {
      component.editExercise(mockExercise);

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/exercises/edit', '1']);
    });
  });

  describe('deleteExercise', () => {
    it('should set exerciseToDelete and open delete modal', () => {
      component.deleteExercise(mockExercise);

      expect(component.exerciseToDelete).toBe(mockExercise);
      expect(component.isDeleteModalOpen).toBe(true);
    });
  });

  describe('confirmDeleteExercise', () => {
    beforeEach(() => {
      component.exerciseToDelete = mockExercise;
      mockExerciseService.deleteExerciseById.and.returnValue(of({ message: 'Deleted successfully' }));
    });

    it('should return early if no exercise to delete', () => {
      component.exerciseToDelete = null;

      component.confirmDeleteExercise();

      expect(mockExerciseService.deleteExerciseById).not.toHaveBeenCalled();
    });

    it('should delete exercise successfully', () => {
      spyOn(component, 'closeDeleteModal');
      spyOn(component, 'listExercises');

      component.confirmDeleteExercise();

      expect(component.isDeletingExercise).toBe(true);
      expect(mockExerciseService.deleteExerciseById).toHaveBeenCalledWith(1);
      expect(mockToastr.success).toHaveBeenCalledWith('Translated text', 'Translated text');
      expect(mockTranslate.instant).toHaveBeenCalledWith('EXERCISE_LIST.DELETE_SUCCESS_MESSAGE');
      expect(mockTranslate.instant).toHaveBeenCalledWith('EXERCISE_LIST.DELETE_SUCCESS_TITLE');
      expect(component.closeDeleteModal).toHaveBeenCalled();
      expect(component.listExercises).toHaveBeenCalled();
    });

    it('should handle error when deleting exercise', () => {
      mockExerciseService.deleteExerciseById.and.returnValue(throwError(() => new Error('API Error')));

      component.confirmDeleteExercise();

      expect(component.isDeletingExercise).toBe(false);
      expect(mockToastr.error).toHaveBeenCalledWith('Translated text', 'Translated text');
      expect(mockTranslate.instant).toHaveBeenCalledWith('EXERCISE_LIST.DELETE_ERROR_MESSAGE');
      expect(mockTranslate.instant).toHaveBeenCalledWith('EXERCISE_LIST.DELETE_ERROR_TITLE');
    });
  });

  describe('closeDeleteModal', () => {
    it('should reset delete modal state', () => {
      component.isDeleteModalOpen = true;
      component.exerciseToDelete = mockExercise;
      component.isDeletingExercise = true;

      component.closeDeleteModal();

      expect(component.isDeleteModalOpen).toBe(false);
      expect(component.exerciseToDelete).toBe(null);
      expect(component.isDeletingExercise).toBe(false);
    });
  });

  describe('onDeleteModalBackdropClick', () => {
    it('should close delete modal when clicking on backdrop', () => {
      spyOn(component, 'closeDeleteModal');
      const mockEvent = {
        target: document.createElement('div'),
        currentTarget: document.createElement('div')
      } as any;
      mockEvent.target = mockEvent.currentTarget;

      component.onDeleteModalBackdropClick(mockEvent);

      expect(component.closeDeleteModal).toHaveBeenCalled();
    });

    it('should not close delete modal when clicking on modal content', () => {
      spyOn(component, 'closeDeleteModal');
      const mockEvent = {
        target: document.createElement('div'),
        currentTarget: document.createElement('div')
      } as any;

      component.onDeleteModalBackdropClick(mockEvent);

      expect(component.closeDeleteModal).not.toHaveBeenCalled();
    });
  });

  describe('Component initialization', () => {
    it('should initialize with correct default values', () => {
      expect(component.exercisesPage).toEqual({
        exercises: [],
        page: 1,
        per_page: 10,
        total: 0,
        total_pages: 0,
      });
      expect(component.selectedExercise).toBe(null);
      expect(component.isModalOpen).toBe(false);
      expect(component.isLoadingExerciseDetails).toBe(false);
      expect(component.exerciseToDelete).toBe(null);
      expect(component.isDeleteModalOpen).toBe(false);
      expect(component.isDeletingExercise).toBe(false);
    });
  });

  describe('Template interactions', () => {
    beforeEach(() => {
      component.exercisesPage = mockExercisePageDto;
    });

    it('should render exercise list without template errors', () => {
      expect(component.exercisesPage.exercises.length).toBe(mockExercisePageDto.exercises.length);
      expect(component.exercisesPage.exercises[0].name).toBe('Push-ups');
      expect(component.exercisesPage.exercises[1].name).toBe('Squats');
    });

    it('should call viewExercise when method is invoked', () => {
      spyOn(component, 'viewExercise').and.callThrough();
      mockExerciseService.getExerciseById.and.returnValue(of(mockExercise));
      const exercise = mockExercisePageDto.exercises[0];

      component.viewExercise(exercise);

      expect(component.viewExercise).toHaveBeenCalledWith(exercise);
      expect(mockExerciseService.getExerciseById).toHaveBeenCalledWith(Number(exercise.id));
    });

    it('should call editExercise when method is invoked', () => {
      spyOn(component, 'editExercise').and.callThrough();
      const exercise = mockExercisePageDto.exercises[0];

      component.editExercise(exercise);

      expect(component.editExercise).toHaveBeenCalledWith(exercise);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/exercises/edit', exercise.id]);
    });

    it('should call deleteExercise when method is invoked', () => {
      spyOn(component, 'deleteExercise').and.callThrough();
      const exercise = mockExercisePageDto.exercises[0];

      component.deleteExercise(exercise);

      expect(component.deleteExercise).toHaveBeenCalledWith(exercise);
      expect(component.exerciseToDelete).toBe(exercise);
      expect(component.isDeleteModalOpen).toBe(true);
    });
  });
});
