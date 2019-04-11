import { Injectable, Injector } from '@angular/core';
import { EntryModel } from './entry.model';
import { BaseResourceService } from '../../../shared/services/base-resource.service';
import { flatMap } from 'rxjs/internal/operators';
import { Observable } from 'rxjs';
import { CategoryService } from '../../categories/shared/category.service';

@Injectable({
  providedIn: 'root'
})
export class EntryService extends BaseResourceService<EntryModel> {

  constructor(protected injector: Injector, private categoryService: CategoryService) {
    super('api/entries', injector, EntryModel.fromJson);
  }

  create(entry: EntryModel): Observable<EntryModel> {
    return this.setCategoryAndSendToServer(entry, super.create);
  }

  update(entry: EntryModel): Observable<EntryModel> {
    return this.setCategoryAndSendToServer(entry, super.update);
  }

  private setCategoryAndSendToServer(entry: EntryModel, sendFn: any): Observable<EntryModel> {
    return this.categoryService.getById(entry.categoryId).pipe(
      flatMap(category => {
        entry.category = category;
        return super.create(entry);
      })
    );
  }
}
