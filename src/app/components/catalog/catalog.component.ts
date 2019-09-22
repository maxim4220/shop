import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../_services/products.service';
import { AuthenticationService } from '../../_services/authentication.service';

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

  constructor(private productsService: ProductsService,  private authenticationService: AuthenticationService) { 
    this.authenticationService.isLogedIn.subscribe(x => this.currentUser = x);
  }

  ngOnInit() {
    console.log('Catalog runs!!');
    console.log('currentUser catalog', this.currentUser);
    
    this.productsService.getProducts().subscribe((response) => {
      if(response) {
        this.products = response;
        console.log('this.products', this.products);
        this.showSpinner = false;
      }
     });
  }

  public showProductDetails(product) {
    this.showDetails = true;
    this.singleProduct = product;
    this.showReviews(product.id);
  }

  private showReviews(id) {
   this.productsService.getReviews(id).subscribe((response) => {
  if(response) {
   console.log('reviews', response);
   this.reviews = response;
  }
 });
  }

}

