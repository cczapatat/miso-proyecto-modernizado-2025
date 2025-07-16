// Path: web/src/app/user/user.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; // Provides ngClass, number, date pipes
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms'; // Needed for forms in create/edit
import { TranslateModule } from '@ngx-translate/core'; // Provides translate pipe
import { UserListComponent } from './user-list/user-list.component';
import { UserCreateComponent } from './user-create/user-create.component';
import { UserEditComponent } from './user-edit/user-edit.component';
// import { UserBaseComponent } from './user-base/user-base.component'; // No longer needed here
import { UserRoutingModule } from './user-routing.module'; // Will be created next
import { ModalModule } from 'ngx-bootstrap/modal'; // For modals in list component

@NgModule({
  declarations: [
    UserListComponent,
    UserCreateComponent,
    UserEditComponent
    // UserBaseComponent removed from declarations
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    TranslateModule,
    UserRoutingModule, // Import the routing module
    ModalModule.forRoot() // Import for modals
  ],
  exports: [
    UserListComponent,
    UserCreateComponent,
    UserEditComponent
    // UserBaseComponent removed from exports
  ]
})
export class UserModule { }