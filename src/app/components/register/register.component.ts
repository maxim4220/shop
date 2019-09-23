import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {ConfirmPasswordValidator} from './confirm-password.validator';
import {AuthenticationService} from '../../_services';
import swal from 'sweetalert2'; 

@Component({templateUrl: 'register.component.html'})

export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      // this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, {
      validator: ConfirmPasswordValidator.MatchPassword
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.registerForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }
    this.loading = true;
    this.authenticationService.register(this.f.username.value, this.f.password.value)
      .pipe(first())
      .subscribe(data => {
          if (data['success']) {
            this.authenticationService.shareUserToken(data['token']);
            this.loading = false;
            return  this.router.navigate(['/login']);
          } else {
            swal.fire({
              type: 'error',
              title: 'Oops...',
              text: data['message'],
              })
            this.loading = false;
          }
        },
        error => {
          this.error = error;
          this.loading = false;
        });
  }

}
