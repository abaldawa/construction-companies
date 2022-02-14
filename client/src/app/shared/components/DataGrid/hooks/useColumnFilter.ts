/**
 * @author Abhijit Baldawa
 */

import {useMemo, useState} from "react";
import {ColumFilter, DataGridColumn, VisibleColumns} from "../index";
import {useEventCallback} from "../../../hooks/useEventCallback";
import {useDidUpdate} from "../../../hooks/useDidUpdate";

export type FilterChangeFun<RowData> = (
  fieldId: DataGridColumn<RowData>["fieldId"],
  searchTerm: any,
  clearFilter: () => void
) => void;

interface UseColumnFilterArgs<RowData> {
  columns:  DataGridColumn<RowData>[];
  visibleColumns: VisibleColumns;
  columnNameToFieldId: VisibleColumns;
  rows: RowData[];
}

export const useColumnFilter = <RowData,>({
  columns,
  visibleColumns,
  columnNameToFieldId,
  rows
}: UseColumnFilterArgs<RowData>) => {
  const [
    activeFieldIdToFilter,
    setActiveFieldIdToFilter
  ] = useState<Record<string, {filterData: ColumFilter<RowData>["filterData"]; searchTerm: any, clearFilter: () => void}>>({});

  /**
   * 1. Creates a map of filterId to filter function for all those columns where
   *    column.filter field is set by the user.
   */
  const fieldIdToFilterFun = useMemo(() => {
    return columns.reduce((res, column) => {
      if(column.filter) {
        /**
         * 1. If the user has just configured "filter this column" but has NOT provided any filter function
         *    then create the filter function automatically on behalf of the user for that field
         *    so that the user has to configure less on columns giving MUCH convenience.
         * 2. Else, if the user has explicitly provided a filter function for a particular column then use
         *    that directly
         */
        if(typeof column.filter === "boolean") {
          /**
           * If column type is not provided by the user then PREDICT the column type by manually
           * inspecting the column type of FIRST row.
           *
           * NOTE: the prediction of column type by first row is hacky/magical and only exists so that
           * user CAN provide as less configuration in column as possible when setting up grid and purely
           * for convenience let the grid take care of all nitty-gritties. Obviously this approach
           * of prediction would fail if the column is optional and few rows may or may not have this
           * column field set. If the first row has a particular column optional whose filtering is
           * set to true then it will skip applying filter as the grid cannot predict the column type.
           *
           * In such cases the user should EXPLICITLY set the "column.type" field so that the grid knows
           * about it.
           */
          if(column.type === "string" || typeof rows[0]?.[column.fieldId] === "string") {
            res[column.fieldId] = (row, searchTerm: string) => {
              return ((row[column.fieldId] || "") as any as string).toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase());
            };
          } else if(
            column.type === "number" ||
            column.type === "boolean" ||
            typeof rows[0]?.[column.fieldId] === "number" ||
            typeof rows[0]?.[column.fieldId] === "boolean"
          ) {
            res[column.fieldId] = (row, searchTerm: number | boolean) => {
              return (row[column.fieldId] as any as number | boolean) === searchTerm;
            };
          }
        } else if(typeof column.filter?.filterData === "function") {
          res[column.fieldId] = column.filter.filterData;
        }
      }

      return res;
    }, {} as Record<DataGridColumn<RowData>["fieldId"], ColumFilter<RowData>["filterData"]>)
  }, [columns]);

  /**
   * 2. Filter rows based ALL active filters and re-computes this if any active filters change
   *    or the rows change.
   */
  const {totalActiveFilters, filteredRows} = useMemo(() => {
    const totalActiveFilters = Object.keys(activeFieldIdToFilter).length;
    let filteredRows: RowData[] = [];

    if(totalActiveFilters) {
      filteredRows = rows.filter( row => {
        for(const {filterData, searchTerm} of Object.values(activeFieldIdToFilter)) {
          const passed = filterData(row, searchTerm);

          if(!passed) {
            return false;
          }
        }

        return true;
      } );
    }

    return {filteredRows: totalActiveFilters ? filteredRows : rows, totalActiveFilters};
  }, [activeFieldIdToFilter, rows]);

  /**
   * 3. If visible columns change then update the active filters to only those
   *    visible columns and REMOVE the filters from columns which are not visible
   *    so we have a predictable output.
   */
  useDidUpdate(() => {
    const visibleFieldIds = Object
      .values(visibleColumns)
      .map(columnHeaderName => columnNameToFieldId[columnHeaderName]);

    setActiveFieldIdToFilter( prevActiveFilter => {
      return Object.entries(prevActiveFilter)
        .reduce((newActiveFilter, [fieldId, filterObj]) => {
          if(visibleFieldIds.includes(fieldId)) {
            newActiveFilter[fieldId] = filterObj;
          }

          return newActiveFilter;
        }, {} as typeof prevActiveFilter);
    } );
  }, [visibleColumns, columnNameToFieldId]);

  /**
   * Update the active filters if the user types/changes any filter for any column
   */
  const onFilterChange: FilterChangeFun<RowData> = useEventCallback((
    fieldId,
    searchTerm,
    clearFilter
  ) => {
    const filterFun = fieldIdToFilterFun[fieldId];

    if(searchTerm) {
      setActiveFieldIdToFilter( (prevActiveFieldIdToFilter) => ({
        ...prevActiveFieldIdToFilter,
        [fieldId]: {
          filterData: filterFun,
          searchTerm,
          clearFilter
        }
      }));
    } else {
      setActiveFieldIdToFilter((prevActiveFieldIdToFilter) => {
        const activeFieldIdToFilterFunClone = {...prevActiveFieldIdToFilter};
        delete activeFieldIdToFilterFunClone[fieldId as string];
        return activeFieldIdToFilterFunClone;
      });
    }
  });

  /**
   * If the user clicks clear all filter in the UI then execute clearFilter
   * function of all active filters and all the hooks will react accordingly
   * to reset the UI and show all rows without any visible filters
   */
  const clearFilters = useEventCallback(() => {
    Object.values(activeFieldIdToFilter).forEach(({clearFilter}) => clearFilter());
  });

  return {filteredRows, onFilterChange, clearFilters, totalFilters: totalActiveFilters};
};