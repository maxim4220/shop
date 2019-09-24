import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

const API_DOMAIN = 'http://smktesting.herokuapp.com/api/';

@Injectable()
export class ProductsService {

  constructor(private http: HttpClient) {
  }
  
  /**
   * Get the list of products..
   */
  public getProducts() {
    const API = API_DOMAIN + 'products/';
    return this.http.get(API);
  }

  /**
   * Get reviews of products
   * @param productId: Id of the product
   */
  public getReviews(productId) {
    const API = API_DOMAIN +'reviews/' + productId;
    return this.http.get(API);
  }

   /**
   * Add review for the single product
   * @param productId: Id of the product
   * @param rate: product rate
   * @param text: review
   */
  public addReview(productId, rate, text) {
    const API = API_DOMAIN + 'reviews/'+ productId;
    return this.http.post(API, { rate, text});
  }

}
