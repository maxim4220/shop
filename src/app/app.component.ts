import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticationService} from './_services';

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
  ) { 
     this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  logout() {
    this.authenticationService.logout();
    return this.router.navigate(['/login']);
  }
}
