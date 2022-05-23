import { Injectable } from "@angular/core";
import { HttpEvent, HttpInterceptor, HttpRequest, HttpResponse, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { delay, dematerialize, materialize, map } from "rxjs/operators";

@Injectable()
export class fakeBackendFactory implements HttpInterceptor {

    intercept(request: HttpRequest<any>): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;

        // admin: true
        let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ik1vc2ggSGFtZWRhbmkiLCJhZG1pbiI6dHJ1ZX0.iy8az1ZDe-_hS8GLDKsQKgPHvWpHl0zkQBqy1QIPOkA';
        // admin: false
        // let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ik1vc2ggSGFtZWRhbmkiLCJhZG1pbiI6ZmFsc2V9.DLTdOwxPMgCsXA9p2WDJvwimoQvL2Q6Yyn_sm6B4KRE';

        return of(null)
            .pipe(map(pickRoute))
            .pipe(materialize())
            .pipe(delay(1000))
            .pipe(dematerialize());
    
        function pickRoute() {
            switch(true) {
                case url.endsWith('/api/authenticate') && method === 'POST':
                    return authenticate();
                case url.endsWith('/api/orders') && method === 'GET':
                    return getOrders();
                default:
                    return new HttpResponse({
                        status: 404
                    });
            }
        }

        function authenticate() {
            let { email, password }  = JSON.parse(body);
            
            if(email === 'camilo@domain.com' && password === '1234') {
                let response = new HttpResponse({ 
                    status: 200, 
                    body: { token: token }
                });
                return response;
            } else {
                let response = new HttpResponse({
                    status: 400
                });
                return response;
            }
        }

        function getOrders() {
            if(headers.get('Authorization') === 'Bearer ' + token) {
                let response = new HttpResponse({
                    status: 200,
                    body: [1, 2, 3]
                });
                return response;
            } else {
                let response = new HttpResponse({
                    status: 401
                });
                return response;
            }
        }
    }
}

export let fakeBackendProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: fakeBackendFactory,
    multi: true
};