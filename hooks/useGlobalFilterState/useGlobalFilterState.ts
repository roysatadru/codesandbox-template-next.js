import { useMemo, useRef, useState } from 'react';
import { UseQueryResult } from '@tanstack/react-query';
import { FieldValues, useForm } from 'react-hook-form';
import { isEqual } from 'lodash-es';

import { globalFilterStore } from './globalFilterStateAtom';
import { UseGlobalFilterStateProps, UseGlobalFilterStateReturn } from './types';

export const useGlobalFilterState = <
  TFieldValues extends FieldValues = FieldValues,
  TContext = any,
  SyncValuesType = unknown,
  UseAsyncMiddlewareOtherReturnType = UseQueryResult<TFieldValues>,
  UseMiddlewareOtherReturnType = { [others: string | number]: unknown },
>(
  ...params: UseGlobalFilterStateProps<
    TFieldValues,
    TContext,
    SyncValuesType,
    UseAsyncMiddlewareOtherReturnType,
    UseMiddlewareOtherReturnType
  >
) => {
  const [filterKey, hookFormProps = {}, syncValueProps = {}] = params;
  const {
    values: notMemoizedValues,
    disableDeepCompare = false,
    stopSync = false,
    useMiddleware,
  } = syncValueProps;

  const methods = useForm<TFieldValues, TContext>(hookFormProps);

  const { getValues } = methods;

  const memoizedValuesRef = useRef({
    value: notMemoizedValues,
    prevFormValues: getValues(),
  });
  const memoizedValues = useMemo(() => {
    if (stopSync) {
      return memoizedValuesRef.current;
    }
    if (
      !disableDeepCompare &&
      isEqual(memoizedValuesRef.current.value, notMemoizedValues)
    ) {
      return memoizedValuesRef.current;
    }
    memoizedValuesRef.current = {
      value: notMemoizedValues,
      prevFormValues: getValues(),
    };
    return memoizedValuesRef.current;
  }, [disableDeepCompare, getValues, notMemoizedValues, stopSync]);

  const { middlewareType, data, ...restMiddlewareResult } =
    useMiddleware?.(memoizedValues.value, memoizedValues.prevFormValues) ?? {};

  if (restMiddlewareResult.hasOwnProperty('fetchStatus')) {
    const { fetchStatus, status } = restMiddlewareResult as unknown as {
      fetchStatus: UseQueryResult['fetchStatus'];
      status: UseQueryResult['status'];
    };
  }

  const [hookFormMethods] = useState(() => {
    let _hookFormMethods = globalFilterStore.getState();

    if (!_hookFormMethods[filterKey]) {
      globalFilterStore.setState({
        ..._hookFormMethods,
        [filterKey]: methods as any,
      });
      _hookFormMethods = globalFilterStore.getState();
    }

    return _hookFormMethods[filterKey];
  });

  return hookFormMethods as UseGlobalFilterStateReturn<TFieldValues, TContext>;
};
