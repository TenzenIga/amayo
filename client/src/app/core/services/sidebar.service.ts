import { Injectable, signal } from "@angular/core";

@Injectable({
    providedIn:'root'
})
export class SidebarService {
    private _isVisible = signal(false);
    public isVisible = this._isVisible.asReadonly();
    
    toggle() {
        this._isVisible.update(current => !current);
    }

}