import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const cookieService = inject(CookieService);
  const authToken = cookieService.get('Authorization');
  // Clone the request to add the authentication header.
  // const newReq = req.clone({
  //   headers: req.headers.set('Authorization', authToken),
  // })
  // return next(newReq);
  if(req.urlWithParams.indexOf('addAuth=true',0) > -1){
    if (authToken) {
      const newReq = req.clone({
        setHeaders: {
          Authorization: authToken
        }
      });
      return next(newReq);
    }
  }
  return next(req);
};
