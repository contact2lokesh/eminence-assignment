import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-downline',
  imports: [CommonModule, ReactiveFormsModule, ConfirmModalComponent],
  templateUrl: './downline.component.html',
  styleUrl: './downline.component.css',
})
export class DownlineComponent implements OnInit {
  downlineUsers: any[] = [];
  userForm: FormGroup;
  passwordForm: FormGroup;
  loading: boolean = false;
  user: any;
  message: { type: string, text: string } | null = null;
  selectedUserIdToViewDownline: string | null = null;
  adminViewUsers: any[] = [];
  constructor(private http: HttpClient, private fb: FormBuilder, private authService: AuthService, private cdr: ChangeDetectorRef){
     this.userForm = this.fb.group({
      name: ['', Validators.required],
      username: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/^(?=.*[a-zA-Z])(?=.*\d).+$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.passwordForm = this.fb.group({
      userId: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
      this.user = this.authService.currentUser();
      this.loadDownline();
  }

  loadDownline(): void {
    this.loading = true;
    this.http.get<any[]>('/api/users/downline?all=true')
      .subscribe({
        next: (users) => {
          this.downlineUsers = users;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
  }

  viewAdminDownline(targetId: string, username :string): void {
    this.http.get<any[]>(`/api/admin/users/${targetId}/downline`).subscribe({
      next: (users) => {
        this.adminViewUsers = users;
        this.selectedUserIdToViewDownline = ` ${username} (${targetId})`;
      }
    });
  }

  showConfirmModal = false;
  confirmTitle = '';
  confirmMessage = '';
  confirmButtonClass = 'btn-primary';
  confirmAction: () => void = () => {};

  promptConfirm(title: string, message: string, btnClass: string, action: () => void) {
    this.confirmTitle = title;
    this.confirmMessage = message;
    this.confirmButtonClass = btnClass;
    this.confirmAction = action;
    this.showConfirmModal = true;
  }

  onModalConfirm() {
    this.showConfirmModal = false;
    this.confirmAction();
  }

  showMessage(type: string, text: string): void {
    this.message = { type, text };
    setTimeout(() => this.message = null, 5000);
  }

  onCreateUser(): void {
    console.log(this.userForm.valid);
    if (this.userForm.valid) {
      this.promptConfirm(
        'Create New User',
        `Are you sure you want to create the user "${this.userForm.value.username}"?`,
        'btn-primary',
        () => {
          this.http.post('/api/users', this.userForm.value).subscribe({
            next: (res: any) => {
              this.showMessage('success', res.message);
              this.userForm.reset();
              this.loadDownline();
            },
            error: (err) => this.showMessage('danger', err.error?.message || 'Error creating user.')
          });
        }
      );
    }
  }

  onChangePassword(): void {
    if (this.passwordForm.valid) {
      this.promptConfirm(
        'Change Password',
        'Are you sure you want to permanently change this user\'s password?',
        'btn-danger',
        () => {
          const { userId, newPassword } = this.passwordForm.value;
          this.http.put(`/api/users/${userId}/password`, { newPassword }).subscribe({
            next: (res: any) => {
              this.showMessage('success', res.message);
              this.passwordForm.reset();
            },
            error: (err) => this.showMessage('danger', err.error?.message || 'Error changing password.')
          });
        }
      );
    }
  }

}
