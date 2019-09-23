import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class ProductsService {

  constructor(private http: HttpClient) {
  }


  /**
   * Get the list of products..
   */
  public getProducts() {
    const API = 'http://smktesting.herokuapp.com/api/products/';
    return this.http.get(API);
  }

  public getReviews(productId) {
    const api = 'http://smktesting.herokuapp.com/api/reviews/' + productId;
    return this.http.get(api);
  }

}
