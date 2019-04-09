import { Component, OnInit } from '@angular/core';
import {EntryModel} from '../shared/entry.model';
import {EntryService} from '../shared/entry.service';

@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.scss']
})
export class EntryListComponent implements OnInit {

  entries: EntryModel[] = [];

  constructor(private entryService: EntryService) { }

  ngOnInit() {
    this.entryService.getAll().subscribe(
      entries => this.entries = entries,
      error => alert('Erro ao listar categorias')
    );
  }

  deleteEntry(entry) {
    const mustDelete = confirm('Deseja realmente excluir essa categoria?');

    if (mustDelete) {
      this.entryService.delete(entry.id).subscribe(
        () => this.entries = this.entries.filter(item => item !== entry),
        () => 'Erro ao tentar excluir a categoria!'
      );
    }
  }

}
