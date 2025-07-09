import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { ExerciseService } from 'src/app/services/exercise.service';
import { ExerciseDto } from 'src/app/dtos/exercise.dto';

@Component({
  selector: 'app-exercise-create',
  templateUrl: './exercise-create.component.html',
  styleUrls: ['./exercise-create.component.css']
})
export class ExerciseCreateComponent implements OnInit {
  public exerciseForm: FormGroup;

  constructor(
    private toastr: ToastrService,
    private fb: FormBuilder,
    private translate: TranslateService,
    private exerciseService: ExerciseService,
  ) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  get formControls() {
    return this.exerciseForm.controls;
  }

  initializeForm(): void {
    this.exerciseForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/\d{11,15}$/)]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      capacity: ['', [Validators.required, Validators.min(1)]],
      state: ['', Validators.required],
      securityLevel: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.exerciseForm.invalid) {
      return;
    }

    /* const exerciseData: ExerciseDto = new ExerciseDto(
      this.exerciseForm.value.name,
      this.exerciseForm.value.phone,
      this.exerciseForm.value.email,
      this.exerciseForm.value.address,
      this.exerciseForm.value.capacity,
      this.exerciseForm.value.state,
      this.exerciseForm.value.securityLevel,
    );

    this.exerciseService.createExercise(exerciseData).subscribe({
      next: (response) => {
        this.toastr.success(
          this.translate.instant('EXERCISE.CREATE_SUCCESS_MESSAGE'),
          this.translate.instant('EXERCISE.CREATE_SUCCESS_TITLE'),
          { closeButton: true },
        );
        this.exerciseForm.reset();
      },
      error: (error) => {
        this.toastr.success(
          this.translate.instant('EXERCISE.CREATE_ERROR_MESSAGE'),
          this.translate.instant('EXERCISE.CREATE_ERROR_TITLE'),
          { closeButton: true },
        );
      }
    }) */
  }
}
