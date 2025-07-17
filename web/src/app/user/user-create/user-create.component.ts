// Path: web/src/app/user/user-create/user-create.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../../services/user.service';
import { UserDto } from '../../dtos/user.dto';
import { UserBaseComponent } from '../user-base/user-base.component';
import { positiveNumberValidator } from '../../validators/positive-number.validator';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css']
})
export class UserCreateComponent extends UserBaseComponent implements OnInit, OnDestroy {
  userForm!: FormGroup;
  isSubmitting: boolean = false;
  private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {
    super(); // Call the constructor of the base class
  }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(255)]],
      last_name: ['', [Validators.required, Validators.maxLength(255)]],
      age: [null, [Validators.required, positiveNumberValidator, Validators.pattern(/^\d+$/)]], // Age should be integer
      height: [null, [Validators.required, positiveNumberValidator]],
      weight: [null, [Validators.required, positiveNumberValidator]],
      arm: [null, [Validators.required, positiveNumberValidator]],
      chest: [null, [Validators.required, positiveNumberValidator]],
      waist: [null, [Validators.required, positiveNumberValidator]],
      leg: [null, [Validators.required, positiveNumberValidator]],
      // withdrawal_date and withdrawal_reason are not required for creation
      withdrawal_date: [''],
      withdrawal_reason: ['']
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.isSubmitting = true;
      const newUser: UserDto = this.userForm.value;

      const sub = this.userService.createUser(newUser).subscribe({
        next: () => {
          this.translate.get('USER_CREATE.USER_CREATED_SUCCESS').subscribe((res: string) => {
            this.toastr.success(res, this.translate.instant('COMMON.SUCCESS'));
          });
          this.router.navigate(['/users']);
        },
        error: (error) => {
          console.error('Error creating user:', error);
          this.translate.get('USER_CREATE.ERROR_CREATING_USER').subscribe((res: string) => {
            this.toastr.error(res, this.translate.instant('COMMON.ERROR'));
          });
          this.isSubmitting = false;
        }
      });
      this.subscriptions.push(sub);
    } else {
      this.userForm.markAllAsTouched(); // Mark all fields as touched to display validation messages
      this.translate.get('COMMON.FORM_INVALID_MESSAGE').subscribe((res: string) => {
        this.toastr.error(res, this.translate.instant('COMMON.ERROR'));
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/users']);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}