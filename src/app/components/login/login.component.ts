import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AuthenticationService} from '../../_services';
import swal from 'sweetalert2'; 

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
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
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
            this.authenticationService.shareUserToken(data['token']);
            return this.router.navigate(['/products']);
          } else {
            swal.fire({
              type: 'error',
              title: 'Oops...',
              text: data['message'],
              })
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
