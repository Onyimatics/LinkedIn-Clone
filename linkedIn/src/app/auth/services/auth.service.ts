import {Injectable} from '@angular/core';
import {NewUser} from '../models/newUser.model';
import {BehaviorSubject, from, Observable, of, pipe} from 'rxjs';
import {Role, User} from '../models/user.model';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {environment} from '../../../environments/environment';
import {map, switchMap, take, tap} from 'rxjs/operators';
import {UserResponse} from '../models/userResponse.model';
import jwt_decode from 'jwt-decode';
import { Storage } from '@capacitor/storage';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private user$ = new BehaviorSubject<User>(null);

  private httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=utf8',
    })
  };

  get isUserLoggedIn(): Observable<boolean> {
    return this.user$.asObservable().pipe(
      switchMap((user: User) => {
        const isUserAuthenticated = user !== null;
        return of(isUserAuthenticated);
      })
    );
  }

  get userRole(): Observable<Role> {
    return this.user$.asObservable().pipe(
      switchMap((user: User) => of(user.role))
    );
  }

  get userId(): Observable<number> {
    return this.user$.asObservable().pipe(
      switchMap((user: User) => of(user.id))
    );
  }

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
  }

  register(newUser: NewUser): Observable<User> {
    return this.http
      .post<User>(
        `${environment.baseApiUrl}/auth/register`,
        newUser,
        this.httpOptions
      )
      .pipe(take(1));
  }

  login(email: string, password: string): Observable<{ token: string }> {
    return this.http
      .post<{ token: string }>(
        `${environment.baseApiUrl}/auth/login`,
        {email, password},
        this.httpOptions
      )
      .pipe(take(1),
        tap((response: { token: string }) => {
          Storage.set({
            key: 'token',
            value: response.token
          });

          const decodedToken: UserResponse = jwt_decode(response.token);
          this.user$.next(decodedToken.user);
        }));
  };

  isTokenInStorage(): Observable<boolean> {
    return from(
      Storage.get({
        key: 'token',
      })
    ).pipe(
      map((data: { value: string }) => {
        if (!data || !data.value) {return null;}

        const decodedToken: UserResponse = jwt_decode(data.value);
        const jwtExpirationInMsSinceUnixEpoch = decodedToken.exp * 1000;
        const isExpired =
          new Date() > new Date(jwtExpirationInMsSinceUnixEpoch);

        if (isExpired) {return null;}
        if (decodedToken.user) {
          this.user$.next(decodedToken.user);
          return true;
        }
      })
    );
  }

  logout(): void {
    this.user$.next(null);
    Storage.remove({ key: 'token' }).then();
    this.router.navigateByUrl('/auth').then();
  }
}
