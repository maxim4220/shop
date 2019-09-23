import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../_services';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-single-product',
  templateUrl: './single-product.component.html',
  styleUrls: ['./single-product.component.css']
})
export class SingleProductComponent implements OnInit {
  public showSpinner: boolean = true;
  currentUser: any;
  private productId;
  public products;
  public reviews;
  public singleProduct;
  currentRate = 0;

  constructor(private productsService: ProductsService,  private activatedRoute: ActivatedRoute, config: NgbRatingConfig) { 
    config.max = 5;
    config.readonly = false;
  }

  ngOnInit() {
    this.productId = this.activatedRoute.snapshot.paramMap.get('id');
    console.log('this.productId ', this.productId);
        // Get catalog products.
        this.productsService.getProducts().subscribe((response) => {
          if(response) {
            this.products = response;
            if(this.productId) {
              this.showReview(this.productId);
            }
            // Send requests for product reviews.
            this.showSpinner = false;
          }
         });
  }

    // Send request for products reviews 
    private showReview(product_id) {
      this.productsService.getReviews(product_id).subscribe((response) => {
     if(response) {
        this.reviews = response;
       this.calculateAverageRate(this.reviews, product_id);
     
     }
    });
     }

       // Calcurale average rate for each product based on all existing revies.
  private calculateAverageRate(reviews, product_id) {
    let total = 0;
    let counter = 0;
    reviews.forEach(element => {
      total += element.rate;
      if(element.rate > 0) {
        counter ++;
      }
    });
  
   let res = this.products.find(x => x.id == product_id);
    if(res) {
      // Add average rate to products and round it to the larger integer (p.s. like many web markets do)
      res = Object.assign(res, {averageRate: Math.ceil(total / counter)}, {totalComents: reviews.length});
      this.singleProduct = res;
      console.log('res', res);
      
    }
    
  }

}
