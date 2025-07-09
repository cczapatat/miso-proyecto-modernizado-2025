import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExerciseListComponent } from './exercise-list/exercise-list.component';
import { ExerciseCreateComponent } from './exercise-create/exercise-create.component';
import { ExerciseEditComponent } from './exercise-edit/exercise-edit.component';

const routes: Routes = [{
  path: 'exercises',
  children: [
    {
      path: '',
      component: ExerciseListComponent,
    },
    {
      path: 'create',
      component: ExerciseCreateComponent,
    },
    {
      path: 'edit/:id',
      component: ExerciseEditComponent,
    },
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExerciseRoutingModule { }
