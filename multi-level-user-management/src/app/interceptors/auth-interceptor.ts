import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Always include credentials (cookies) in requests to the API
  const clonedRequest = req.clone({
    withCredentials: true,
    url: req.url.startsWith('/api') ? `http://localhost:3000${req.url}` : req.url
  });
  return next(clonedRequest);
};
