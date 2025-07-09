import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { BaseService } from './base.service';
import { ExerciseDto, ExercisePageDto } from '../dtos/exercise.dto';

@Injectable({
  providedIn: 'root',
})
export class ExerciseService extends BaseService {
  private apiExerciseUrl = environment.apiExercisesUrl;

  constructor(private http: HttpClient) {
    super();
  }

  getExercisesPaginated(page: number = 1, perPage: number = 10): Observable<ExercisePageDto> {
    const paginatedExercises = `${this.apiExerciseUrl}/?page=${page}&per_page=${perPage}`;
    return this.http.get<ExercisePageDto>(paginatedExercises,
      {
        headers: this.defaultHeaders
      });
  }

  createExercise(exercise: any): Observable<ExerciseDto> {
    return this.http.post<any>(
      `${this.apiExerciseUrl}/`,
      exercise,
      { headers: this.defaultHeaders }
    );
  }

  updateExercise(exerciseId: number, exercise: any): Observable<ExerciseDto> {
    return this.http.put<any>(
      `${this.apiExerciseUrl}/${exerciseId}`,
      exercise,
      { headers: this.defaultHeaders }
    );
  }

  getExerciseById(exerciseId: number): Observable<ExerciseDto> {
    return this.http.get<ExerciseDto>(
      `${this.apiExerciseUrl}/${exerciseId}`,
      { headers: this.defaultHeaders }
    );
  }

  deleteExerciseById(exerciseId: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.apiExerciseUrl}/${exerciseId}`,
      { headers: this.defaultHeaders }
    );
  }
}