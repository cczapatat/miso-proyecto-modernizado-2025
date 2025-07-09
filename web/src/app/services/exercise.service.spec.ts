import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ExerciseService } from './exercise.service';
import { environment } from '../../environments/environment';
import { ExerciseDto } from '../dtos/exercise.dto';

describe('StoreService', () => {
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

  it('should register store', () => {
    const mockStore = new ExerciseDto(
      'Test Store',
      '12345678901',
      'test@store.com',
      'Test Address',
      100,
      'ACTIVE',
      'HIGH'
    );

    const mockResponse = {
      id: 'uuid',
      name: 'Test Store',
      phone: '12345678901',
      email: 'test@store.com',
      address: 'Test Address',
      capacity: 100,
      state: 'ACTIVE',
      security_level: 'HIGH'
    };

    service.createExercise(mockStore).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/create`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockStore);
    req.flush(mockResponse);
  });
});
