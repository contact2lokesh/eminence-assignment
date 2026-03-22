import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth';
import { CommonModule } from '@angular/common';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-transfer',
  imports: [CommonModule, ReactiveFormsModule, ConfirmModalComponent],
  templateUrl: './transfer.component.html',
  styleUrl: './transfer.component.css',
})
export class TransferComponent implements OnInit {
  transferForm: FormGroup;
  selfRechargeForm: FormGroup;
  globalTransferForm: FormGroup;
  
  downlineUsers: any[] = [];
  allUsersList: any[] = [];
  user: any;
  message: { type: string, text: string } | null = null;
  loading: boolean = false;
  
  constructor(private fb: FormBuilder, private http: HttpClient, private authService: AuthService){
    this.user = this.authService.currentUser();
    
    this.transferForm = this.fb.group({
      receiverId: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(1)]]
    });

    this.selfRechargeForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(1)]]
    });

    this.globalTransferForm = this.fb.group({
      receiverId: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.fetchDownline();
    if (this.user?.role === 'OWNER') {
      this.fetchAllUsersForGlobalTransfer();
    }
  }

  fetchDownline(): void {
    this.http.get<any[]>('/api/users/downline?all=false').subscribe({
      next: (users) => this.downlineUsers = users
    });
  }

  fetchAllUsersForGlobalTransfer(): void {
    this.http.get<any[]>('/api/users/downline?all=true').subscribe({
      next: (users) => this.allUsersList = users
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

  onTransfer(): void {
    if (this.transferForm.valid) {
      this.promptConfirm(
        'Confirm Transfer',
        'Are you sure you want to transfer this balance? This action cannot be undone.',
        'btn-primary',
        () => {
          this.http.post('/api/balance/transfer', this.transferForm.value).subscribe({
            next: (res: any) => {
              this.showMessage('success', res.message);
              this.transferForm.reset();
            },
            error: (err) => this.showMessage('danger', err.error?.message || 'Transfer failed.')
          });
        }
      );
    }
  }

   onSelfRecharge(): void {
    if (this.selfRechargeForm.valid) {
      this.promptConfirm(
        'Self Recharge',
        'Are you sure you want to recharge your account balance?',
        'btn-success',
        () => {
          this.http.post('/api/balance/recharge', this.selfRechargeForm.value).subscribe({
            next: (res: any) => {
              this.showMessage('success', res.message);
              this.selfRechargeForm.reset();
            },
            error: (err) => this.showMessage('danger', err.error?.message || 'Recharge failed.')
          });
        }
      );
    }
  }

  onGlobalTransfer(): void {
    if (this.globalTransferForm.valid) {
      this.promptConfirm(
        'Global Credit',
        'WARNING: Are you sure you want to execute a global credit? This will safely auto-deduct the balance from their immediate parent.',
        'btn-warning',
        () => {
          this.http.post('/api/admin/credit', this.globalTransferForm.value).subscribe({
            next: (res: any) => {
              this.showMessage('success', res.message);
              this.globalTransferForm.reset();
            },
            error: (err) => this.showMessage('danger', err.error?.message || 'Global transfer failed.')
          });
        }
      );
    }
  }
}
