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
    super('api/entries', injector);
  }

  create(entry: EntryModel): Observable<EntryModel> {
    return this.categoryService.getById(entry.categoryId).pipe(
      flatMap(category => {
        entry.category = category;
        return super.create(entry);
      })
    );
  }

  update(entry: EntryModel): Observable<EntryModel> {
    return this.categoryService.getById(entry.categoryId).pipe(
      flatMap(category => {
        entry.category = category;
        return super.update(entry);
      })
    );
  }

  // PRIVATE METHODS
  private jsonDataToEntries(jsonData: any[]): EntryModel[] {
    const entries: EntryModel[] = [];

    jsonData.forEach(item => {
      const entry = Object.assign(new EntryModel(), item);
      entries.push(entry);
    });

    return entries;
  }

  private jsonDataToEntry(jsonData: any): EntryModel {
    return Object.assign(new EntryModel(), jsonData);
  }

}
