import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../../services/user.service';
import { UserDto } from '../../dtos/user.dto';
import { UserBaseComponent } from '../user-base/user-base.component';
import { positiveNumberValidator } from '../../validators/positive-number.validator';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent extends UserBaseComponent implements OnInit, OnDestroy {
  userForm!: FormGroup;
  userId: number | null = null;
  isLoading: boolean = true;
  isSubmitting: boolean = false;
  private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {
    super(); // Call the constructor of the base class
  }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      id: [null], // ID field, hidden, but useful for form structure
      name: ['', [Validators.required, Validators.maxLength(255)]],
      last_name: ['', [Validators.required, Validators.maxLength(255)]],
      age: [null, [Validators.required, positiveNumberValidator, Validators.pattern(/^\d+$/)]], // Age should be integer
      height: [null, [Validators.required, positiveNumberValidator]],
      weight: [null, [Validators.required, positiveNumberValidator]],
      arm: [null, [Validators.required, positiveNumberValidator]],
      chest: [null, [Validators.required, positiveNumberValidator]],
      waist: [null, [Validators.required, positiveNumberValidator]],
      leg: [null, [Validators.required, positiveNumberValidator]],
      created_at: [''],
      updated_at: [''],
      withdrawal_date: [''],
      withdrawal_reason: ['']
    });

    const routeSub = this.route.paramMap.subscribe(params => {
      this.userId = Number(params.get('id'));
      if (this.userId) {
        this.loadUserData(this.userId);
      } else {
        this.translate.get('USER_EDIT.ERROR_INVALID_ID').subscribe((res: string) => {
          this.toastr.error(res, this.translate.instant('ERROR'));
        });
        this.router.navigate(['/users']);
      }
    });
    this.subscriptions.push(routeSub);
  }

  loadUserData(id: number): void {
    this.isLoading = true;
    const sub = this.userService.getUserById(id).subscribe({
      next: (user: UserDto) => {
        this.userForm.patchValue(user); // Populate the form with user data
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading user data:', error);
        this.translate.get('USER_EDIT.ERROR_LOADING_USER').subscribe((res: string) => {
          this.toastr.error(res, this.translate.instant('ERROR'));
        });
        this.router.navigate(['/users']);
        this.isLoading = false;
      }
    });
    this.subscriptions.push(sub);
  }

  onSubmit(): void {
    if (this.userForm.valid && this.userId) {
      this.isSubmitting = true;
      const updatedUser: UserDto = this.userForm.value;
      updatedUser.id = this.userId; // Ensure ID is set for the update call

      const sub = this.userService.updateUser(this.userId, updatedUser).subscribe({
        next: () => {
          this.translate.get('USER_EDIT.USER_UPDATED_SUCCESS').subscribe((res: string) => {
            this.toastr.success(res, this.translate.instant('SUCCESS'));
          });
          this.router.navigate(['/users']);
        },
        error: (error) => {
          console.error('Error updating user:', error);
          this.translate.get('USER_EDIT.ERROR_UPDATING_USER').subscribe((res: string) => {
            this.toastr.error(res, this.translate.instant('ERROR'));
          });
          this.isSubmitting = false;
        }
      });
      this.subscriptions.push(sub);
    } else {
      this.userForm.markAllAsTouched();
      this.translate.get('COMMON.FORM_INVALID_MESSAGE').subscribe((res: string) => {
        this.toastr.error(res, this.translate.instant('ERROR'));
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