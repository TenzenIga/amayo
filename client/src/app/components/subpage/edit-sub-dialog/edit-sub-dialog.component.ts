import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  Input,
  ViewChild
} from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormControl,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { SubService } from '@core/services/sub.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { Sub, subPayload } from '@shared/interfaces/interfaces';
import { getSub } from 'app/store/actions/sub.action';
import { IAppState } from 'app/store/state/app.state';

@Component({
  selector: 'app-edit-sub-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './edit-sub-dialog.component.html',
  styleUrl: './edit-sub-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditSubDialogComponent {
  @Input() sub: Sub;
  @ViewChild('imageInput', { static: false }) imageInput: ElementRef;
  @ViewChild('bannerInput', { static: false }) bannerInput: ElementRef;
  private store: Store<IAppState> = inject(Store);
  private subService = inject(SubService);
  public activeModal = inject(NgbActiveModal);
  public faCan = faTrash;
  public bannerPreview: string;
  public bannerFile: File | null;
  public imagePreview: string;
  public imageFile: File | null;
  // formdata не принимает boolean
  public isBannerDeleted: string = 'false';
  public isImageDeleted: string = 'false';

  public subForm = new UntypedFormGroup({
    description: new UntypedFormControl('', [Validators.maxLength(500)])
  });

  ngOnInit() {
    this.bannerPreview = this.sub.bannerUrl;
    this.imagePreview = this.sub.imageUrl;
    this.subForm.get('description').setValue(this.sub.description);
  }
  public editSub() {
    const formData = new FormData();
    formData.append('description', this.subForm.get('description')?.value);
    formData.append('isBannerDeleted', this.isBannerDeleted);
    formData.append('isImageDeleted', this.isImageDeleted);
    if (this.bannerFile) {
      formData.append('bannerUrn', this.bannerFile, this.bannerFile.name);
    }

    if (this.imageFile) {
      formData.append('imageUrn', this.imageFile, this.imageFile.name);
    }
    this.subService.editSub(this.sub.name, formData).subscribe({
      next: () => {
        this.store.dispatch(getSub({ subName: this.sub.name }));
        this.activeModal.close();
      },
      error: (e) => console.error(e)
    });
  }

  public onBannerChange(event) {
    const file = (<HTMLInputElement>event.target).files[0];
    this.bannerFile = file;
    this.bannerPreview = URL.createObjectURL(file);
    this.isBannerDeleted = 'false';
    this.isImageDeleted = 'false';
  }

  public onImageChange(event) {
    const file = (<HTMLInputElement>event.target).files[0];
    this.imageFile = file;
    this.imagePreview = URL.createObjectURL(file);
  }

  public onDeleteBanner() {
    this.bannerFile = null;
    this.bannerPreview = null;
    this.isBannerDeleted = 'true';
  }

  public deleteImage() {
    this.imageFile = null;
    this.imagePreview = null;
    this.isImageDeleted = 'true';
  }
}
