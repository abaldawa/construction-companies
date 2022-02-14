/**
 * @author Abhijit Baldawa
 */

import {useMemo, useState} from "react";
import {ColumnSorter, ColumnSortOrder, DataGridColumn} from "../index";
import {useEventCallback} from "../../../hooks/useEventCallback";

type ActiveColumnSorter<RowData> = Record<keyof RowData, { sort: ColumnSorter<RowData>["sort"]; sortOrder: NonNullable<ColumnSortOrder>}>;

export const useColumnSorter = <RowData,>(
  columns:  DataGridColumn<RowData>[],
  rows: RowData[]
) => {
  const [activeColumnSorter, setActiveColumnSorter] = useState({} as ActiveColumnSorter<RowData>);

  /**
   * 1. Creates a map of filterId to column sorter function for all those columns where
   *    column.sort field is set by the user.
   */
  const fieldIdToColumnSorterFun = useMemo(() => {
    return columns.reduce((res, column) => {
      if(column.sort) {
        /**
         * 1. If the user has just configured "sort this column" but has NOT provided any sort function
         *    then create the sort function automatically on behalf of the user for that field
         *    so that the user has to configure less on columns giving MUCH convenience.
         * 2. Else, if the user has explicitly provided a sort function for a particular column then use
         *    that directly
         */
        if(typeof column.sort === "boolean") {
          /**
           * If column type is not provided by the user then PREDICT the column type by manually
           * inspecting the column type of FIRST row.
           *
           * NOTE: the prediction of column type by first row is hacky/magical and only exists so that
           * user CAN provide as less configuration in column as possible when setting up grid and purely
           * for convenience let the grid take care of all nitty-gritties. Obviously this approach
           * of prediction would fail if the column is optional and few rows may or may not have this
           * column field set. If the first row has a particular column optional whose sorting is
           * set to true then it will skip applying sorting as the grid cannot predict the column type.
           *
           * In such cases the user should EXPLICITLY set the "column.type" field so that the grid knows
           * about it.
           */
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

  /**
   * 2. Sort rows based active sorter and re-computes this if any active sorter change
   *    or the rows change.
   */
  const sortedRows = useMemo(() => {
    if(Object.keys(activeColumnSorter).length === 1) {
      const [{sort, sortOrder}] = Object.values(activeColumnSorter) as { sort: ColumnSorter<RowData>["sort"]; sortOrder: ColumnSortOrder}[];
      return [...rows].sort((row1, row2) => {
        return sort(row1, row2, sortOrder);
      });
    }

    return rows;
  }, [activeColumnSorter, rows]);

  /**
   * Update the active sorter if the user clicks sort on any column.
   * NOTE: ONLY once column sorter is active at any given time
   */
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