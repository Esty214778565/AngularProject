import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { AuthenticationService } from '../Authentication/services/authentication.service';

export const connectedGuard: CanActivateFn = (route, state) => {
  const connected = inject(AuthenticationService)
  const router = inject(Router);

  if (!connected.isConnected) {
    router.navigate(['/login'])
    return false;
  }
  return true;
};
