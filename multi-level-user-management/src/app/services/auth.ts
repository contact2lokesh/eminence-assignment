import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser = signal<any>(null);
  isAuthenticated = signal<boolean>(false);

  constructor(private http: HttpClient, private router: Router) {
    this.checkAuthStatus().subscribe();
  }

  getCaptcha(): Observable<any> {
    return this.http.get('/api/auth/captcha', { withCredentials: true });
  }

  login(credentials: any): Observable<any> {
    return this.http.post('/api/auth/login', credentials, { withCredentials: true }).pipe(
      tap((res: any) => {
        this.currentUser.set({ username: res.username, role: res.role, level: res.level });
        this.isAuthenticated.set(true);
        this.router.navigate(['/dashboard/home']);
      })
    );
  }

  logout(): void {
    this.http.post('/api/auth/logout', {}, { withCredentials: true }).subscribe(() => {
      this.currentUser.set(null);
      this.isAuthenticated.set(false);
      this.router.navigate(['/login']);
    });
  }

  checkAuthStatus(): Observable<any> {
    return this.http.get('/api/users/me', { withCredentials: true }).pipe(
      tap((user: any) => {
        this.currentUser.set(user);
        this.isAuthenticated.set(true);
      }),
      catchError(() => {
        this.currentUser.set(null);
        this.isAuthenticated.set(false);
        return of(null);
      })
    );
  }
}
