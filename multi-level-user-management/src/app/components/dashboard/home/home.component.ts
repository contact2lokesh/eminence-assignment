import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../services/auth';
import { SocketService } from '../../../services/socketService';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [CommonModule, DatePipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit, OnDestroy {
  balance: number = 0;
  statement: any[] = [];
  user: any;
  loading: boolean = true;
  error: string = '';
  totalCommission: number = 0;
  private subscribe: Subscription = new Subscription();

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private socketService: SocketService,
  ) {}

  ngOnInit() {
    this.loadData();
    // conncet to websocket //
    this.socketService.connect();

    this.subscribe.add(
      this.socketService.onBalanceUpdate().subscribe((data) => {
        this.balance = data.balance;
        this.cdr.detectChanges();
      }),
    );

     this.subscribe.add(
      this.socketService.onNewTransaction().subscribe(() => {
        //refresh the statement without full load
        this.loadStatement();
      })
    );
  }

  loadData() {
    this.loading = true;
    this.error = '';
    this.http.get<any>('/api/users/me').subscribe({
      next: (user) => {
        this.balance = user.balance;
        this.socketService.joinRoom(user._id || user.id);
        this.loadStatement();
      },
      error: () => {
        this.error = 'Failed to load user data.';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

   loadStatement() {
    this.http.get<any[]>('/api/balance/statement').subscribe({
      next: (data) => {
        this.statement = data;
        this.totalCommission = this.statement
          .filter(tx => tx.type === 'COMMISSION EARNED')
          .reduce((sum, tx) => sum + tx.amount, 0);
          
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Failed to load statement.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  ngOnDestroy(): void {
    this.subscribe.unsubscribe();
    this.socketService.disconnect();
  }
}
