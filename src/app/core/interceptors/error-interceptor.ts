import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, tap, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toaster = inject(ToastrService);

  return next(req).pipe(
    tap((event) => {
      if (!(event instanceof HttpResponse)) {
        return;
      }

      const body = event.body;
      if (
        body &&
        typeof body === 'object' &&
        'success' in body &&
        body.success === true &&
        'message' in body &&
        typeof body.message === 'string'
      ) {
        toaster.success(body.message, 'SUCCESS');
      }
    }),
    catchError((err) => {
      toaster.error(err.error.message, 'ERROR', {
        progressBar: true,
      });

      return throwError(() => err);
    }),
  );
};
