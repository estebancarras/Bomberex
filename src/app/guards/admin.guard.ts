import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, map } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AdminGuard implements CanActivate {
    private authService = inject(AuthService);
    private router = inject(Router);

    canActivate(): Observable<boolean | UrlTree> {
        return this.authService.userRole$.pipe(
            map(role => {
                if (role === 'admin') {
                    return true;
                } else {
                    // Redirect to home or unauthorized page
                    return this.router.createUrlTree(['/home']);
                }
            })
        );
    }
}
