import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { UntypedFormGroup, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import {
  debounceTime,
  distinctUntilChanged,
  takeUntil
} from 'rxjs/operators';
import { faTimes } from '@fortawesome/free-solid-svg-icons';


import { postPayload, Sub } from '@shared/interfaces/interfaces';
import { createPost } from 'app/store/actions/post.action';
import { searchSubs, searchSubsClear } from 'app/store/actions/sub.action';
import { selectSub, suggestedSubs } from 'app/store/selectors/sub.selector';
import { IAppState } from 'app/store/state/app.state';
import { quillConfiguration } from './quilConfig';
import { SuggestionsComponent } from '../../shared/components/suggestions/suggestions.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { QuillEditorComponent } from 'ngx-quill';
import { PushPipe } from '@ngrx/component';
@Component({
    selector: 'app-create-post-form',
    templateUrl: './create-post-form.component.html',
    styleUrls: ['./create-post-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [ReactiveFormsModule, SuggestionsComponent, FontAwesomeModule, QuillEditorComponent, PushPipe]
})
export class CreatePostFormComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;

  public subName?: string;
  public postPayload: postPayload;
  public quilConfig = quillConfiguration;
  public postForm: UntypedFormGroup;
  public selectedFile: File | null = null;
  public imgUrl:string | null = null;
  public readonly inputSubscription$: Observable<string>;
  public readonly faXmark = faTimes;
  public readonly activeSub$: Observable<Sub>;
  public readonly suggestions$: Observable<Sub[]>;
  private readonly destroy$: Subject<void>;

  constructor(private store: Store<IAppState>, private fb: FormBuilder) {
    this.postForm = this.fb.group({
      sub: ['', [Validators.required]],
      title: ['', [Validators.required]],
      body: [''],
      file: [null]
    });
    this.suggestions$ = this.store.select(suggestedSubs);
    this.activeSub$ =this.store.select(selectSub);
    this.destroy$ = new Subject();

    this.inputSubscription$ = this.postForm.get('sub').valueChanges.pipe(
      // filter((text) => text.length > 2 || text.length === 0),
      debounceTime(200),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    );
  }

  public ngOnInit(): void {
    this.inputSubscription$.pipe(takeUntil(this.destroy$)).subscribe((text) => {
      text.length === 0
        ? this.store.dispatch(searchSubsClear())
        : this.store.dispatch(searchSubs({ subName: text }));
    });
    
    this.activeSub$.pipe(takeUntil(this.destroy$)).subscribe(sub => {
      this.setSub(sub.name);
    })
  }

  public cancelUpload(): void {
      this.imgUrl = null;
      this.selectedFile = null;
      this.fileInput.nativeElement.value = null;
  }

  public onFileSelected(event: Event): void {
    const file = (<HTMLInputElement>event.target).files[0];
    this.imgUrl = URL.createObjectURL(file)
      
      if (file) {
        this.selectedFile = file;
        this.postForm.patchValue({ 
          image: file
        });
        this.postForm.get('file')?.updateValueAndValidity();
      }
  }

  public createPost(): void {
    let formData = new FormData();
      formData.append('sub', this.postForm.get('sub')?.value);
      formData.append('title', this.postForm.get('title')?.value);
      if(this.selectedFile){
        formData.append('file', this.selectedFile, this.selectedFile.name);
      }
      
     this.store.dispatch(createPost({ postdData: formData }));
    
  }

  public setSub(name: string): void {
    this.postForm.get('sub').setValue(name, { emitEvent: false });
    this.store.dispatch(searchSubsClear());
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
