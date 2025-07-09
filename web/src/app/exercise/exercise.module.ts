import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { ExerciseRoutingModule } from './exercise-routing-module';
import { ExerciseListComponent } from './exercise-list/exercise-list.component';
import { ExerciseCreateComponent } from './exercise-create/exercise-create.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    TranslateModule,
    ExerciseRoutingModule,
    FormsModule
  ],
  declarations: [
    ExerciseListComponent,
    ExerciseCreateComponent,
  ],
  exports: [
    ExerciseListComponent,
    ExerciseCreateComponent,
  ]
})
export class StoreModule { }
