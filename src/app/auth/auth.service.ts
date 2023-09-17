import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Authdata } from "./auth-data.model";
import { Subject } from "rxjs";
import { Router } from "@angular/router";

import { environment } from '../../environments/environment';

const backend_URL = environment.apiurl+'/user/'

@Injectable({ providedIn: 'root' })
export class AuthService {
    constructor(private http: HttpClient, private router: Router) { }
    isAuthenicated = false
    private token: string;
    tokenTimer: any;
    userId:string;
    private authStatusLister = new Subject<boolean>()
    getToken() {
        return this.token;
    }
    getAuthStatus() {
        return this.isAuthenicated
    }
    getAuthStatusListner() {
        return this.authStatusLister.asObservable()
    }
    onLogout() {
        this.token = ''
        this.isAuthenicated = false
        this.authStatusLister.next(false)
        clearTimeout(this.tokenTimer)
        this.userId = ''
        this.clearAuthData()
        this.router.navigate(['/'])
    }
    createUser(email: string, password: string) {
        const authdata: Authdata = { email: email, password: password }
        this.http.post(backend_URL+'/signup', authdata).subscribe((result) => {
            this.router.navigate(['/'])
        },error =>{
            this.authStatusLister.next(false)
        })
    }
    login(email: string, password: string) {
        const authdata: Authdata = { email: email, password: password }
        this.http.post<{ token: string, expiresIn: number, userId:string }>(backend_URL+'/login', authdata).subscribe((result) => {
            const token = result.token
            this.token = token
            if (token) {
                const expiresInduration = result.expiresIn
                this.setAuthTimer(expiresInduration)
                this.isAuthenicated = true
                this.authStatusLister.next(true)
                this.userId =  result.userId
                const now = new Date()
                const expirationDate = new Date(now.getTime() + expiresInduration * 1000)
                this.saveAuthData(token, expirationDate, this.userId )
                this.router.navigate(['/'])
            }
        },error =>{
            this.authStatusLister.next(false)
        })

    }
    private saveAuthData(token: string, expiration: Date, userId:string) {
        localStorage.setItem('token', token)
        localStorage.setItem('expiration', expiration.toISOString())
        localStorage.setItem('userId', userId)
    }
    private clearAuthData() {
        localStorage.removeItem('token')
        localStorage.removeItem('expiration')
        localStorage.removeItem('userId')
    }
    private geAuthData() {
        const token = localStorage.getItem('token')
        const expiration = localStorage.getItem('expiration')
        const userId = localStorage.getItem('userId')
        if (!token || !expiration || !userId) {
            return
        }
        return {
            token: token,
            expiration: new Date(expiration),
            userId:userId
        }
    }
    autoAuthUser() {
        console.log('autoAuthUser')
        const authInformation = this.geAuthData()
        if (!authInformation) { return }
        const now = new Date()
        const inFuture = authInformation?.expiration.getTime() - now.getTime()
        console.log(inFuture)
        if (inFuture > 0) {
            this.token = authInformation?.token
            this.isAuthenicated = true
            this.userId = authInformation?.userId
            this.setAuthTimer(inFuture / 1000)
            this.authStatusLister.next(true)
        }
    }
    private setAuthTimer(duration: number) {
        console.log("Setting timer: " + duration);
        this.tokenTimer = setTimeout(() => {
            this.onLogout()
        }, duration * 1000)
    }
    getUserId(){
        return this.userId
    }
}