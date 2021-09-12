import { Component, OnInit } from '@angular/core';
import {ConnectionProfileService} from '../../../services/connection-profile.service';
import {PopoverController} from '@ionic/angular';
import {FriendRequest} from '../../../models/FriendRequest';
import {take, tap} from 'rxjs/operators';
import {User} from '../../../../auth/models/user.model';

@Component({
  selector: 'app-friend-request-popover',
  templateUrl: './friend-requests-popover.component.html',
  styleUrls: ['./friend-requests-popover.component.scss'],
})
export class FriendRequestsPopoverComponent implements OnInit {

  constructor(
    public connectionProfileService: ConnectionProfileService,
    private popoverController: PopoverController
  ) { }

  ngOnInit() {
    this.connectionProfileService.friendRequests.map(
      (friendRequest: FriendRequest) => {
        const creatorId = (friendRequest as any)?.creator?.id;

        if(friendRequest && creatorId) {
          this.connectionProfileService.getConnectionUser(creatorId)
            .pipe(
              // take 1 so you don't have to unsubscribe from it
              take(1),
              tap((user: User) => {
                friendRequest['fullImagePath'] =
                  'http://localhost:3000/api/feed/image/' +
                  (user?.imagePath || 'profile-pix.png');
              })
            ).subscribe();
        }
      }
    )
  }

  async respondToFriendRequest(
    id: number,
    statusResponse: 'accepted' | 'declined'
  ) {
    const handledFriendRequest: FriendRequest =
      this.connectionProfileService.friendRequests.find(
        (friendRequest) => friendRequest.id === id
      )

    const unhandledFriendRequests: FriendRequest[] =
      this.connectionProfileService.friendRequests.filter(
        (friendRequest) => friendRequest.id !== handledFriendRequest.id
      );

    this.connectionProfileService.friendRequests = unhandledFriendRequests;

    if (this.connectionProfileService?.friendRequests.length === 0) {
      await this.popoverController.dismiss();
    }

    return this.connectionProfileService
      .respondToFriendRequest(id, statusResponse)
      .pipe(take(1))
      .subscribe();
  }

}
