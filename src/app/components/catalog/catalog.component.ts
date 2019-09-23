import {Component, OnInit} from '@angular/core';
import {ProductsService} from '../../_services';
import {AuthenticationService} from '../../_services';
import {NgbRatingConfig} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})

export class CatalogComponent implements OnInit {
  // list of products.
  public products: any = [];
  public singleProduct;
  // reviews of selected product.
  public reviews;
  public showSpinner: boolean = true;
  currentUser: any;

  constructor(private productsService: ProductsService, private authenticationService: AuthenticationService, config: NgbRatingConfig,
              private router: Router) {
    if (config) {
      config.max = 5;
      config.readonly = true;
    }

    this.authenticationService.isLogedIn.subscribe(x => this.currentUser = x);
  }

  ngOnInit() {
    // Get catalog products.
    this.productsService.getProducts().subscribe((response) => {
      if (response) {
        this.products = response;
        // Send requests for product reviews.
        this.products.forEach(element => {
          this.showReviews(element.id);
        });
        this.showSpinner = false;
      }
    });
  }

  // Send request for products reviews
  private showReviews(product_id) {
    this.productsService.getReviews(product_id).subscribe((response) => {
      if (response) {
        this.reviews = response;
        this.calculateAverageRate(this.reviews, product_id);
      }
    });
  }

  // Calculate average rate for each product based on all existing reviews.
  private calculateAverageRate(reviews, product_id) {
    let total = 0;
    let counter = 0;
    reviews.forEach(element => {
      total += element.rate;
      if (element.rate > 0) {
        counter++;
      }
    });

    const res = this.products.find(x => x.id === product_id);
    if (res) {
      // Add average rate to products and round it to the larger integer (p.s. like many web markets do)
      Object.assign(res, {averageRate: Math.ceil(total / counter)}, {totalComments: reviews.length});
    }

  }

  navToProduct(product_id) {
    return this.router.navigate(['/product/' + product_id]);
  }

}

