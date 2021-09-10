import {Component, OnDestroy, OnInit} from '@angular/core';
import { PopoverController } from '@ionic/angular';
import {PopoverComponent} from './popover/popover.component';
import {Subscription} from 'rxjs';
import {AuthService} from '../../../auth/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {

  userFullImagePath: string;
  private userImagePathSubscription: Subscription;

  constructor(
    public popoverController: PopoverController,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.userImagePathSubscription = this.authService.userFullImagePath
      .subscribe((fullImagePath: string) => {
        this.userFullImagePath = fullImagePath;
      });
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      cssClass: 'my-custom-class',
      event: ev,
      showBackdrop: false
    });
    await popover.present();

    const { role } = await popover.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  ngOnDestroy() {
    this.userImagePathSubscription.unsubscribe();
  }
}
