import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ExerciseService } from './exercise.service';
import { ExerciseDto, ExercisePageDto } from '../dtos/exercise.dto';
import { environment } from '../../environments/environment';

describe('ExerciseService', () => {
  let service: ExerciseService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiExercisesUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ExerciseService]
    });
    service = TestBed.inject(ExerciseService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getExercisesPaginated', () => {
    it('should fetch paginated exercises with default parameters', () => {
      const mockResponse: ExercisePageDto = {
        exercises: [
          { id: '1', name: 'Push-ups', description: 'Upper body exercise', calories: '50', youtube: 'https://youtube.com/watch?v=test1' },
          { id: '2', name: 'Squats', description: 'Lower body exercise', calories: '60', youtube: 'https://youtube.com/watch?v=test2' }
        ],
        page: 1,
        per_page: 10,
        total: 2,
        total_pages: 1
      };

      service.getExercisesPaginated().subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(response.exercises.length).toBe(2);
        expect(response.page).toBe(1);
        expect(response.per_page).toBe(10);
      });

      const req = httpMock.expectOne(`${apiUrl}/?page=1&per_page=10`);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Content-Type')).toBe('application/json');
      req.flush(mockResponse);
    });

    it('should fetch paginated exercises with custom parameters', () => {
      const mockResponse: ExercisePageDto = {
        exercises: [],
        page: 2,
        per_page: 5,
        total: 10,
        total_pages: 2
      };

      service.getExercisesPaginated(2, 5).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(response.page).toBe(2);
        expect(response.per_page).toBe(5);
      });

      const req = httpMock.expectOne(`${apiUrl}/?page=2&per_page=5`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle HTTP error when fetching paginated exercises', () => {
      service.getExercisesPaginated().subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/?page=1&per_page=10`);
      req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('createExercise', () => {
    it('should create a new exercise', () => {
      const exerciseData = {
        name: 'New Exercise',
        description: 'Test description',
        calories: '100',
        youtube: 'https://youtube.com/watch?v=test'
      };

      const mockResponse: ExerciseDto = {
        id: '3',
        ...exerciseData
      };

      service.createExercise(exerciseData).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(response.id).toBe('3');
        expect(response.name).toBe(exerciseData.name);
      });

      const req = httpMock.expectOne(`${apiUrl}/`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(exerciseData);
      expect(req.request.headers.get('Content-Type')).toBe('application/json');
      req.flush(mockResponse);
    });

    it('should handle HTTP error when creating exercise', () => {
      const exerciseData = { name: 'Test', description: 'Test', calories: '50', youtube: 'https://youtube.com/test' };

      service.createExercise(exerciseData).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/`);
      req.flush('Bad Request', { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('updateExercise', () => {
    it('should update an existing exercise', () => {
      const exerciseId = 1;
      const exerciseData = {
        name: 'Updated Exercise',
        description: 'Updated description',
        calories: '120',
        youtube: 'https://youtube.com/watch?v=updated'
      };

      const mockResponse: ExerciseDto = {
        id: '1',
        ...exerciseData
      };

      service.updateExercise(exerciseId, exerciseData).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(response.name).toBe(exerciseData.name);
      });

      const req = httpMock.expectOne(`${apiUrl}/${exerciseId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(exerciseData);
      expect(req.request.headers.get('Content-Type')).toBe('application/json');
      req.flush(mockResponse);
    });

    it('should handle HTTP error when updating exercise', () => {
      const exerciseId = 1;
      const exerciseData = { name: 'Test', description: 'Test', calories: '50', youtube: 'https://youtube.com/test' };

      service.updateExercise(exerciseId, exerciseData).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/${exerciseId}`);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('getExerciseById', () => {
    it('should fetch exercise by id', () => {
      const exerciseId = 1;
      const mockResponse: ExerciseDto = {
        id: '1',
        name: 'Test Exercise',
        description: 'Test description',
        calories: '75',
        youtube: 'https://youtube.com/watch?v=test'
      };

      service.getExerciseById(exerciseId).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(response.id).toBe('1');
        expect(response.name).toBe('Test Exercise');
      });

      const req = httpMock.expectOne(`${apiUrl}/${exerciseId}`);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Content-Type')).toBe('application/json');
      req.flush(mockResponse);
    });

    it('should handle HTTP error when fetching exercise by id', () => {
      const exerciseId = 999;

      service.getExerciseById(exerciseId).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/${exerciseId}`);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('deleteExerciseById', () => {
    it('should delete exercise by id', () => {
      const exerciseId = 1;
      const mockResponse = { message: 'Exercise deleted successfully' };

      service.deleteExerciseById(exerciseId).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(response.message).toBe('Exercise deleted successfully');
      });

      const req = httpMock.expectOne(`${apiUrl}/${exerciseId}`);
      expect(req.request.method).toBe('DELETE');
      expect(req.request.headers.get('Content-Type')).toBe('application/json');
      req.flush(mockResponse);
    });

    it('should handle HTTP error when deleting exercise', () => {
      const exerciseId = 999;

      service.deleteExerciseById(exerciseId).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/${exerciseId}`);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });

    it('should handle server error when deleting exercise', () => {
      const exerciseId = 1;

      service.deleteExerciseById(exerciseId).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/${exerciseId}`);
      req.flush('Internal Server Error', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('service inheritance', () => {
    it('should extend BaseService', () => {
      expect(service).toBeInstanceOf(ExerciseService);
      expect(service['defaultHeaders']).toBeDefined();
    });
  });
});
