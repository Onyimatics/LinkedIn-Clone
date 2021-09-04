import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Post} from '../models/post';
import {environment} from '../../../environments/environment';
import {take} from 'rxjs/operators';

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
    private http: HttpClient
  ) {
  }

  getSelectedPost(params) {
    const baseUrl = `${environment.baseApiUrl}`;
    return this.http.get<Post[]>(`${baseUrl}/feed` + params);
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
