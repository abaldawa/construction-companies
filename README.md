# construction-companies
## Author: Abhijit Baldawa

### Description
A fullstack React.js/Node.js/Typescript application which shows list of all construction companies
along with search functionality.

### Tech Stack
1. Backend: Node.js (16.x)/Typescript and express.js
2. Front end: React.js/Typescript
3. Docker

### How to run:
1. git clone https://github.com/abaldawa/construction-companies.git
2. cd construction-companies
3. docker-compose up
4. go to http://localhost:3000 to see the UI

### Server REST API:
1. `GET /companies` -> Responds with list of constuction companies

### User interface
Below gif shows how the UI looks like.
![Construction-companies-app](https://user-images.githubusercontent.com/5449692/153883357-8e7c964c-e82d-4447-b591-8df9c1d915ac.gif)

### NOTE: I have created a custom data grid component which is fully flexible/configurable and supports below:
1. Sorting on columns.
2. Filtering on every/many columns i.e. multicolumn filter is possible and configurable.
3. Column filters can be ANY user provided component or the data grid can create a default filter for the user as well based on the type of column.
4. User can provide a custom rendrer to render each cell. This way user can render anything in any cell and configure each and every cell as necessary.
5. If user don't want to render every cell then user can provide styles to update the look for any cell as a configuration.
6. If user don't want to render every cell then user can provide a 'valueGetter' function as a part of column configuration so that user can control what values to display (ex. a date ISO string to a date displayed in say "DD-MM-YYYY").
7. Cells can be editable as well and listening to updated values is possible.
8. User can clear all applied filters on different columns at just one place by clicking clear all fiters.
9. User can show/hide individual columns to better visualise the table. Could be useful if there are many columns.

Please see below the configuration which the datagrid accepts. Check [client/src/app/shared/components/DataGrid/index.tsx](client/src/app/shared/components/DataGrid/index.tsx) for more details:
```typescript
interface ColumFilter<RowData> {
  renderColumnFilter?: (onColumnFilter: (arg: any, clearFilter: () => void) => void) => JSX.Element;
  filterData: (row: RowData, searchTerm: any) => boolean;
}

type ColumnSortOrder = "ASC" | "DES" | undefined;
interface ColumnSorter<RowData> {
  sort: (row1: RowData, row2: RowData, sortOrder: ColumnSortOrder) => number;
}

export interface DataGridColumn<RowData> {
  fieldId: keyof RowData;
  headerName: string;
  width: string | number;
  type?: "number" | "string" | "boolean";
  cell?: {
    renderCell?: (row: RowData) => JSX.Element;
    valueGetter?: (row: RowData) => React.ReactNode;
    editable?: boolean;
    onEdited?: (row: RowData, fieldId: keyof RowData, updatedValue: any) => void;
    getStyle?: (row: RowData) => CSSProperties | undefined;
  };
  filter?: ColumFilter<RowData> | boolean;
  sort?: ColumnSorter<RowData> | boolean;
}

export interface DataGridProps<RowData> {
  columns: DataGridColumn<RowData>[];
  rows: RowData[];
  getRowId: (row: RowData) => string | number;
  loading?: boolean;
  fixedHeaderWhenScroll?: boolean;
  height?: number | string;
  width?: number | string;
}
```
