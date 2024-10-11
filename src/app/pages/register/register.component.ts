import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'] 
})
export class RegisterComponent {
  registerForm: FormGroup; 

  authService = inject(AuthService);
  router = inject(Router);
  toast = inject(HotToastService);

  constructor() {
    this.registerForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }

  handleSubmit() {
    if (this.registerForm.invalid) {
      this.toast.error("Điền đầy đủ thông tin");
      return;
    }

    console.log(this.registerForm.value);
    this.authService.registerUSer(this.registerForm.value).subscribe({
      next: () => {
        this.toast.success('Đăng ký tài khoản thành công');
        this.router.navigateByUrl('/login');
      },
      error: (e) => this.toast.error('Error: ' + e.message),
    });
  }
}
