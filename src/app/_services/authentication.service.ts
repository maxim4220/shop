import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, Subject} from 'rxjs';

@Injectable({providedIn: 'root'})
export class AuthenticationService {
  private readonly currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;



  // currentUserToken: BehaviorSubject<any>;
  currentUserToken: Subject<any>;

  constructor(private http: HttpClient) {
    this.currentUserToken = new Subject;

    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUserToken')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

   /**
    * remove user from local storage and set current user to null
    */
  logout() {
    localStorage.removeItem('currentUserToken');
    this.currentUserSubject.next(null);
  }


   /**
    * Send request to register user
    * @param username: username
    * @param password: password
    */
  register(username, password) {
    return this.http.post('http://smktesting.herokuapp.com/api/register/', {username, password});
  }

  /**
   * Store user details and jwt token in local storage to keep user logged in between page refreshes
   * Share token of signed in user
   * @param token: token that will be intercepted and added to http header
   */
  shareUserToken(token):void {
    localStorage.setItem('currentUserToken', JSON.stringify(token));
    this.currentUserSubject.next(token);
  }

   /**
   * Send request to sign in
   * @param username: username
   * @param password: password
   */
  login(username, password) {
    return this.http.post('http://smktesting.herokuapp.com/api/login/', {username, password});
  }


}
