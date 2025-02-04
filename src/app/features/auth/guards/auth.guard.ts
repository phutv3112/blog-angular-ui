import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../services/auth.service';
import { jwtDecode } from 'jwt-decode';

export const authGuard: CanActivateFn = (route, state) => {
  const cookieService = inject(CookieService);
  const authService = inject(AuthService);
  const router = inject(Router);
  const user = authService.getUser();

  let token = cookieService.get('Authorization');
  if(token && user){
    token = token.replace('Bearer ', '');
    const decodedToken : any = jwtDecode(token);

    const expirationDate = decodedToken.exp * 1000;
    const currentDate = new Date().getTime();
    if(expirationDate < currentDate){
      authService.logout();
      return router.createUrlTree(['/login'], {queryParams : {returnUrl:state.url}})
    }else{
      if(user.roles.includes('Admin') || user.roles.includes('Writer')){
        return true;
      }else{
        alert('FORBIDDEN')
        authService.logout();
        return router.createUrlTree(['/login'], {queryParams : {returnUrl:state.url}})
      }
    }
  }else{
    authService.logout();
    return router.createUrlTree(['/login'], {queryParams : {returnUrl:state.url}})
  }
};
