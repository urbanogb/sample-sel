import { HttpClient } from '@angular/common/http';
import { DataSource } from '@angular/cdk/collections';
import { MatPaginator, MatSort } from '@angular/material';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';

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

  constructor(private paginator: MatPaginator, private sort: MatSort, private http: HttpClient) {
    super();
    this.getData();
  }

  getData(page: number = this.paginator.pageIndex + 1, limit: number = this.paginator.pageSize) {
    if (limit === undefined) { limit = 5; }
    console.log(`Pasa por getData`, page, limit);
    return this.http.get<TableItem[]>(`https://jsonplaceholder.typicode.com/photos?_page=${page}&_limit=${limit}`);
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
      this.sort.sortChange
    ];

    // Set the paginators length
    this.paginator.length = 500; // this.data.length;
    const mutaciones = merge(...dataMutations);
    const obsdata = () =>
      <TableItem[]>(source: Observable<TableItem[]>) =>
        new Observable<TableItem[]>(observer =>
          this.getPagedData(this.getSortedData([...this.data])).subscribe({
            next(x) {
              observer.next(x);
            }
          }));

    const observable = mutaciones.pipe( obsdata );
    mutaciones.subscribe(() => console.log('Mutaciones ', mutaciones));
    mutaciones.pipe(Observable. );
    observable.subscribe(() => console.log('Observable', observable));
    return observable;

  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect() { }

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  getPagedData(data: TableItem[]) {
    return this.getData();
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: TableItem[]) {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      switch (this.sort.active) {
        case 'albumId':
        case 'id':
        case 'title':
        case 'url':
        case 'thumbnailUrl':
          return compare(a[this.sort.active], b[this.sort.active], isAsc);
        default: return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a, b, isAsc) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
