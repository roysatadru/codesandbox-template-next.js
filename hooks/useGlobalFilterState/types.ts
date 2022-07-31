import { UseQueryResult } from '@tanstack/react-query';
import { WritableDraft } from 'immer/dist/internal';
import { FieldValues, UseFormProps, UseFormReturn } from 'react-hook-form';

export type MiddlewareHookReturnType<
  TFieldValues extends FieldValues = FieldValues,
  MiddlewareType extends 'async' | 'sync' = 'sync',
  MiddlewareOtherReturnType = MiddlewareType extends 'async'
  ? UseQueryResult<TFieldValues>
  : {},
  > = MiddlewareOtherReturnType &
  (MiddlewareType extends 'async'
    ? {
      data: TFieldValues;
      fetchStatus: UseQueryResult['fetchStatus'];
      status: UseQueryResult['status'];
    }
    : {
      data: TFieldValues;
    });

export type UseMiddlewareHook<
  SyncValuesType = unknown,
  TFieldValues extends FieldValues = FieldValues,
  MiddlewareType extends 'async' | 'sync' = 'sync',
  MiddlewareOtherReturnType = MiddlewareType extends 'async'
  ? UseQueryResult<TFieldValues>
  : {},
  > = (
    values: SyncValuesType | undefined,
    previousFilterState: TFieldValues,
  ) => MiddlewareHookReturnType<
    TFieldValues,
    MiddlewareType,
    MiddlewareOtherReturnType
  >;

export type SyncValues<
  SyncValuesType = unknown,
  TFieldValues extends FieldValues = FieldValues,
  MiddlewareType extends 'async' | 'sync' = 'sync',
  MiddlewareOtherReturnType = MiddlewareType extends 'async'
  ? UseQueryResult<TFieldValues>
  : {},
  > = {
    values?: SyncValuesType;
    disableDeepCompare?: boolean;
    stopSync?: boolean;
    middlewareType?: MiddlewareType;
    useMiddleware?: UseMiddlewareHook<
      SyncValuesType,
      TFieldValues,
      MiddlewareType,
      MiddlewareOtherReturnType
    >;
    onChangeFormValueStates?: (values: TFieldValues, draftLocation: WritableDraft<{
      pathname: string;
      hash: string;
      queryParams: {
        [k: string]: string;
      };
    }>) => void;
  };

export type FilterKeyPropType = string;
export type HookFormPropType<
  TFieldValues extends FieldValues = FieldValues,
  TContext = any,
  > = UseFormProps<TFieldValues, TContext>;
export type SyncValuePropType<
  SyncValuesType = unknown,
  TFieldValues extends FieldValues = FieldValues,
  MiddlewareType extends 'async' | 'sync' = 'sync',
  MiddlewareOtherReturnType = MiddlewareType extends 'async'
  ? UseQueryResult<TFieldValues>
  : {},
  > = SyncValues<
    SyncValuesType,
    TFieldValues,
    MiddlewareType,
    MiddlewareOtherReturnType
  >;

export type UseGlobalFilterStateProps<
  TFieldValues extends FieldValues = FieldValues,
  TContext = any,
  SyncValuesType = unknown,
  MiddlewareType extends 'async' | 'sync' = 'sync',
  MiddlewareOtherReturnType = MiddlewareType extends 'async'
  ? UseQueryResult<TFieldValues>
  : {},
  > = [
    FilterKeyPropType,
    HookFormPropType<TFieldValues, TContext>?,
    SyncValuePropType<
      SyncValuesType,
      TFieldValues,
      MiddlewareType,
      MiddlewareOtherReturnType
    >?,
  ];

export type UseGlobalFilterStateReturn<
  TFieldValues extends FieldValues = FieldValues,
  TContext = any
  > = UseFormReturn<TFieldValues, TContext>;
