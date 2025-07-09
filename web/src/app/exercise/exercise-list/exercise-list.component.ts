import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

import { ExerciseService } from 'src/app/services/exercise.service';
import { ExercisePageDto, ExerciseDto } from 'src/app/dtos/exercise.dto';
import { UtilPagination } from 'src/app/utils/util-pagination';

@Component({
  selector: 'app-exercise-list',
  templateUrl: './exercise-list.component.html',
  styleUrls: ['./exercise-list.component.css']
})
export class ExerciseListComponent implements OnInit {
  public exercisesPage: ExercisePageDto = {
    exercises: [],
    page: 1,
    per_page: 10,
    total: 0,
    total_pages: 0,
  };

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private translate: TranslateService,
    private exerciseService: ExerciseService,
  ) { }

  ngOnInit(): void {
    this.listExercises();
  }

  listExercises(): void {
    this.exerciseService.getExercisesPaginated(this.exercisesPage.page, this.exercisesPage.per_page).subscribe({
      next: (response) => {
        this.exercisesPage = response;
      },
      error: (error) => {
        this.toastr.error(
          this.translate.instant('EXERCISE_LIST.ERROR_LIST_EXERCISES'),
          this.translate.instant('EXERCISE_LIST.ERROR_TITLE_EXERCISES'),
        );
      }
    });
  }

  changeExercisePage(page: number): void {
    this.exercisesPage.page += page;
    this.listExercises();
  }

  onClickExercisePage(page: number | string): void {
    const tempPage = Number(page);
    if (page !== this.exercisesPage.page) {
      this.exercisesPage.page = tempPage;
      this.listExercises();
    }
  }

  getPaginationExercisePages(current: number, total: number): (number | string)[] {
    return UtilPagination.getPages(current, total);
  }

  navigate(route: string) {
    this.router.navigate([route]);
  }

  viewExercise(exercise: ExerciseDto): void {
    // TODO: Implementar vista de detalles del ejercicio
    console.log('Ver ejercicio:', exercise);
    this.toastr.info(
      `${this.translate.instant('EXERCISE_LIST.VIEW')}: ${exercise.name}`,
      this.translate.instant('EXERCISE_LIST.ACTIONS')
    );
  }

  editExercise(exercise: ExerciseDto): void {
    // TODO: Navegar a la página de edición del ejercicio
    console.log('Editar ejercicio:', exercise);
    this.toastr.info(
      `${this.translate.instant('EXERCISE_LIST.EDIT')}: ${exercise.name}`,
      this.translate.instant('EXERCISE_LIST.ACTIONS')
    );
  }

  deleteExercise(exercise: ExerciseDto): void {
    // TODO: Implementar confirmación y eliminación del ejercicio
    console.log('Eliminar ejercicio:', exercise);
    if (confirm(`¿Está seguro de eliminar el ejercicio "${exercise.name}"?`)) {
      this.toastr.warning(
        `${this.translate.instant('EXERCISE_LIST.DELETE')}: ${exercise.name}`,
        this.translate.instant('EXERCISE_LIST.ACTIONS')
      );
      // Aquí iría la llamada al servicio para eliminar
      // this.exerciseService.deleteExercise(exercise.id).subscribe(...)
    }
  }
}
