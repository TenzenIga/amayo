import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Sub } from '@shared/interfaces/interfaces';
import { selectSub } from 'app/store/selectors/sub.selector';
import { IAppState } from 'app/store/state/app.state';
import { Observable } from 'rxjs';
import { CreatePostFormComponent } from '../create-post-form/create-post-form.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { SubInfoComponent } from '../sub-info/sub-info.component';
import { PushPipe } from '@ngrx/component';

@Component({
    selector: 'app-create-post-page',
    templateUrl: './create-post-page.component.html',
    styleUrls: ['./create-post-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [CreatePostFormComponent, SidebarComponent, SubInfoComponent, PushPipe]
})
export class CreatePostPageComponent {
  private store: Store<IAppState> = inject(Store);
  public subName: string | null = null;
  public readonly activeSub$: Observable<Sub> = this.store.select(selectSub);

  get hasActiveSub(){
    return this.subName !== null;
  }
}

