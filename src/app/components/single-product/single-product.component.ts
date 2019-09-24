import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ProductsService, AuthenticationService} from '../../_services';
import {NgbRatingConfig} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import swal from 'sweetalert2';

@Component({
  selector: 'app-single-product',
  templateUrl: './single-product.component.html',
  styleUrls: ['./single-product.component.css']
})
export class SingleProductComponent implements OnInit {
  public showSpinner: boolean = true;
  // currentUser: any;
  private productId;
  public products;
  public reviews;
  public singleProduct;
  public currentRate = 0;
  public reviewForm: FormGroup;
  public submitted = false;
  public loading = false;

  constructor(private productsService: ProductsService, private activatedRoute: ActivatedRoute, config: NgbRatingConfig,
              private formBuilder: FormBuilder, public authenticationService: AuthenticationService) {
    config.max = 5;
    config.readonly = false;
  }

  ngOnInit() {
    this.initReviewForm();
    this.productId = this.activatedRoute.snapshot.paramMap.get('id');
    console.log('this.productId ', this.productId);
    // Get catalog products.
    this.productsService.getProducts().subscribe((response) => {
      if (response) {
        this.products = response;
        if (this.productId) {
          this.showReview(this.productId);
        }
        // Send requests for product reviews.
        this.showSpinner = false;
      }
    }, err => {
      // Server error - show alert!
      SingleProductComponent.showServerErrorAlert();
      this.loading = false;
    });
  }

  private initReviewForm() {
    this.reviewForm = this.formBuilder.group({
      review: ['', Validators.required]
    });
  }

  // Send request for products reviews
  private showReview(product_id) {
    this.productsService.getReviews(product_id).subscribe((response) => {
      if (response) {
        this.reviews = response;
        this.calculateAverageRate(this.reviews, product_id);

      }
    }, err => {
      // Server error - show alert!
      SingleProductComponent.showServerErrorAlert();
    });
  }

  // Calculate average rate for each product based on all existing reviews.
  private calculateAverageRate(reviews, product_id) {
    console.log('calculate called!');
    let total = 0;
    let counter = 0;
    reviews.forEach(element => {
      total += element.rate;
      if (element.rate > 0) {
        counter++;
      }
    });
    let res = this.products.find(x => x.id == product_id);
    if (res) {
      // Add average rate to products and round it to the larger integer (p.s. like many web markets do)
      res = Object.assign(res, {averageRate: Math.ceil(total / counter)}, {totalComments: reviews.length});
      this.singleProduct = res;
    }
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.reviewForm.controls;
  }

  public onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.reviewForm.invalid) {
      return;
    }
    this.loading = true;
    this.productsService.addReview(this.productId, this.currentRate, this.f.review.value ).subscribe((response) => {
        if (response && response['success']) {
          const nickname = localStorage.getItem('userNickname');
          console.log('nickname;', nickname);
          // Add comment without reloading the page.
          this.reviews.push({rate: this.currentRate, text: this.f.review.value, created_by: {username: nickname}, created_at: new Date()});
          this.reviewForm.get('review').reset();
          swal.fire({
            position: 'center',
            type: 'success',
            title: 'Your review has been saved',
            showConfirmButton: false,
            timer: 1500
          });
        } else {
          swal.fire({
            type: 'info',
            title: 'Oops...',
            text: 'Something went wrong',
          });
        }
        this.loading = false;
      },
      err => {
        // Server error - show alert!
        SingleProductComponent.showServerErrorAlert();
        this.loading = false;
      });
  }

  // tslint:disable-next-line:member-ordering
  private static showServerErrorAlert() {
    swal.fire({
      type: 'error',
      title: 'Oops...',
      text: 'Server error has occurred!',
    });
  }

}
