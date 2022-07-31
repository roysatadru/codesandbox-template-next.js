import { UseQueryResult } from '@tanstack/react-query';
import { FieldValues, UseFormProps, UseFormReturn } from 'react-hook-form';

export type UseMiddlewareHook<
  SyncValuesType = unknown,
  TFieldValues extends FieldValues = FieldValues,
  UseAsyncMiddlewareOtherReturnType = UseQueryResult<TFieldValues>,
  UseMiddlewareOtherReturnType = {},
  > = (
    values: SyncValuesType | undefined,
    previousFilterState: TFieldValues,
  ) => UseMiddlewareOtherReturnType &
    (
      | (UseAsyncMiddlewareOtherReturnType & {
        middlewareType: 'async';
        data: TFieldValues;
        fetchStatus: UseQueryResult['fetchStatus'];
        status: UseQueryResult['status'];
      })
      | {
        middlewareType?: 'sync';
        data: TFieldValues;
      }
    );

export type SyncValues<
  SyncValuesType = unknown,
  TFieldValues extends FieldValues = FieldValues,
  UseAsyncMiddlewareOtherReturnType = UseQueryResult<TFieldValues>,
  UseMiddlewareOtherReturnType = { [others: string | number]: unknown },
  > = {
    values?: SyncValuesType;
    disableDeepCompare?: boolean;
    stopSync?: boolean;
    useMiddleware?: UseMiddlewareHook<
      SyncValuesType,
      TFieldValues,
      UseAsyncMiddlewareOtherReturnType,
      UseMiddlewareOtherReturnType
    >;
  };

export type UseGlobalFilterStateProps<
  TFieldValues extends FieldValues = FieldValues,
  TContext = any,
  SyncValuesType = unknown,
  UseAsyncMiddlewareOtherReturnType = UseQueryResult<TFieldValues>,
  UseMiddlewareOtherReturnType = { [others: string | number]: unknown },
  > = [
    string,
    UseFormProps<TFieldValues, TContext>?,
    SyncValues<
      SyncValuesType,
      TFieldValues,
      UseAsyncMiddlewareOtherReturnType,
      UseMiddlewareOtherReturnType
    >?,
  ];

export type UseGlobalFilterStateReturn<
  TFieldValues extends FieldValues = FieldValues,
  TContext = any,
  > = UseFormReturn<TFieldValues, TContext>;
