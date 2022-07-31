import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { UseQueryResult } from '@tanstack/react-query';
import { FieldValues, Path, useForm } from 'react-hook-form';
import { isEqual } from 'lodash-es';

import { globalFilterStore } from './globalFilterStateAtom';
import {
  FilterKeyPropType,
  HookFormPropType,
  SyncValuePropType,
  UseGlobalFilterStateReturn,
} from './types';

export const useGlobalFilterState = <
  TFieldValues extends FieldValues = FieldValues,
  TContext = any,
  SyncValuesType = unknown,
  MiddlewareType extends 'async' | 'sync' = 'sync',
  MiddlewareOtherReturnType = MiddlewareType extends 'async'
    ? UseQueryResult<TFieldValues>
    : {},
>(
  filterKey: FilterKeyPropType,
  hookFormProps: HookFormPropType<TFieldValues, TContext> = {},
  syncValueProps: SyncValuePropType<
    SyncValuesType,
    TFieldValues,
    MiddlewareType,
    MiddlewareOtherReturnType
  > = {},
) => {
  const {
    values: notMemoizedValues,
    disableDeepCompare = false,
    stopSync = false,
    useMiddleware,
    middlewareType = 'sync',
  } = syncValueProps;

  const reactQueryFormKey = `$$$$${filterKey}-form$$$$`;

  const methods = useForm<TFieldValues, TContext>(hookFormProps);

  const { getValues, setValue, watch } = methods;

  const setAllValues = useCallback((values: FieldValues) => {
    Object.keys(values).forEach(key => {
      setValue(key as Path<TFieldValues>, values[key]);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const { data: convertedData, ...restMiddlewareResult } = useMiddleware?.(
    memoizedValues.value,
    memoizedValues.prevFormValues,
  ) ?? {
    data: memoizedValues.value as TFieldValues,
  };

  const memoizedConvertedDataRef = useRef(convertedData);
  const memoizedConvertedData = useMemo(() => {
    if (isEqual(memoizedConvertedDataRef.current, convertedData)) {
      return memoizedConvertedDataRef.current;
    }
    memoizedConvertedDataRef.current = convertedData;
    return memoizedConvertedDataRef.current;
  }, [convertedData]);

  const memoizedMiddlewareResultRef = useRef({
    data: memoizedConvertedData,
    ...restMiddlewareResult,
  });
  const memoizedMiddlewareResult = useMemo(() => {
    if (
      memoizedMiddlewareResultRef.current.data === memoizedConvertedData &&
      Object.keys(restMiddlewareResult).length ===
        Object.keys(memoizedMiddlewareResultRef.current).length - 1 &&
      Object.entries(restMiddlewareResult).every(
        ([key, value]) =>
          value === (memoizedMiddlewareResultRef.current as any)?.[key as any],
      )
    ) {
      return memoizedMiddlewareResultRef.current;
    }

    memoizedMiddlewareResultRef.current = {
      data: memoizedConvertedData,
      ...restMiddlewareResult,
    };
  }, [memoizedConvertedData, restMiddlewareResult]);

  let { fetchStatus, status } = {
    fetchStatus: 'fetching' as UseQueryResult['fetchStatus'],
    status: 'loading' as UseQueryResult['status'],
  };

  if (restMiddlewareResult.hasOwnProperty('fetchStatus')) {
    const networkStatus = restMiddlewareResult as unknown as {
      fetchStatus: UseQueryResult['fetchStatus'];
      status: UseQueryResult['status'];
    };
    fetchStatus = networkStatus.fetchStatus;
    status = networkStatus.status;
  }

  useEffect(() => {
    setValue(reactQueryFormKey as any, memoizedMiddlewareResult as any, {
      shouldValidate: false,
      shouldDirty: false,
      shouldTouch: false,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memoizedMiddlewareResult]);

  useEffect(() => {
    if (middlewareType === 'sync') {
      setAllValues(memoizedConvertedData);
    } else if (fetchStatus === 'idle' && status === 'success') {
      setAllValues(memoizedConvertedData);
    }
  }, [
    memoizedConvertedData,
    fetchStatus,
    middlewareType,
    setAllValues,
    status,
  ]);

  const [hookFormMethods] = useState(() => {
    let _hookFormMethods = globalFilterStore.getState();

    if (!_hookFormMethods[filterKey]) {
      globalFilterStore.setState({
        ..._hookFormMethods,
        [filterKey]: {
          ...methods,
          watchMiddlewareReturnValues: () => watch(reactQueryFormKey as any),
        } as any,
      });
      _hookFormMethods = globalFilterStore.getState();
    }

    return _hookFormMethods[filterKey];
  });

  return hookFormMethods as UseGlobalFilterStateReturn<
    TFieldValues,
    TContext,
    MiddlewareType,
    MiddlewareOtherReturnType
  >;
};
