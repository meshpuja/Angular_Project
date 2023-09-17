import { Component, OnDestroy, OnInit } from "@angular/core";
import { Post } from '../post.model';
import { PostService } from "../post.service";
import { Subscription } from "rxjs";
import { PageEvent } from "@angular/material/paginator";
import { AuthService } from "src/app/auth/auth.service";
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']

})
export class PostListComponent implements OnInit, OnDestroy {
  constructor(public postService: PostService, private authService: AuthService) { }
  authListnerSub: Subscription
  isUserAuthenticated = false
  isLoading = false
  userId: string
  posts: Post[] = [];
  private postSub!: Subscription;
  totalPost = 0
  postPerPage = 2
  pageSizeOptions = [1, 2, 5, 10]
  currPage = 1
  ngOnInit() {
    this.isLoading = true
    this.postService.getPost(this.postPerPage, this.currPage)
    this.userId = this.authService.getUserId()
    this.postSub = this.postService.getUpdatedPostListner().subscribe((postData: { posts: Post[], postCount: number }) => {
      console.log(postData.postCount)
      this.isLoading = false
      this.posts = postData.posts;
      this.totalPost = postData.postCount
    })
    this.isUserAuthenticated = this.authService.getAuthStatus()
    this.authListnerSub = this.authService.getAuthStatusListner().subscribe(isAuthenticate => {
      this.userId = this.authService.getUserId()
      this.isUserAuthenticated = isAuthenticate
    })
  }
  onDelete(postId: string) {
    this.isLoading = true
    console.log("Click")
    this.postService.deletePost(postId).subscribe(() => {
      this.postService.getPost(this.postPerPage, this.currPage)
    },()=>{
      this.isLoading = false
    })

  }
  ngOnDestroy() {
    this.postSub.unsubscribe();
  }
  onChangePage(pageData: PageEvent) {
    console.log(pageData)
    this.isLoading = true
    this.currPage = pageData.pageIndex + 1
    this.postPerPage = pageData.pageSize
    this.postService.getPost(this.postPerPage, this.currPage)
  }
  // [{title: 'first post', content: 'This is first post'}, {title: 'second post', content: 'This is second post'},{title: 'third post', content: 'This is third post'}]
}
