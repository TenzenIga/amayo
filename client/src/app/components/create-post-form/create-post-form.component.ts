import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  takeUntil
} from 'rxjs/operators';

import { postPayload, Sub } from '@shared/interfaces/interfaces';
import { createPost } from 'app/store/actions/post.action';
import { searchSubs, searchSubsClear } from 'app/store/actions/sub.action';
import { suggestedSubs } from 'app/store/selectors/sub.selector';
import { IAppState } from 'app/store/state/app.state';
import { quillConfiguration } from './quilConfig';

@Component({
  selector: 'app-create-post-form',
  templateUrl: './create-post-form.component.html',
  styleUrls: ['./create-post-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreatePostFormComponent implements OnInit, OnDestroy {
  public subName?: string;
  public postPayload: postPayload;
  public quilConfig = quillConfiguration;
  public postForm = new FormGroup({
    sub: new FormControl('', [Validators.required]),
    title: new FormControl('', [Validators.required]),
    body: new FormControl('', [Validators.required])
  });

  private readonly destroy$: Subject<void>;
  public readonly suggestions$: Observable<Sub[]>;
  public readonly inputSubscription$: Observable<string>;

  constructor(private store: Store<IAppState>) {
    this.suggestions$ = this.store.select(suggestedSubs);
    this.destroy$ = new Subject();
    this.inputSubscription$ = this.postForm.get('sub').valueChanges.pipe(
      filter((text) => text.length > 2 || text.length === 0),
      debounceTime(200),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    );
  }

  public ngOnInit(): void {
    this.inputSubscription$.subscribe((text) => {
      text.length === 0
        ? this.store.dispatch(searchSubsClear())
        : this.store.dispatch(searchSubs({ subName: text }));
    });
  }

  public createPost(): void {
    this.postPayload = this.postForm.value;
    this.store.dispatch(createPost({ postdData: this.postPayload }));
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
