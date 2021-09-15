import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService} from './services/auth.service';
import {NewUser} from './models/newUser.model';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit, OnDestroy {

  @ViewChild('form') form: NgForm;

  submissionType: 'login' | 'join' = 'login';

  subs: Subscription[];

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
  }

  ngOnInit() {
  }

  onSubmit() {
    const {email, password} = this.form.value;
    if (!email || !password) {return;}

    if (this.submissionType === 'login') {
      return this.authService.login(email, password)
        .subscribe((data) => {
          console.log('User Data');
          this.router.navigateByUrl('/home');
        });
    } else if (this.submissionType === 'join') {
      const {firstName, lastName} = this.form.value;
      if (!firstName || !lastName) {return;}

      const newUser: NewUser = { firstName, lastName, email, password };
      return this.authService.register(newUser)
        .subscribe((data) => {
          console.log('User Data', data);
          this.toggleText();
        });
    }
  }

  toggleText() {
    if (this.submissionType === 'login') {
      this.submissionType = 'join';
    } else if (this.submissionType === 'join') {
      this.submissionType = 'login';
    }
  }

  ngOnDestroy() {
  }
}
