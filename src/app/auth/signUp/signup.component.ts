import { Component, OnDestroy, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";
import { AuthService } from "../auth.service";

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit, OnDestroy {
  isLoading = false
  authListnerSub: Subscription
  constructor(private authservice: AuthService) { }
  onSignup(form: NgForm) {
    if (form.value.invalid) { return }
    this.isLoading = true
    this.authservice.createUser(form.value.email, form.value.password)
  }
  ngOnInit() {
    this.authListnerSub = this.authservice.getAuthStatusListner().subscribe(authStatus => {
      this.isLoading = false
    }
    )
  }
  ngOnDestroy() {
    this.authListnerSub.unsubscribe();
  }
}
