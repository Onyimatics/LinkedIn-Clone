import {Component, OnInit, ViewChild} from '@angular/core';
import {PostService} from '../../services/post.service';
import {IonInfiniteScroll} from '@ionic/angular';
import {Post} from '../../models/post';

@Component({
  selector: 'app-all-posts',
  templateUrl: './all-posts.component.html',
  styleUrls: ['./all-posts.component.scss'],
})
export class AllPostsComponent implements OnInit {

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  queryParams: string;
  allLoadedPosts: Post[] = [];
  numberOfPosts = 5;
  skipPosts = 0;

  constructor(
    private postService: PostService
  ) {
  }

  ngOnInit() {
    this.getPosts(false, '');
  }

  getPosts(isInitialLoad: boolean, event) {
    if (this.skipPosts === 20) {
      event.target.disabled = true;
    }
    this.queryParams = `?take=${this.numberOfPosts}&skip=${this.skipPosts}`;
    this.postService.getSelectedPost(this.queryParams).subscribe((posts: Post[]) => {
        for (let post = 0; post < posts?.length; post++) {
          this.allLoadedPosts.push(posts[post]);
        }
        if (isInitialLoad) event.target.complete;
        this.skipPosts = this.skipPosts + 5;
      }, (error) => {
        console.log(error);
      }
    );
  }

  loadData(event: any) {
    this.getPosts(true, event)
  }
}
