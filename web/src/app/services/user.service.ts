import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { BaseService } from './base.service';
import { UserDto, UserPageDto } from '../dtos/user.dto';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService {
  private apiUserUrl = environment.apiUserUrl;

  constructor(private http: HttpClient, private toastr: ToastrService) {
    super();
  }

  getUsersPaginated(page: number, perPage: number): Observable<UserPageDto> {
    let params = new HttpParams();
    params = params.append('page', page.toString());
    params = params.append('per_page', perPage.toString());

    return this.http.get<UserPageDto>(`${this.apiUserUrl}`, { params }).pipe(
      catchError(error => {
        this.toastr.error('Error fetching users', 'Error');
        return throwError(() => error);
      })
    );
  }

  getUserById(id: number): Observable<UserDto> {
    return this.http.get<UserDto>(`${this.apiUserUrl}/${id}`).pipe(
      catchError(error => {
        this.toastr.error('Error fetching user details', 'Error');
        return throwError(() => error);
      })
    );
  }

  createUser(user: UserDto): Observable<UserDto> {
    return this.http.post<UserDto>(`${this.apiUserUrl}`, user).pipe(
      catchError(error => {
        this.toastr.error('Error creating user', 'Error');
        return throwError(() => error);
      })
    );
  }

  updateUser(id: number, user: UserDto): Observable<UserDto> {
    return this.http.put<UserDto>(`${this.apiUserUrl}/${id}`, user).pipe(
      catchError(error => {
        this.toastr.error('Error updating user', 'Error');
        return throwError(() => error);
      })
    );
  }

  deleteUserById(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUserUrl}/${id}`).pipe(
      catchError(error => {
        this.toastr.error('Error deleting user', 'Error');
        return throwError(() => error);
      })
    );
  }

  withdrawUser(id: number, withdrawalData: { withdrawal_date: string, withdrawal_reason: string }): Observable<UserDto> {
    return this.http.put<UserDto>(`${this.apiUserUrl}/${id}/withdraw`, withdrawalData).pipe(
      catchError(error => {
        this.toastr.error('Error withdrawing user', 'Error');
        return throwError(() => error);
      })
    );
  }
}