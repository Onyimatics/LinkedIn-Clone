import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Post} from '../models/post';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(
    private http: HttpClient
  ) { }

  getSelectedPost(params) {
    // return this.http.get<Post[]>('http://localhost:3000/api/feed' + params)
    return this.http.get<Post[]>('https://jsonplaceholder.typicode.com/posts' + params)
  }
}
