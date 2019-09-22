import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../_services/products.service';
import { AuthenticationService } from '../../_services/authentication.service';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit {
  // list of products.
  public products:any = [];
  public showDetails = false;
  public singleProduct;
  // reviews of selected product.
  public reviews;
  public showSpinner: boolean = true;
  currentUser: any;

  constructor(private productsService: ProductsService,  private authenticationService: AuthenticationService,config: NgbRatingConfig) { 
    config.max = 5;
    config.readonly = true;
    this.authenticationService.isLogedIn.subscribe(x => this.currentUser = x);
  }

  ngOnInit() {
   
  //  console.log('currentUser catalog', this.currentUser);
    // Get catalog products.
    this.productsService.getProducts().subscribe((response) => {
      if(response) {
        this.products = response;
        console.log('this.products', this.products);
        // Send requests for product reviews.
        this.products.forEach(element => {
         this.showReviews(element.id);
        });
        this.showSpinner = false;
      }
     });
  }

  public showProductDetails(product) {
   // this.showDetails = true;
    //this.singleProduct = product;
   //  this.showReviews(product.id);
  }
  
  // Send request for products reviews 
  private showReviews(product_id) {
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
    console.log('res', res);
    if(res) {
      // Add average rate to products and round it to the larger integer (p.s. like many web markets do)
      res = Object.assign(res, {averageRate: Math.ceil(total / counter)}, {totalComents: reviews.length});
      console.log('res222', res);
      console.log('prodsss', this.products);
      
    }
    
  }

}

