import { Injectable, Injector } from '@angular/core';
import { EntryModel } from './entry.model';
import { BaseResourceService } from '../../../shared/services/base-resource.service';
import { catchError, flatMap, map } from 'rxjs/internal/operators';
import { Observable } from 'rxjs';
import { CategoryService } from '../../categories/shared/category.service';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class EntryService extends BaseResourceService<EntryModel> {

  constructor(protected injector: Injector, private categoryService: CategoryService) {
    super('api/entries', injector, EntryModel.fromJson);
  }

  create(entry: EntryModel): Observable<EntryModel> {
    return this.setCategoryAndSendToServer(entry, super.create.bind(this));
  }

  update(entry: EntryModel): Observable<EntryModel> {
    return this.setCategoryAndSendToServer(entry, super.update.bind(this));
  }

  getByMonthAndYear(month: number, year: number): Observable<EntryModel[]> {
    return this.getAll().pipe(
      map(entries => this.filterByMonthAndYear(entries, month, year))
    );
  }

  private setCategoryAndSendToServer(entry: EntryModel, sendFn: any): Observable<EntryModel> {
    return this.categoryService.getById(entry.categoryId).pipe(
      flatMap(category => {
        entry.category = category;
        return sendFn(entry);
      }),
      catchError(this.handleError)
    );
  }

  private filterByMonthAndYear(entries: EntryModel[], month: number, year: number) {
    return entries.filter(entry => {
      const entryDate = moment(entry.date, 'DD/MM/YYYY');
      const monthMatches = entryDate.month() + 1 === month;
      const yearMatches = entryDate.year() === year;

      if (monthMatches && yearMatches) {
        return entry;
      }
    });
  }
}
