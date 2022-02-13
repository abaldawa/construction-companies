import {useMemo, useState} from "react";
import {ColumnSorter, ColumnSortOrder, DataGridColumn} from "../index";
import {useEventCallback} from "../../../hooks/useEventCallback";

type ActiveColumnSorter<RowData> = Record<keyof RowData, { sort: ColumnSorter<RowData>["sort"]; sortOrder: NonNullable<ColumnSortOrder>}>;

export const useColumnSorter = <RowData,>(
  columns:  DataGridColumn<RowData>[],
  rows: RowData[]
) => {
  const [activeColumnSorter, setActiveColumnSorter] = useState({} as ActiveColumnSorter<RowData>);

  const fieldIdToColumnSorterFun = useMemo(() => {
    return columns.reduce((res, column) => {
      if(column.sort) {
        if(typeof column.sort === "boolean") {
          if(column.type === "string" || typeof rows[0]?.[column.fieldId] === "string") {
            res[column.fieldId] = (row1, row2, sortOrder) => {
              if(sortOrder === "ASC") {
                return ((row1[column.fieldId] || "") as any as string).localeCompare((row2[column.fieldId] || "") as any as string);
              } else {
                return ((row2[column.fieldId] || "") as any as string).localeCompare((row1[column.fieldId] || "") as any as string);
              }
            };
          } else if(column.type === "number" || typeof rows[0]?.[column.fieldId] === "number") {
            res[column.fieldId] = (row1, row2, sortOrder) => {
              if(sortOrder === "ASC") {
                return (row1[column.fieldId] as any as number) - (row2[column.fieldId] as any as number);
              } else {
                return (row2[column.fieldId] as any as number) - (row1[column.fieldId] as any as number);
              }
            };
          }
        } else if(typeof column.sort.sort === "function") {
          res[column.fieldId] = column.sort.sort;
        }
      }
      return res;
    }, {} as Record<DataGridColumn<RowData>["fieldId"], ColumnSorter<RowData>["sort"]>);
  }, [columns]);

  const sortedRows = useMemo(() => {
    if(Object.keys(activeColumnSorter).length === 1) {
      const [{sort, sortOrder}] = Object.values(activeColumnSorter) as { sort: ColumnSorter<RowData>["sort"]; sortOrder: ColumnSortOrder}[];
      return [...rows].sort((row1, row2) => {
        return sort(row1, row2, sortOrder);
      });
    }

    return rows;
  }, [activeColumnSorter, rows]);


  const onSortChange = useEventCallback((
    fieldId: DataGridColumn<RowData>["fieldId"],
    columnSortOrder: ColumnSortOrder
  ) => {
    const sortFun = fieldIdToColumnSorterFun[fieldId];
    if(columnSortOrder) {
      setActiveColumnSorter({
        [fieldId]: {
          sort: sortFun,
          sortOrder: columnSortOrder
        }
      } as ActiveColumnSorter<RowData>);
    } else {
      setActiveColumnSorter({} as ActiveColumnSorter<RowData>);
    }
  });

  return {sortedRows, activeColumnSorter, onSortChange};
};