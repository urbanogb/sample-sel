import { HttpClient } from '@angular/common/http';
import { DataSource } from '@angular/cdk/collections';
import { MatPaginator, MatSort } from '@angular/material';
import { Observable, of as observableOf, merge, pipe } from 'rxjs';
import { switchMap, debounceTime } from 'rxjs/operators';

// TODO: Replace this with your own data model type
export interface TableItem {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}

/**
 * Data source for the Table view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class TableDataSource extends DataSource<TableItem> {
  data: TableItem[] = [];
  pageSize = 5;
  constructor(private paginator: MatPaginator, private sort: MatSort, private http: HttpClient) {
    super();
  }

  getData(
    page: number = this.paginator.pageIndex + 1,
    limit: number = this.paginator.pageSize,
    sort: string = this.sort.active,
    order: string = this.sort.direction) {
    const url = 'https://jsonplaceholder.typicode.com/photos';
    let options = '';
    if (page && limit === undefined) { limit = this.pageSize; }
    if ( page ) { options = `?_page=${page}&_limit=${limit}`; }
    if ( sort ) { options += `&_sort=${sort}&_order=${order}`; }
    return this.http.get<TableItem[]>(url + options);
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<TableItem[]> {
    // Combine everything that affects the rendered data into one update
    // stream for the data-table to consume.
    const dataMutations = [
      observableOf(this.data),
      this.paginator.page,
      this.sort.sortChange,
    ];
    // Set the paginators length to sample
    this.paginator.length = 5000; // this.data.length;

    return merge(...dataMutations).pipe(
      debounceTime(300),
      switchMap(() => this.getData())
    );
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect() { }
}
