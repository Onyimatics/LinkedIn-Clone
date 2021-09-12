import {Component, OnDestroy, OnInit} from '@angular/core';
import {BannerColorService} from '../../services/banner-color.service';
import {Observable, Subscription} from 'rxjs';
import {ActivatedRoute, UrlSegment} from '@angular/router';
import {map, switchMap, take, tap} from 'rxjs/operators';
import {User} from '../../../auth/models/user.model';
import {ConnectionProfileService} from '../../services/connection-profile.service';
import {log} from 'util';
import {FriendRequest_Status, FriendRequestStatus} from '../../models/FriendRequest';

@Component({
  selector: 'app-connection-profile',
  templateUrl: './connection-profile.component.html',
  styleUrls: ['./connection-profile.component.scss'],
})
export class ConnectionProfileComponent implements OnInit, OnDestroy {

  user: User;
  friendRequestStatus: FriendRequest_Status;
  friendRequestStatusSubscription$: Subscription;
  userSubscription$: Subscription;

  constructor(
    public bannerColorService: BannerColorService,
    private route: ActivatedRoute,
    private connectionProfileService: ConnectionProfileService,
  ) { }

  ngOnInit() {
    this.friendRequestStatusSubscription$ = this.getFriendRequestStatus()
      .pipe(
        tap((friendRequestStatus: FriendRequestStatus) => {
          this.friendRequestStatus = friendRequestStatus.status;
          this.userSubscription$ = this.getUser().subscribe((user: User) => {
            this.user = user;
            const imagePath = user?.imagePath ?? 'profile-pix.png';
            this.user['fullImagePath'] =
              'http://localhost:3000/api/feed/image/' + imagePath;
          })
        })
      ).subscribe();
  }

  getUser(): Observable<User> {
    return this.getUserIdFromUrl().pipe(
      switchMap((userId: number) => {
        return this.connectionProfileService.getConnectionUser(userId);
      })
    )
  }

  addUser(): Subscription {
    this.friendRequestStatus = 'pending';
    return this.getUserIdFromUrl().pipe(
      switchMap((userId: number) => {
        return this.connectionProfileService.addConnectionUser(userId);
      }),
      take(1)
    ).subscribe();
  }

  private getUserIdFromUrl(): Observable<number> {
    return this.route.url.pipe(
      map((urlSegment: UrlSegment[]) => {
        return +urlSegment[0].path
      })
    )
  }

  getFriendRequestStatus(): Observable<FriendRequestStatus> {
    return this.getUserIdFromUrl().pipe(
      switchMap((userId: number) => {
        return this.connectionProfileService.getFriendRequestStatus(userId);
      })
    )
  }

  ngOnDestroy() {
    this.userSubscription$.unsubscribe();
    this.friendRequestStatusSubscription$.unsubscribe();
  }

}
