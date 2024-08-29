import { HttpInterceptorFn } from '@angular/common/http';

const apiKey = 'c95d8f6a9cbf4278ab502858cc777700'
export const authInterceptor: HttpInterceptorFn = (req, next) => {
 const auth = req.clone({
    setHeaders: {
      'Cache-Control': 'no-cache',
      Authorization: `Bearer ${apiKey}`,
    },
  })

  return next(auth);
};
