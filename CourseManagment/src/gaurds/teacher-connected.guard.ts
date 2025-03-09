import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../Authentication/services/authentication.service';

export const teacherConnectedGuard: CanActivateFn = (route, state) => {

   const AuthService = inject(AuthenticationService)
    const router = inject(Router);
  
    if (!AuthService.isTeacher) {
      router.navigate(['/login'])
      return false;
    }
    return true;  
};
