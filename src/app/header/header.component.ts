import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "../auth/auth.service";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']

})
export class HeaderComponent implements OnInit, OnDestroy {
    private authServiceSub: Subscription
    isUserAuthenticated = false
    constructor(private authService: AuthService) { }
    ngOnInit() {
        this.isUserAuthenticated = this.authService.getAuthStatus()
        this.authServiceSub = this.authService.getAuthStatusListner().subscribe(isAuthenticated => {
            this.isUserAuthenticated = isAuthenticated
        }

        )
    }
    onLogout() {
        this.authService.onLogout()
    }
    ngOnDestroy() {
        this.authServiceSub.unsubscribe()
    }
}
