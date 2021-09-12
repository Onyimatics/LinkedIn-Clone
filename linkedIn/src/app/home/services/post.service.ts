import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Post} from '../models/post';
import {environment} from '../../../environments/environment';
import {catchError, take, tap} from 'rxjs/operators';
import {AuthService} from '../../auth/services/auth.service';
import {ErrorHandlerService} from '../../shared/error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=utf8',
    })
  };

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private errorHandlerService: ErrorHandlerService
  ) {
    this.authService.getUserImageName().pipe(
      take(1),
      tap(({ imageName }) => {
        const defaultImagePath = 'profile-pix.png';
        this.authService
          .updateUserImagePath(imageName || defaultImagePath)
          .subscribe();
      })
    ).subscribe();
  }

  getSelectedPost(params) {
    const baseUrl = `${environment.baseApiUrl}`;
    return this.http.get<Post[]>(`${baseUrl}/feed` + params).pipe(
      tap((posts: Post[]) => {
        if(posts.length === 0) {throw new Error('No posts to retrieve');}
      }),
      catchError(
        this.errorHandlerService.handleError<Post[]>('getSelectedPosts', [])
      )
    );
    // return this.http.get<Post[]>('https://jsonplaceholder.typicode.com/posts' + params)
  }

  createPost(body: string) {
    const baseUrl = `${environment.baseApiUrl}`;
    return this.http.post<Post>(`${baseUrl}/feed`,
      { body },
      this.httpOptions)
      .pipe(take(1));
  }

  updatePost(postId: number, body: string) {
    const baseUrl = `${environment.baseApiUrl}`;
    return this.http.put<Post>(`${baseUrl}/feed/${postId}`,
      { body },
      this.httpOptions)
      .pipe(take(1));
  }

  deletePost(postId: number) {
    const baseUrl = `${environment.baseApiUrl}`;
    return this.http.delete<Post>(`${baseUrl}/feed/${postId}`,
      this.httpOptions)
      .pipe(take(1));
  }
}
