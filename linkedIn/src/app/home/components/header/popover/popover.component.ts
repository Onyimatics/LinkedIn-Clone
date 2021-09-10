import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../../../auth/services/auth.service';
import {BehaviorSubject, Subscription} from 'rxjs';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit, OnDestroy {

  userFullImagePath: string;
  fullName$ = new BehaviorSubject<string>(null);
  fullName = '';

  private userImagePathSubscription: Subscription;

  constructor(
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.userImagePathSubscription = this.authService.userFullImagePath
      .subscribe((fullImagePath: string) => {
        this.userFullImagePath = fullImagePath;
      });

    this.authService.userFullName.pipe(take(1))
      .subscribe((fullName: string) => {
        this.fullName = fullName;
        this.fullName$.next(fullName);
      });
  }

  onSignOut() {
    this.authService.logout();
    window.location.reload();
  }

  ngOnDestroy() {
    this.userImagePathSubscription.unsubscribe();
  }
}
