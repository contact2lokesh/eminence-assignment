import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-home',
  imports: [CommonModule, DatePipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  balance: number = 0;
  statement: any[] = [];
  user: any;
  loading: boolean = true;
  error: string = '';
  constructor(private http: HttpClient, private authService: AuthService, private cdr: ChangeDetectorRef){}

  ngOnInit() {
    this.loadData();
  }

    loadData() {
    this.loading = true;
    this.error = '';
    this.http.get<any>('/api/users/me').subscribe({
      next: (user) => {
        this.balance = user.balance;
        this.http.get<any[]>('/api/balance/statement')
          .subscribe({
            next: (data) => {
              this.statement = data;
              this.loading = false;
              this.cdr.detectChanges();
            },
            error: () => {
              this.error = 'Failed to load statement.';
              this.loading = false;
              this.cdr.detectChanges();
            }
          });
      },
      error: () => {
        this.error = 'Failed to load user data.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
