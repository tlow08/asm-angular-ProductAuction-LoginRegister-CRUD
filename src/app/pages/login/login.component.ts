import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup ;

  authService = inject(AuthService);
  router = inject(Router);
  toast = inject(HotToastService);
  constructor() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }

  handleSubmit() {
    if (this.loginForm.invalid) {
      this.toast.error("Điền đầy đủ thông tin")
      return;
    }

    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
      this.authService.loginUser(this.loginForm.value).subscribe({
        next: (response) => {
          this.authService.storeToken(response.accessToken);
          this.toast.success("Đăng nhập tài khoản thành công!")
          this.router.navigateByUrl('/'); 
        },
        error: (e) => alert('Error: ' + e.message),
      });
    }
  }
}
