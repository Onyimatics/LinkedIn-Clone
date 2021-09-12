import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../../auth/services/auth.service';
import {switchMap, take} from 'rxjs/operators';
import {Role} from '../../../auth/models/user.model';
import {FormBuilder, FormGroup} from '@angular/forms';
import {BehaviorSubject, from, of, Subscription} from 'rxjs';
import {FileTypeResult, fromBuffer} from 'file-type';
import {BannerColorService} from '../../services/banner-color.service';

type ValidFileExtension = 'png' | 'jpg' | 'jpeg';
type ValidMimeType = 'image/png' | 'image/jpg' | 'image/jpeg';

@Component({
  selector: 'app-profile-summary',
  templateUrl: './profile-summary.component.html',
  styleUrls: ['./profile-summary.component.scss'],
})
export class ProfileSummaryComponent implements OnInit, OnDestroy {

  form: FormGroup;

  validFileExtensions: ValidFileExtension[] = ['png', 'jpg', 'jpeg'];
  validMimeTypes: ValidMimeType[] = ['image/png', 'image/jpg', 'image/jpeg'];

  userFullImagePath: string;
  fullName$ = new BehaviorSubject<string>(null);
  fullName = '';

  private userImagePathSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    public bannerColorService: BannerColorService
  ) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      file: ['']
    });
    this.authService.userRole.pipe(take(1)).subscribe((role: Role) => {
      this.bannerColorService.bannerColors = this.bannerColorService.getBannerColors(role);
    });

    this.authService.userFullName.pipe(take(1))
      .subscribe((fullName: string) => {
        this.fullName = fullName;
        this.fullName$.next(fullName);
      });

    this.userImagePathSubscription = this.authService.userFullImagePath
      .subscribe((fullImagePath: string) => {
        this.userFullImagePath = fullImagePath;
      });
  }

  onFileSelect(event: Event): void {
    const file: File = (event.target as HTMLInputElement).files[0];
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    from(file.arrayBuffer())
      .pipe(
        switchMap((buffer: Buffer) => from(fromBuffer(buffer)).pipe(
          switchMap((fileTypeResult: FileTypeResult) => {
            if (!fileTypeResult) {
              // TODO: error handling
              console.log({error: 'file format not supported!'});
              return of();
            }

            const {ext, mime} = fileTypeResult;
            const isFileTypeLegit = this.validFileExtensions.includes(ext as any);
            const isMimeTypeLegit = this.validMimeTypes.includes(mime as any);
            const isFileType = isFileTypeLegit && isMimeTypeLegit;
            if (!isFileType) {
              // TODO: error handling
              console.log({
                error: 'file format does not match file extension!',
              });
              return of();
            }
            return this.authService.uploadUserImage(formData);
          })
        ))
      ).subscribe();
    this.form.reset();
  }

  ngOnDestroy() {
    this.userImagePathSubscription.unsubscribe();
  }
}
