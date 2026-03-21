
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AuthService } from '../../../services/auth';

@Component({
    selector: 'app-login',
    imports: [ReactiveFormsModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    captchaSvg: SafeHtml | null = null;
    captchaSessionId: string = '';
    errorMessage: string = '';

    constructor(   
    private fb: FormBuilder,
    private authService: AuthService,
    private sanitizer: DomSanitizer){
       this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      captchaText: ['', Validators.required]
    });
    }
   ngOnInit(): void {
     this.loadCaptcha();
  }

  loadCaptcha(): void {
    this.authService.getCaptcha().subscribe({
      next: (res) => {
        this.captchaSessionId = res.sessionId;
        this.captchaSvg = this.sanitizer.bypassSecurityTrustHtml(res.captchaSvg);
      },
      error: () => this.errorMessage = 'Failed to load CAPTCHA.'
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const payload = {
        ...this.loginForm.value,
        captchaSessionId: this.captchaSessionId
      };
      
      this.authService.login(payload).subscribe({
        next: () => {},
        error: (err) => {
          this.errorMessage = err.error?.message || 'Login failed.';
          this.loadCaptcha();
          this.loginForm.get('captchaText')?.reset();
        }
      });
    }
  }
}
