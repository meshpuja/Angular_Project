import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { throwError } from "rxjs";
import { catchError } from "rxjs";
import { MatDialog } from "@angular/material/dialog";
import { Injectable } from "@angular/core";
import { ErrorComponent } from "./error/error.component";
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private dialog: MatDialog) { }
    intercept(req: HttpRequest<any>, next: HttpHandler) {

        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                let errormessage = 'An unknoen error'
                if(error.error.message){
                    errormessage = error.error.message
                }
                this.dialog.open(ErrorComponent, {data:{message:errormessage}})
                return throwError(error)

            })
        )
    }
}