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

  const fieldIdToFilterFun = useMemo(() => {
    return columns.reduce((res, column) => {
      if(column.filter) {
        if(typeof column.filter === "boolean") {
          if(column.type === "string" || typeof rows[0]?.[column.fieldId] === "string") {
            res[column.fieldId] = (row, searchTerm: string) => {
              return (row[column.fieldId] as any as string).toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase());
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

  const clearFilters = useEventCallback(() => {
    Object.values(activeFieldIdToFilter).forEach(({clearFilter}) => clearFilter());
  });

  return {filteredRows, onFilterChange, clearFilters, totalFilters: totalActiveFilters};
};