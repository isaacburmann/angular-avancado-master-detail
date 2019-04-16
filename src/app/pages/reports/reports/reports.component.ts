import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CategoryService } from '../../categories/shared/category.service';
import { EntryService } from '../../entries/shared/entry.service';
import { CategoryModel } from '../../categories/shared/category.model';
import { EntryModel } from '../../entries/shared/entry.model';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  expenseTotal: any = 0;
  revenueTotal: any = 0;
  balance: any = 0;

  expenseChartData: any;
  revenueChartData: any;

  chartOptions = {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
          }
      }]
    }
  };

  categories: CategoryModel[] = [];
  entries: EntryModel[] = [];

  @ViewChild('month') month: ElementRef = null;
  @ViewChild('year') year: ElementRef = null;

  constructor(
    private categoryService: CategoryService,
    private entryService: EntryService
  ) { }

  ngOnInit() {
    this.categoryService.getAll()
      .subscribe(categories => this.categories = categories);
  }

  generateReports() {
    const month = this.month.nativeElement.value;
    const year = this.year.nativeElement.value;

    if (!month || !year) {
      alert('Selecione o mes e o ano para gerar o relatorio');
    } else {
      this.entryService.getByMonthAndYear(month, year);
    }
  }

}
