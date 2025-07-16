// Path: web/src/app/user/user-list/user-list.component.ts
import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../../services/user.service';
import { UserDto, UserPageDto } from '../../dtos/user.dto';
import { UtilPagination } from '../../utils/util-pagination';
import { UserBaseComponent } from '../user-base/user-base.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent extends UserBaseComponent implements OnInit, OnDestroy {
  users: UserDto[] = [];
  page: number = 1;
  perPage: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;
  pages: (number | string)[] = [];
  selectedUser: UserDto | null = null;
  modalRef?: BsModalRef;
  private subscriptions: Subscription[] = [];

  // ViewChild for modals
  @ViewChild('viewUserModal') viewUserModal!: TemplateRef<any>;
  @ViewChild('deleteUserModal') deleteUserModal!: TemplateRef<any>;
  @ViewChild('withdrawUserModal') withdrawUserModal!: TemplateRef<any>;

  constructor(
    private userService: UserService,
    private router: Router,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private translate: TranslateService
  ) {
    super(); // Call the constructor of the base class
  }

  ngOnInit(): void {
    this.loadUsers(this.page, this.perPage);
  }

  loadUsers(page: number, perPage: number): void {
    const sub = this.userService.getUsersPaginated(page, perPage).subscribe({
      next: (data: UserPageDto) => {
        this.users = data.users;
        this.page = data.page;
        this.perPage = data.per_page;
        this.totalItems = data.total;
        this.totalPages = data.total_pages;
        this.pages = UtilPagination.getPages(this.page, this.totalPages);
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.translate.get('USER_LIST.ERROR_LOADING_USERS').subscribe((res: string) => {
          this.toastr.error(res, this.translate.instant('ERROR'));
        });
      }
    });
    this.subscriptions.push(sub);
  }

  // Modified onPageChange to handle string '...' internally
  onPageChange(page: number | string): void {
    if (typeof page === 'number' && page > 0 && page <= this.totalPages) {
      this.loadUsers(page, this.perPage);
    }
  }


  navigateToCreate(): void {
    this.router.navigate(['/users/create']);
  }

  navigateToEdit(id: number): void {
    this.router.navigate(['/users/edit', id]);
  }

  openDetailModal(user: UserDto): void {
    this.selectedUser = user;
    this.modalRef = this.modalService.show(this.viewUserModal, { class: 'modal-lg' });
  }

  openDeleteModal(user: UserDto): void {
    this.selectedUser = user;
    this.modalRef = this.modalService.show(this.deleteUserModal);
  }

  confirmDelete(): void {
    if (this.selectedUser?.id) {
      const sub = this.userService.deleteUserById(this.selectedUser.id).subscribe({
        next: () => {
          this.translate.get('USER_LIST.USER_DELETED_SUCCESS').subscribe((res: string) => {
            this.toastr.success(res, this.translate.instant('SUCCESS'));
          });
          this.modalRef?.hide();
          this.loadUsers(this.page, this.perPage); // Reload users to update the list
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          this.translate.get('USER_LIST.ERROR_DELETING_USER').subscribe((res: string) => {
            this.toastr.error(res, this.translate.instant('ERROR'));
          });
          this.modalRef?.hide();
        }
      });
      this.subscriptions.push(sub);
    }
  }

  openWithdrawModal(user: UserDto): void {
    this.selectedUser = user;
    this.modalRef = this.modalService.show(this.withdrawUserModal);
  }

  confirmWithdraw(): void {
    if (this.selectedUser?.id) {
      // For simplicity, we'll use current date and a generic reason.
      // In a real app, this would come from a form in the modal.
      const withdrawalData = {
        withdrawal_date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
        withdrawal_reason: this.translate.instant('USER_LIST.DEFAULT_WITHDRAWAL_REASON')
      };

      const sub = this.userService.withdrawUser(this.selectedUser.id, withdrawalData).subscribe({
        next: () => {
          this.translate.get('USER_LIST.USER_WITHDRAWN_SUCCESS').subscribe((res: string) => {
            this.toastr.success(res, this.translate.instant('SUCCESS'));
          });
          this.modalRef?.hide();
          this.loadUsers(this.page, this.perPage); // Reload users to update the list
        },
        error: (error) => {
          console.error('Error withdrawing user:', error);
          this.translate.get('USER_LIST.ERROR_WITHDRAWING_USER').subscribe((res: string) => {
            this.toastr.error(res, this.translate.instant('ERROR'));
          });
          this.modalRef?.hide();
        }
      });
      this.subscriptions.push(sub);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}