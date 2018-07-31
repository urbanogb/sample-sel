import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { TableDataSource } from './table-datasource';
import { HttpClient } from '@angular/common/http';
import { SelectionModel } from '@angular/cdk/collections';
//import { SelectionModel } from './selection';


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: TableDataSource;
  public selection = new SelectionModel(true, []);

  constructor(private http: HttpClient) {
    console.log(http);
  }

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'albumId', 'title', 'url', 'select'];

  ngOnInit() {
    this.dataSource = new TableDataSource(this.paginator, this.sort, this.http);
  }

  unpublish() {
    this.selection.selected.forEach(value => {
      console.log('Unpublish ', value, ' with rest api, todo.... ');
    });
  }

  publish() {
    this.selection.selected.forEach(value => {
      console.log('Publish ', value, ' with rest api, todo.... ');
    });
  }


}
