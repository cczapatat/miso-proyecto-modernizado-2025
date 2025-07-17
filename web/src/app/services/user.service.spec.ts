// Path: web/src/app/services/user.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { UserService } from './user.service';
import { UserDto, UserPageDto } from '../dtos/user.dto';
import { environment } from 'src/environments/environment';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  let toastrService: ToastrService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ToastrModule.forRoot()],
      providers: [UserService, ToastrService]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
    toastrService = TestBed.inject(ToastrService);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure that no outstanding requests are uncaught.
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getUsersPaginated', () => {
    it('should return a paginated list of users', () => {
      const mockUsers: UserDto[] = [
        {
          id: 1, name: 'John', last_name: 'Doe', age: 30, height: 1.75, weight: 70,
          arm: 30, chest: 100, waist: 80, leg: 90, created_at: '', updated_at: '',
          withdrawal_date: '', withdrawal_reason: ''
        },
        {
          id: 2, name: 'Jane', last_name: 'Smith', age: 25, height: 1.65, weight: 60,
          arm: 28, chest: 90, waist: 70, leg: 85, created_at: '', updated_at: '',
          withdrawal_date: '', withdrawal_reason: ''
        }
      ];
      const mockUserPage: UserPageDto = {
        users: mockUsers,
        page: 1,
        per_page: 10,
        total: 2,
        total_pages: 1
      };

      service.getUsersPaginated(1, 10).subscribe(data => {
        expect(data).toEqual(mockUserPage);
      });

      const req = httpMock.expectOne(`${environment.apiUserUrl}?page=1&per_page=10`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUserPage);
    });

    it('should handle error when fetching paginated users', () => {
      const errorMessage = 'Error fetching users';
      spyOn(toastrService, 'error');

      service.getUsersPaginated(1, 10).subscribe({
        next: () => fail('should have failed with an error'),
        error: (error) => {
          expect(error.status).toBe(500);
          expect(toastrService.error).toHaveBeenCalledWith(errorMessage, 'Error');
        }
      });

      const req = httpMock.expectOne(`${environment.apiUserUrl}?page=1&per_page=10`);
      expect(req.request.method).toBe('GET');
      req.error(new ProgressEvent('error'), { status: 500, statusText: 'Server Error' });
    });
  });

  describe('getUserById', () => {
    it('should return a single user by ID', () => {
      const mockUser: UserDto = {
        id: 1, name: 'John', last_name: 'Doe', age: 30, height: 1.75, weight: 70,
        arm: 30, chest: 100, waist: 80, leg: 90, created_at: '', updated_at: '',
        withdrawal_date: '', withdrawal_reason: ''
      };

      service.getUserById(1).subscribe(data => {
        expect(data).toEqual(mockUser);
      });

      const req = httpMock.expectOne(`${environment.apiUserUrl}/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUser);
    });

    it('should handle error when fetching user by ID', () => {
      const errorMessage = 'Error fetching user details';
      spyOn(toastrService, 'error');

      service.getUserById(1).subscribe({
        next: () => fail('should have failed with an error'),
        error: (error) => {
          expect(error.status).toBe(404);
          expect(toastrService.error).toHaveBeenCalledWith(errorMessage, 'Error');
        }
      });

      const req = httpMock.expectOne(`${environment.apiUserUrl}/1`);
      expect(req.request.method).toBe('GET');
      req.error(new ProgressEvent('error'), { status: 404, statusText: 'Not Found' });
    });
  });

  describe('createUser', () => {
    it('should create a new user', () => {
      const newUser: UserDto = {
        name: 'New', last_name: 'User', age: 28, height: 1.70, weight: 65,
        arm: 32, chest: 95, waist: 75, leg: 92
      };
      const createdUser: UserDto = { ...newUser, id: 3, created_at: '', updated_at: '', withdrawal_date: '', withdrawal_reason: '' };

      service.createUser(newUser).subscribe(data => {
        expect(data).toEqual(createdUser);
      });

      const req = httpMock.expectOne(`${environment.apiUserUrl}`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newUser);
      req.flush(createdUser);
    });

    it('should handle error when creating user', () => {
      const errorMessage = 'Error creating user';
      spyOn(toastrService, 'error');
      const newUser: UserDto = {
        name: 'New', last_name: 'User', age: 28, height: 1.70, weight: 65,
        arm: 32, chest: 95, waist: 75, leg: 92
      };

      service.createUser(newUser).subscribe({
        next: () => fail('should have failed with an error'),
        error: (error) => {
          expect(error.status).toBe(400);
          expect(toastrService.error).toHaveBeenCalledWith(errorMessage, 'Error');
        }
      });

      const req = httpMock.expectOne(`${environment.apiUserUrl}`);
      expect(req.request.method).toBe('POST');
      req.error(new ProgressEvent('error'), { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('updateUser', () => {
    it('should update an existing user', () => {
      const updatedUser: UserDto = {
        id: 1, name: 'Updated John', last_name: 'Doe', age: 31, height: 1.76, weight: 71,
        arm: 31, chest: 101, waist: 81, leg: 91, created_at: '', updated_at: '',
        withdrawal_date: '', withdrawal_reason: ''
      };

      service.updateUser(1, updatedUser).subscribe(data => {
        expect(data).toEqual(updatedUser);
      });

      const req = httpMock.expectOne(`${environment.apiUserUrl}/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedUser);
      req.flush(updatedUser);
    });

    it('should handle error when updating user', () => {
      const errorMessage = 'Error updating user';
      spyOn(toastrService, 'error');
      const updatedUser: UserDto = {
        id: 1, name: 'Updated John', last_name: 'Doe', age: 31, height: 1.76, weight: 71,
        arm: 31, chest: 101, waist: 81, leg: 91, created_at: '', updated_at: '',
        withdrawal_date: '', withdrawal_reason: ''
      };

      service.updateUser(1, updatedUser).subscribe({
        next: () => fail('should have failed with an error'),
        error: (error) => {
          expect(error.status).toBe(404);
          expect(toastrService.error).toHaveBeenCalledWith(errorMessage, 'Error');
        }
      });

      const req = httpMock.expectOne(`${environment.apiUserUrl}/1`);
      expect(req.request.method).toBe('PUT');
      req.error(new ProgressEvent('error'), { status: 404, statusText: 'Not Found' });
    });
  });

  describe('deleteUserById', () => {
    it('should delete a user by ID', () => {
      service.deleteUserById(1).subscribe(res => {
        expect(res).toEqual({ message: 'user deleted' });
      });

      const req = httpMock.expectOne(`${environment.apiUserUrl}/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush({ message: 'user deleted' });
    });

    it('should handle error when deleting user', () => {
      const errorMessage = 'Error deleting user';
      spyOn(toastrService, 'error');

      service.deleteUserById(1).subscribe({
        next: () => fail('should have failed with an error'),
        error: (error) => {
          expect(error.status).toBe(404);
          expect(toastrService.error).toHaveBeenCalledWith(errorMessage, 'Error');
        }
      });

      const req = httpMock.expectOne(`${environment.apiUserUrl}/1`);
      expect(req.request.method).toBe('DELETE');
      req.error(new ProgressEvent('error'), { status: 404, statusText: 'Not Found' });
    });
  });

  describe('withdrawUser', () => {
    it('should withdraw a user', () => {
      const withdrawalData = { withdrawal_date: '2025-07-14', withdrawal_reason: 'Moved city' };
      const withdrawnUser: UserDto = {
        id: 1, name: 'John', last_name: 'Doe', age: 30, height: 1.75, weight: 70,
        arm: 30, chest: 100, waist: 80, leg: 90, created_at: '', updated_at: '',
        withdrawal_date: '2025-07-14', withdrawal_reason: 'Moved city'
      };

      service.withdrawUser(1, withdrawalData).subscribe(data => {
        expect(data).toEqual(withdrawnUser);
      });

      const req = httpMock.expectOne(`${environment.apiUserUrl}/1/withdraw`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(withdrawalData);
      req.flush(withdrawnUser);
    });

    it('should handle error when withdrawing user', () => {
      const errorMessage = 'Error withdrawing user';
      spyOn(toastrService, 'error');
      const withdrawalData = { withdrawal_date: '2025-07-14', withdrawal_reason: 'Moved city' };

      service.withdrawUser(1, withdrawalData).subscribe({
        next: () => fail('should have failed with an error'),
        error: (error) => {
          expect(error.status).toBe(400);
          expect(toastrService.error).toHaveBeenCalledWith(errorMessage, 'Error');
        }
      });

      const req = httpMock.expectOne(`${environment.apiUserUrl}/1/withdraw`);
      expect(req.request.method).toBe('PUT');
      req.error(new ProgressEvent('error'), { status: 400, statusText: 'Bad Request' });
    });
  });
});