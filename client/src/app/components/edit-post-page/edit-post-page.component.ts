import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  ViewChild
} from '@angular/core';
import {
  UntypedFormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { Post, postPayload, Sub } from '@shared/interfaces/interfaces';
import { editPost } from 'app/store/actions/post.action';
import { selectSub } from 'app/store/selectors/sub.selector';
import { IAppState } from 'app/store/state/app.state';
import { Observable, Subject, take } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { QuillEditorComponent } from 'ngx-quill';
import { quillConfiguration } from '@shared/utils';
import { selectPost } from 'app/store/selectors/post.selector';
import { PushPipe } from '@ngrx/component';
import { Router } from '@angular/router';
import slugify from 'slugify';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { SubInfoComponent } from '../sub-info/sub-info.component';

@Component({
  selector: 'app-edit-post-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FontAwesomeModule,
    QuillEditorComponent,
    PushPipe,
    SidebarComponent,
    SubInfoComponent
  ],
  templateUrl: './edit-post-page.component.html',
  styleUrl: './edit-post-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditPostPageComponent {
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;
  private store: Store<IAppState> = inject(Store);
  private fb: FormBuilder = inject(FormBuilder);
  private router: Router = inject(Router);

  public post: Post;
  public postPayload: postPayload;
  public quilConfig = quillConfiguration;
  public postForm: UntypedFormGroup;
  public selectedFile: File | null = null;
  public imgUrl: string | null = null;
  public isImageDeleted: string = 'false';
  public readonly faXmark = faTimes;
  public post$: Observable<Post> = this.store.select(selectPost);
  public readonly activeSub$: Observable<Sub> = this.store.select(selectSub);

  public ngOnInit(): void {
    this.postForm = this.fb.group({
      title: ['', [Validators.required]],
      body: ['']
    });

    this.post$.pipe(take(1)).subscribe((post) => {
      this.post = post;
      this.imgUrl = post.postImageUrl;

      this.postForm.patchValue({
        title: post.title,
        body: post.body
      });
    });
  }

  public cancelUpload(): void {
    this.imgUrl = null;
    this.selectedFile = null;
    this.fileInput.nativeElement.value = null;
    this.isImageDeleted = 'true';
  }

  public onFileSelected(event: Event): void {
    const file = (<HTMLInputElement>event.target).files[0];
    this.imgUrl = URL.createObjectURL(file);

    if (file) {
      this.selectedFile = file;
      this.postForm.patchValue({
        image: file
      });
      this.postForm.get('file')?.updateValueAndValidity();
    }
    this.isImageDeleted = 'false';
  }

  public submitEdit(): void {
    let formData = new FormData();
    const { identifier, slug } = this.post;
    formData.append('title', this.postForm.get('title')?.value);
    formData.append('body', this.postForm.get('body').value);
    formData.append('isImageDeleted', this.isImageDeleted);
    if (this.selectedFile) {
      formData.append('file', this.selectedFile, this.selectedFile.name);
    }

    this.store.dispatch(editPost({ identifier, slug, postdData: formData }));
  }
  public cancelEdit() {
    this.router.navigate([
      `/r/${this.post.subName}/${this.post.identifier}/${slugify(
        this.post.title,
        '_'
      )}`
    ]);
  }
}
