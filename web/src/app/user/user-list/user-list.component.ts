// Path: web/src/app/user/user-list/user-list.component.ts
import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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
  private subscriptions: Subscription[] = [];

  // Modal state properties to match the template
  isModalOpen = false;
  isLoadingUserDetails = false;
  userToDelete: UserDto | null = null;
  isDeleteModalOpen = false;
  isDeletingUser = false;
  isWithdrawModalOpen = false;
  isWithdrawingUser = false;

  // ViewChild for modals (keeping for backward compatibility but not used with div modals)
  @ViewChild('viewUserModal') viewUserModal!: TemplateRef<any>;
  @ViewChild('deleteUserModal') deleteUserModal!: TemplateRef<any>;
  @ViewChild('withdrawUserModal') withdrawUserModal!: TemplateRef<any>;

  constructor(
    private userService: UserService,
    private router: Router,
    private toastr: ToastrService,
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

  navigate(route: string): void {
    this.router.navigate([route]);
  }

  changeUserPage(pageChange: number): void {
    this.page += pageChange;
    this.loadUsers(this.page, this.perPage);
  }

  onClickUserPage(page: number | string): void {
    const tempPage = Number(page);
    if (page !== this.page) {
      this.page = tempPage;
      this.loadUsers(this.page, this.perPage);
    }
  }

  getPaginationUserPages(current: number, total: number): (number | string)[] {
    return UtilPagination.getPages(current, total);
  }

  navigateToCreate(): void {
    this.router.navigate(['/users/create']);
  }

  navigateToEdit(id: number): void {
    this.router.navigate(['/users/edit', id]);
  }

  openDetailModal(user: UserDto): void {
    this.isLoadingUserDetails = true;
    this.isModalOpen = true;

    // Load user details (currently we already have the data, but simulate loading for consistency)
    // In a real scenario, you might need to fetch additional details
    setTimeout(() => {
      this.selectedUser = user;
      this.isLoadingUserDetails = false;
    }, 100);
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedUser = null;
    this.isLoadingUserDetails = false;
  }

  onModalBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }

  openDeleteModal(user: UserDto): void {
    this.userToDelete = user;
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen = false;
    this.userToDelete = null;
    this.isDeletingUser = false;
  }

  onDeleteModalBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeDeleteModal();
    }
  }

  confirmDelete(): void {
    if (this.userToDelete?.id) {
      this.isDeletingUser = true;
      const sub = this.userService.deleteUserById(this.userToDelete.id).subscribe({
        next: () => {
          this.translate.get('USER_LIST.USER_DELETED_SUCCESS').subscribe((res: string) => {
            this.toastr.success(res, this.translate.instant('SUCCESS'));
          });
          this.closeDeleteModal();
          this.loadUsers(this.page, this.perPage); // Reload users to update the list
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          this.isDeletingUser = false;
          this.translate.get('USER_LIST.ERROR_DELETING_USER').subscribe((res: string) => {
            this.toastr.error(res, this.translate.instant('ERROR'));
          });
        }
      });
      this.subscriptions.push(sub);
    }
  }

  openWithdrawModal(user: UserDto): void {
    this.selectedUser = user;
    this.isWithdrawModalOpen = true;
  }

  closeWithdrawModal(): void {
    this.isWithdrawModalOpen = false;
    this.selectedUser = null;
    this.isWithdrawingUser = false;
  }

  onWithdrawModalBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeWithdrawModal();
    }
  }

  confirmWithdraw(): void {
    if (this.selectedUser?.id) {
      this.isWithdrawingUser = true;
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
          this.closeWithdrawModal();
          this.loadUsers(this.page, this.perPage); // Reload users to update the list
        },
        error: (error) => {
          console.error('Error withdrawing user:', error);
          this.isWithdrawingUser = false;
          this.translate.get('USER_LIST.ERROR_WITHDRAWING_USER').subscribe((res: string) => {
            this.toastr.error(res, this.translate.instant('ERROR'));
          });
        }
      });
      this.subscriptions.push(sub);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}