import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs'
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

const backend_URL = environment.apiurl+'/posts/'

@Injectable({ providedIn: 'root' })
export class PostService {
  constructor(private http: HttpClient, private router: Router) { }
  posts: Post[] = []
  private postUpdated = new Subject<{ posts: Post[], postCount: number }>();
  getPost(postsPerPage: number, currentPage: number) {
    const queryParams = `?pageSize=${postsPerPage}&currpage=${currentPage}`
    this.http.get<{ message: string, post: any, maxCount: number }>(backend_URL + queryParams).pipe(map((postData: any) => {
      return {
        posts: postData.post.map((post: any) => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            imagePath: post.imagePath,
            creator: post.creator

          }
        }),
        maxPosts: postData.maxCount

      }
    }))

      .subscribe((transformPost) => {
        console.log(transformPost)
        this.posts = transformPost.posts
        this.postUpdated.next({
          posts: [...this.posts],
          postCount: transformPost.maxPosts

        });
      })

  }
  getUpdatedPostListner() {
    return this.postUpdated.asObservable()
  }

  addPost(title: string, content: string, image: File) {
    //const post:Post = {id:'null',title: title,content: content}
    const postData = new FormData();
    postData.append('title', title)
    postData.append('content', content)
    postData.append('image', image, title)

    this.http.post<{ message: string, post: Post }>(backend_URL, postData).subscribe((postData) => {
      // const post: Post = { id: postData.post.id, title: title, content: content, imagePath: postData.post.imagePath }
      // console.log(postData.message)
      // this.posts.push(post);
      // this.postUpdated.next([...this.posts]);
      this.router.navigate(['/'])
    })

  }
  getSinglePost(id: string) {
    return this.http.get<{ _id: string, title: string, content: string, imagePath: string,creator:string }>(backend_URL + id)
  }
  updatedPost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData
    if (typeof (image) === 'object') {
      postData = new FormData();
      postData.append('id', id)
      postData.append('title', title)
      postData.append('content', content)
      postData.append('image', image, title)
    }
    else {
      postData = { id: id, title: title, content: content, imagePath: image, creator: '' }
    }
    this.http.put(backend_URL + id, postData).subscribe((response) => {
      //   const post: Post = { id: id, title: title, content: content, imagePath: '' }

      // const updatedPost = [...this.posts]
      // const oldPostIndex = updatedPost.findIndex((p) => { p.id === post.id })
      // updatedPost[oldPostIndex] = post
      // this.posts = updatedPost
      // this.postUpdated.next([...this.posts])
      this.router.navigate(['/'])

    })
  }
  deletePost(postId: string) {
    console.log('Deleted!!' + postId)
    return this.http.delete(backend_URL + postId)
    // .subscribe(() => {
    //   console.log('Deleted!!')
    //   const updatedPost = this.posts.filter((posts) => posts.id != postId)
    //   this.posts = updatedPost
    //   this.postUpdated.next([...this.posts]);
    // })
  }
}
