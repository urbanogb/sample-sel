# Sample multiselection in ajax datasources for Angular
This is a rapid sample for the propose to change @angular/cdk/collections/selection replacing the Set object javascript collection for a Map object

In this sample the data source is a https://jsonplaceholder.typicode.com/photos' url with 5000 rows for testing propose.

I deploy a standard table component with pagination and ordering, and modify the table datasource to change a static table to remote data obtaining by rest http request.

I modify the selection.ts to change Set object by Map object and inject in the constructor the "key" for each selection, the key is a field in the row data requested, it it's very usual, a key is crucial to update the remote data.

This modification save the actual selection of any/multiple pags and orders.


Urbano García Barros
Vigo - Spain 
2018-07-29
