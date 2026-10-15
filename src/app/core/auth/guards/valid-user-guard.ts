import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const validUserGuard: CanActivateFn = (route, state) => {
  let router = inject(Router);

  if (localStorage.getItem('socialToken')) {
    return true;
  } else {
    return router.parseUrl('/login');
  }
};
