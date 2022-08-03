import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { UseQueryResult } from '@tanstack/react-query';
import { FieldValues, useForm } from 'react-hook-form';
import { isEqual } from 'lodash-es';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { atomWithImmer } from 'jotai/immer';

import { globalFilterStore } from './globalFilterStateAtom';
import {
  DefaultOnChangeExtendedStates,
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
  OnChangeExtendedStates extends DefaultOnChangeExtendedStates = DefaultOnChangeExtendedStates,
>(
  filterKey: FilterKeyPropType,
  hookFormProps: HookFormPropType<TFieldValues, TContext> = {},
  syncValueProps: SyncValuePropType<
    SyncValuesType,
    TFieldValues,
    MiddlewareType,
    MiddlewareOtherReturnType,
    OnChangeExtendedStates
  > = {},
) => {
  const {
    values: notMemoizedValues,
    disableDeepCompare = false,
    stopSync = false,
    useMiddleware,
    middlewareType = 'sync',
    onChangeFormValueStates,
    afterMiddlewareConversion,
  } = syncValueProps;

  const memoizedOnChangeFormValueStatesRef = useRef(onChangeFormValueStates);
  const afterMiddlewareConversionRef = useRef(afterMiddlewareConversion);
  memoizedOnChangeFormValueStatesRef.current = onChangeFormValueStates;
  afterMiddlewareConversionRef.current = afterMiddlewareConversion;

  const methods = useForm<TFieldValues, TContext>(
    hookFormProps,
  ) as UseGlobalFilterStateReturn<TFieldValues, TContext>;

  const { getValues, reset: resetFormFields, watch } = methods;

  const watchedValues =
    typeof memoizedOnChangeFormValueStatesRef.current === 'function' && watch();

  const setAllValues = useCallback((values: TFieldValues) => {
    if (typeof afterMiddlewareConversionRef.current === 'function') {
      const {
        clearErrors,
        getFieldState,
        getValues,
        reset,
        resetField,
        setError,
        setFocus,
        setValue,
        trigger,
      } = methods;
      afterMiddlewareConversionRef.current({
        middlewareReturn: values,
        clearErrors,
        getFieldState,
        getValues,
        reset,
        resetField,
        setError,
        setFocus,
        setValue,
        trigger,
      });
    } else {
      resetFormFields(values);
    }
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
    return memoizedMiddlewareResultRef.current;
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
        ...(_hookFormMethods as any),
        [filterKey]: {
          methods: atom(methods),
          middlewareReturnAtom: atom(memoizedMiddlewareResult),
          onChangeExtendedStatesAtom: atomWithImmer<OnChangeExtendedStates>(
            {} as any,
          ),
        },
      });
      _hookFormMethods = globalFilterStore.getState();
    }

    return _hookFormMethods[filterKey];
  });

  const setHookFormMethods = useSetAtom(hookFormMethods.methods);
  const formMethods = useAtomValue(hookFormMethods.methods);

  const setGlobalMiddlewareResult = useSetAtom(
    hookFormMethods.middlewareReturnAtom,
  );

  const setOnChangeExtendedStates = useSetAtom(
    hookFormMethods.onChangeExtendedStatesAtom,
  );

  useEffect(() => {
    if (watchedValues !== false) {
      memoizedOnChangeFormValueStatesRef.current?.(
        watchedValues,
        setOnChangeExtendedStates as any,
      );
    }
  }, [setOnChangeExtendedStates, watchedValues]);

  useEffect(() => {
    setGlobalMiddlewareResult(memoizedMiddlewareResult);
  }, [memoizedMiddlewareResult, setGlobalMiddlewareResult]);

  useEffect(() => {
    setHookFormMethods(methods as any);
  }, [methods, setHookFormMethods]);

  return formMethods as UseGlobalFilterStateReturn<TFieldValues, TContext>;
};
