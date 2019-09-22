import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<any>;
    public currentUser: Observable<any>;

    public isLogedIn: Subject<boolean>;

   // currentUserToken: BehaviorSubject<any>;
    currentUserToken: Subject<any>;

    constructor(private http: HttpClient) {
        this.currentUserToken = new Subject;
        this.isLogedIn = new Subject;

        this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUserToken')));
        console.log('this.currentUserSubject', this.currentUserSubject);
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue() {
        return this.currentUserSubject.value;
    }

    // login(username, password) {
    //     return this.http.post<any>(`${config.apiUrl}/users/authenticate`, { username, password })
    //         .pipe(map(user => {
    //             // store user details and jwt token in local storage to keep user logged in between page refreshes
    //             localStorage.setItem('currentUser', JSON.stringify(user));
    //             this.currentUserSubject.next(user);
    //             return user;
    //         }));
    // }

    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('currentUserToken');
        this.isLogedIn.next(false);
        this.currentUserSubject.next(null);
    }

  
    // In use - works!!
    register(username, password) {
       console.log('username',username );
       console.log('password',password);
        return this.http.post('http://smktesting.herokuapp.com/api/register/', { username, password });
    }

    shareUserToken(token) {
           // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('currentUserToken', JSON.stringify(token));
        console.log('sharing user data with toke...', token);
        this.currentUserSubject.next(token);
        // return this.currentUserToken.next({data});
    }


     // In use - works!!
     login(username, password) {
        console.log('username',username );
        console.log('password',password);
        return this.http.post('http://smktesting.herokuapp.com/api/login/', { username, password });
     }
 

}