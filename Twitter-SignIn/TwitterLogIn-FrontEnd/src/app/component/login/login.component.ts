import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestToken } from 'src/app/model/RequestToken.model';
import { TwitterAuthService } from 'src/app/service/twitter-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  private requestToken: Partial<RequestToken> = {};
   disableButton = false;
   isLoading = false;

   constructor(private twitterService: TwitterAuthService,   private route: ActivatedRoute, private router: Router) 
   {
    this.route.queryParamMap.subscribe(params => {
      const oauth_token = this.route.snapshot.queryParamMap.get('oauth_token');
      const oauth_verifier = this.route.snapshot.queryParamMap.get("oauth_verifier");
      if (oauth_token && oauth_verifier) {
        this.disableButton = true;
        this.isLoading = true;
        this.twitterService.getAccessToken(oauth_token, oauth_verifier).subscribe(null, error => console.log(error)
        ,() => {
          this.router.navigate(['/home']);
        });
      }
    });
    }

   ngOnInit() {

   }

   launchTwitterLogin() {
    this.isLoading = true;
    this.disableButton = true;
    this.twitterService.getRequestToken()
     .subscribe(response => this.requestToken = response, 
       error => console.log(error), 
       () => {
       location.href = "https://api.twitter.com/oauth/authenticate?" + this.requestToken.oauth_token;
       }
     );
    }
}
