# The problem with SelectModel and ajax tables
Using the selectmodel class of the library material / cdk / collections / selection, in a table generated with the material schema:table, paged, orderly, i find that when i advance and rewind pages the selection is lost.

# Sample multiselection in ajax datasources for Angular
This is a rapid sample for the propose to change @angular/cdk/collections/selection replacing the Set object javascript collection for a Map object

In this sample the data source is a https://jsonplaceholder.typicode.com/photos' url with 5000 rows for testing propose.

I deploy a standard table component with pagination and ordering, and modify the table datasource to change a static table to remote data obtaining by rest http request.

I modify the selection.ts to change Set object by Map object and inject in the constructor the "key" for each selection, the key is a field in the row data requested, it it's very usual, a key is crucial to update the remote data.

This modification save the actual selection of any/multiple pags and orders.

# Markation vs Selection
Marking a line no longer involves selecting it. The selected lines can be those marked or all the lines except those marked.

Mark is the action of the user on a checkbox. A user will not make many marks. If we start from an empty selection, marking will be the same as selecting rows.

If we start from all the selected rows, mark will deselect rows.

When we request the selection we will receive what the user has marked and a flag that indicates whether it has started from an empty selection or from all the rows of the selected table, so we can decide if the marks correspond to the action of selecting or deselecting .


Urbano García Barros
Vigo - Spain 
2018-07-29
