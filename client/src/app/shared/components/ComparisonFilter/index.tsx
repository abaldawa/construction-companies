import React, {useState} from "react";
import {Input, OnInputChange} from "../DataGrid/columnFilters/InputFilter";
import {useEventCallback} from "../../hooks/useEventCallback";
import {useDidUpdate} from "../../hooks/useDidUpdate";

type ComparisonObj<Type> = {
  start?: {
    value: Type;
    clear: () => void;
  };
  end?: {
    value: Type;
    clear: () => void;
  };
};

export type ComparisonFilterObj<Type> = {
  start?: Type,
  end?: Type;
}

interface ComparisonFilterProps<Type> {
  type: "number" | "date";
  onColumnFilter: (filterObj: ComparisonFilterObj<Type> | undefined, clearComparison: () => void) => void;
  children?: never;
}

const getEndDate = (date: Date) => {
  const cloneDate = new Date(date);
  cloneDate.setHours(23);
  cloneDate.setMinutes(59);
  cloneDate.setSeconds(59);
  cloneDate.setMinutes(999);

  return cloneDate;
}

export const ComparisonFilter = <Type extends number | Date>({
  type,
  onColumnFilter
}: ComparisonFilterProps<Type>) => {
  const [comparatorObj, setComparatorObj] = useState<ComparisonObj<Type>>({});

  const handleInputChange: OnInputChange<number | string> = useEventCallback(({
    inputValue: value,
    name,
    clearInput
  }) => {
    switch (type) {
      case "number":
        if(value) {
          (comparatorObj as ComparisonObj<number>)[name as keyof ComparisonObj<number>] = {
            value: +value,
            clear: clearInput
          };
        } else {
          delete comparatorObj[name as keyof ComparisonObj<Type>];
        }
        break;
      case "date":
        if(value) {
          (comparatorObj as ComparisonObj<Date>)[name as keyof ComparisonObj<Date>] = {
            value: new Date(value),
            clear: clearInput
          };
        } else {
          delete comparatorObj[name as keyof ComparisonObj<Type>];
        }

        if((comparatorObj as ComparisonObj<Date>).end) {
          (comparatorObj as ComparisonObj<Date>)!.end!.value = getEndDate((comparatorObj as ComparisonObj<Date>)!.end!.value!);
        }
        break;
    }

    if(Object.keys(comparatorObj).length) {
      setComparatorObj({...comparatorObj});
    } else {
      setComparatorObj({});
    }
  });

  const clearComparison = useEventCallback(() => {
    comparatorObj.start?.clear();
    comparatorObj.end?.clear();
  });

  useDidUpdate(() => {
    if(!comparatorObj.start && !comparatorObj.end) {
      onColumnFilter(undefined, clearComparison);
    } else {
      const filterObj = Object.entries(comparatorObj).reduce((res, [key, value]) => {
        if(value) {
          res[key as keyof typeof comparatorObj] = value.value;
        }
        return res;
      }, {} as Record<keyof typeof comparatorObj, Type>);
      onColumnFilter(filterObj, clearComparison);
    }
  }, [comparatorObj]);

  return (
    <div>
      <Input name="start" style={{width: "100%"}} type={type} onInputChange={handleInputChange}/>
      to
      <Input name="end" style={{width: "100%"}} type={type} onInputChange={handleInputChange}/>
    </div>
  );
};