import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthenticationService } from '../_services';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log('Interceptor called!!');
        
        // add authorization header with jwt token if available
        let currentUserToken = this.authenticationService.currentUserValue;
        console.log('currentUserToken!!', currentUserToken);
        if (currentUserToken ) {
            request = request.clone({
                setHeaders: { 
                    Authorization: `Token ${currentUserToken}`
                }
            });
        }

        return next.handle(request);
    }
}