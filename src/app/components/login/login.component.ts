import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AuthenticationService} from '../../_services';


@Component({templateUrl: 'login.component.html'})

export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  error: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    console.log('Login component const');
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      console.log('this.authenticationService.currentUserValue', this.authenticationService.currentUserValue);
      /// this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    console.log('Login component ngOnInit!');
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authenticationService.login(this.f.username.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        data => {
          if (data['success']) {
            console.log('data success', data);
            this.authenticationService.shareUserToken(data['token']);
            this.authenticationService.isLogedIn.next(true);
            return this.router.navigate(['/products']);
          } else {
            console.log('data error', data);
            console.error(data['message']);
          }
          this.loading = false;
        },
        error => {
          this.error = error;
          this.loading = false;
        });
  }

  ngOnDestroy() {
  }
}
