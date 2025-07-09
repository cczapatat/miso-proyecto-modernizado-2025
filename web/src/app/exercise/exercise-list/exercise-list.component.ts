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
  public selectedExercise: ExerciseDto | null = null;
  public isModalOpen = false;
  public isLoadingExerciseDetails = false;
  public exerciseToDelete: ExerciseDto | null = null;
  public isDeleteModalOpen = false;
  public isDeletingExercise = false;

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
    this.isLoadingExerciseDetails = true;
    this.isModalOpen = true;

    this.exerciseService.getExerciseById(Number(exercise.id)).subscribe({
      next: (exerciseDetails) => {
        this.selectedExercise = exerciseDetails;
        this.isLoadingExerciseDetails = false;
      },
      error: (error) => {
        this.isLoadingExerciseDetails = false;
        this.closeModal();
        this.toastr.error(
          this.translate.instant('EXERCISE_LIST.ERROR_LOADING_EXERCISE'),
          this.translate.instant('EXERCISE_LIST.ERROR_TITLE_EXERCISES')
        );
      }
    });
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedExercise = null;
    this.isLoadingExerciseDetails = false;
  }

  onModalBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }

  editExercise(exercise: ExerciseDto): void {
    this.router.navigate(['/exercises/edit', exercise.id]);
  }

  deleteExercise(exercise: ExerciseDto): void {
    this.exerciseToDelete = exercise;
    this.isDeleteModalOpen = true;
  }

  confirmDeleteExercise(): void {
    if (!this.exerciseToDelete) return;

    this.isDeletingExercise = true;
    this.exerciseService.deleteExerciseById(Number(this.exerciseToDelete.id)).subscribe({
      next: (response) => {
        this.toastr.success(
          this.translate.instant('EXERCISE_LIST.DELETE_SUCCESS_MESSAGE'),
          this.translate.instant('EXERCISE_LIST.DELETE_SUCCESS_TITLE')
        );
        this.closeDeleteModal();
        this.listExercises();
      },
      error: (error) => {
        this.isDeletingExercise = false;
        this.toastr.error(
          this.translate.instant('EXERCISE_LIST.DELETE_ERROR_MESSAGE'),
          this.translate.instant('EXERCISE_LIST.DELETE_ERROR_TITLE')
        );
      }
    });
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen = false;
    this.exerciseToDelete = null;
    this.isDeletingExercise = false;
  }

  onDeleteModalBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeDeleteModal();
    }
  }
}
