import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  if (typeof window !== 'undefined' && window.localStorage) {
    const token = localStorage.getItem('token');

    if (!token) {
      router.navigateByUrl('/login');
      return false;  
    }
    
    return true;
  }
  return false;
};
