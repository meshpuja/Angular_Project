import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import { Post } from '../post.model';
import { PostService } from "../post.service";
import { mimeType } from "./mime-type.validator";
@Component({
  selector: 'app-create-post',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit,OnDestroy {
  enteredTitle = ''
  enteredContent = ''
  postmode = 'create';
  postId: any;
  post: Post = {
    id: "",
    title: "",
    content: "",
    imagePath:'',
    creator:''
  };
  imagePreview:string
  isLoading = false
  form: FormGroup
  constructor(public postService: PostService, public route: ActivatedRoute,private authservice: AuthService) { }
  private authListnerSub: Subscription

  // @Output() postCreated = new EventEmitter<Post>()
  ngOnInit() {
    this.authListnerSub = this.authservice.getAuthStatusListner().subscribe(authStatus => {
      this.isLoading = false
    }
    )
    this.form = new FormGroup({
      title: new FormControl(null, { validators: [Validators.required, Validators.minLength(3)] }),
      content: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, { validators: [Validators.required], asyncValidators:[mimeType] })

    })
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.get('postId')) {
        this.postmode = 'edit'
        this.postId = paramMap.get('postId')
        this.isLoading = true
        this.postService.getSinglePost(this.postId).subscribe((postdata) => {
          this.isLoading = false
          this.post = { id: postdata._id, title: postdata.title, content: postdata.content, imagePath:postdata.imagePath,creator:postdata.creator }
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            image: this.post.imagePath
          })
        })
      }
      else {
        this.postmode = 'create'
        this.postId = null
      }
    })
  }
  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    this.form.patchValue({ image: file })
    this.form.get('image')?.updateValueAndValidity()
    const reader =  new FileReader()
    reader.onload = () => {
      this.imagePreview =  reader.result as string
    }
   if(file){ reader.readAsDataURL(file)}
    console.log(this.form)
    console.log(file)
  }
  addEvent() {
    if (this.form.valid) {
      this.isLoading = true
      if (this.postmode === 'create') { this.postService.addPost(this.form.value.title, this.form.value.content, this.form.value.image) }
      else {
        this.postService.updatedPost(this.postId, this.form.value.title, this.form.value.content, this.form.value.image)
      }
      this.form.reset()
    }
  }
  ngOnDestroy() {
    this.authListnerSub.unsubscribe();
  }

}
