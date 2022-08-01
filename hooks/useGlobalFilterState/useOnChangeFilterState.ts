import { useEffect, useRef } from 'react';
import { FieldValues } from 'react-hook-form';
import { useSelectSearchParamsRouter } from '../useSelectSearchParamsRouter';
import { FilterKeyPropType, UseOnChangeFilterStateRestProps } from './types';
import { useGlobalFilterStateSelector } from './useGlobalFilterStateSelector';

export const useOnChangeFilterState = <
  TFieldValues extends FieldValues = FieldValues,
  TContext = any,
  SearchParamsKeys extends string = string,
>(
  filterKey: FilterKeyPropType,
  ...props: UseOnChangeFilterStateRestProps<TFieldValues, SearchParamsKeys>
) => {
  const [listener] = props;

  const listenerRef = useRef(
    typeof listener === 'function' ? listener : props[1],
  );
  listenerRef.current = typeof listener === 'function' ? listener : props[1];

  const { watch } = useGlobalFilterStateSelector<TFieldValues, TContext>(
    filterKey,
  );
  const routerInfoRef = useRef<any>();
  const routerInfo = useSelectSearchParamsRouter<SearchParamsKeys>(
    (typeof listener === 'function' ? props[1] : props[2]) ?? ([] as any),
  );
  routerInfoRef.current = routerInfo;

  const watchedValues =
    typeof listener === 'function' ? watch() : watch(listener as any);

  useEffect(() => {
    if (typeof listenerRef.current === 'function') {
      listenerRef.current(watchedValues as any, routerInfoRef.current);
    }
  }, [watchedValues]);
};
