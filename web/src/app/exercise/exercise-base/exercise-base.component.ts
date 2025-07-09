import { AbstractControl, ValidationErrors } from '@angular/forms';

export class ExerciseBaseComponent {
  youtubeUrlValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }

    const value = control.value.toString().trim();
    const youtubePattern = /^https:\/\/(www\.)?youtube\.com\/watch\?v=[a-zA-Z0-9_-]+$/;

    const isValidYouTubeUrl = youtubePattern.test(value);

    return isValidYouTubeUrl ? null : { youtubeUrl: true };
  }
}