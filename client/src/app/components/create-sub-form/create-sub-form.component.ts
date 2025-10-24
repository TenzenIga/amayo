import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormControl,
  Validators,
  ReactiveFormsModule,
  AbstractControl
} from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { SubService } from '@core/services/sub.service';
import { AuthService } from '@core/services/auth.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-create-sub-form',
  templateUrl: './create-sub-form.component.html',
  styleUrls: ['./create-sub-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ReactiveFormsModule, FontAwesomeModule]
})
export class CreateSubFormComponent implements OnInit {
  @ViewChild('imageInput', { static: false }) imageInput: ElementRef;
  @ViewChild('bannerInput', { static: false }) bannerInput: ElementRef;

  public readonly faXmark = faTimes;
  public error: string | null;
  public remainingChars: number = 21;
  public step: number = 1;
  public bannerPreview: string;
  public bannerFile: File | null;
  public imagePreview: string;
  public imageFile: File | null;
  public defaultIcon =
    'url(https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y)';
  public subForm = new UntypedFormGroup({
    name: new UntypedFormControl('', [Validators.required]),
    description: new UntypedFormControl('', [Validators.maxLength(500)])
  });

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private subService: SubService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.subForm.get('name').valueChanges.subscribe((v) => {
      this.remainingChars = 21 - (v?.length || 0);
    });
  }

  public isLastStep(): boolean {
    return this.step === 2;
  }

  public isFirstStep(): boolean {
    return this.step === 1;
  }

  public nextStep(): void {
    console.log('click');

    this.step++;
  }

  public prevStep(): void {
    this.step--;
  }

  getRemainingChars() {
    return this.remainingChars;
  }

  public onBlur() {
    if (this.subForm.get('name').value.length) {
      const subPayload = {
        name: this.subForm.get('name').value
      };
      this.subService.validateSub(subPayload).subscribe((res) => {
        this.error = res.fieldError;
      });
    }
  }

  public createSub(): void {
    const formData = new FormData();
    formData.append('name', this.subForm.get('name')?.value);
    formData.append('description', this.subForm.get('description')?.value);
    if (this.bannerFile) {
      formData.append('bannerUrn', this.bannerFile, this.bannerFile.name);
    }

    if (this.imageFile) {
      formData.append('imageUrn', this.imageFile, this.imageFile.name);
    }
    this.subService.createSub(formData).subscribe({
      next: () => {
        this.modalService.dismissAll(),
          this.router.navigate([`/r/${this.subForm.get('name').value}`]);
      },
      error: (e) => console.error(e)
    });
  }

  public triggerModal<T>(content: TemplateRef<T>): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.modalService.open(content, { size: 'lg' });
  }

  public onBannerChange(event) {
    const file = (<HTMLInputElement>event.target).files[0];
    this.bannerFile = file;
    this.bannerPreview = URL.createObjectURL(file);
  }

  public onImageChange(event) {
    const file = (<HTMLInputElement>event.target).files[0];
    this.imageFile = file;
    this.imagePreview = URL.createObjectURL(file);
  }

  public cancelBannerUpload() {
    this.bannerFile = null;
    this.bannerPreview = null;
  }

  public cancelImageUpload() {
    this.imageFile = null;
    this.imagePreview = null;
  }

  // Custom file validator
  public fileValidator(
    control: AbstractControl
  ): { [key: string]: any } | null {
    const file = control.value;
    if (!file) {
      return null;
    }

    if (file instanceof File) {
      // Check file type
      const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp'
      ];
      if (!allowedTypes.includes(file.type)) {
        return { invalidFileType: true };
      }

      // Check file size (2MB max)
      const maxSize = 2 * 1024 * 1024;
      if (file.size > maxSize) {
        return { fileTooLarge: true };
      }
    }

    return null;
  }
}
