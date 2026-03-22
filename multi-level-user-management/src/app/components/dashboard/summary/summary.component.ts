import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-summary',
  imports: [CommonModule],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.css',
})
export class SummaryComponent implements OnInit {
  summaryData: any = null;
  loading: boolean = true;
  error: string = '';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef, public authServicel: AuthService){}

  ngOnInit(): void {
       this.http.get('/api/admin/summary').subscribe({
      next: (data: any) => {
        this.summaryData = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load summary';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
