import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { ExerciseService } from 'src/app/services/exercise.service';
import { ExerciseDto } from 'src/app/dtos/exercise.dto';
import { ExerciseBaseComponent } from '../exercise-base/exercise-base.component';

@Component({
  selector: 'app-exercise-edit',
  templateUrl: './exercise-edit.component.html',
  styleUrls: ['./exercise-edit.component.css']
})
export class ExerciseEditComponent extends ExerciseBaseComponent implements OnInit {
  public exerciseForm: FormGroup;
  public isSubmitting = false;
  public isLoading = true;
  public exerciseId: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private translate: TranslateService,
    private exerciseService: ExerciseService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.exerciseId = this.route.snapshot.params['id'];
    this.initializeForm();
    this.loadExercise();
  }

  get formControls() {
    return this.exerciseForm.controls;
  }

  initializeForm(): void {
    this.exerciseForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(255)]],
      description: ['', [Validators.required, Validators.maxLength(1000)]],
      calories: ['', [Validators.required, Validators.min(1), Validators.pattern(/^\d+$/)]],
      youtube: ['', [
        Validators.required,
        Validators.maxLength(500),
        this.youtubeUrlValidator
      ]],
    });
  }

  loadExercise(): void {
    this.exerciseService.getExerciseById(Number(this.exerciseId)).subscribe({
      next: (exercise) => {
        this.exerciseForm.patchValue({
          name: exercise.name,
          description: exercise.description,
          calories: exercise.calories,
          youtube: exercise.youtube
        });
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.toastr.error(
          this.translate.instant('EXERCISE_EDIT.ERROR_LOADING_MESSAGE'),
          this.translate.instant('EXERCISE_EDIT.ERROR_LOADING_TITLE')
        );
        this.router.navigate(['/exercises']);
      }
    });
  }

  onSubmit(): void {
    if (this.exerciseForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isSubmitting = true;
    const exerciseData = new ExerciseDto(
      this.exerciseForm.value.name,
      this.exerciseForm.value.description,
      this.exerciseForm.value.calories,
      this.exerciseForm.value.youtube,
      this.exerciseId
    );

    this.exerciseService.updateExercise(Number(this.exerciseId), exerciseData).subscribe({
      next: (response) => {
        this.toastr.success(
          this.translate.instant('EXERCISE_EDIT.SUCCESS_MESSAGE'),
          this.translate.instant('EXERCISE_EDIT.SUCCESS_TITLE')
        );
        this.router.navigate(['/exercises']);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.toastr.error(
          this.translate.instant('EXERCISE_EDIT.ERROR_MESSAGE'),
          this.translate.instant('EXERCISE_EDIT.ERROR_TITLE')
        );
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/exercises']);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.exerciseForm.controls).forEach(key => {
      const control = this.exerciseForm.get(key);
      control?.markAsTouched();
    });
  }
}
