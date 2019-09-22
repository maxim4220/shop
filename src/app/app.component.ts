import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './_services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  currentUser: any;
  title = 'catalog';
  
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
) { // TO DO: Add logic for logout
   // this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
   this.authenticationService.isLogedIn.subscribe(x => this.currentUser = x);
   console.log('currentUser APP', this.currentUser);
}

logout() {
  this.authenticationService.logout();
  this.router.navigate(['/login']);
}
}
