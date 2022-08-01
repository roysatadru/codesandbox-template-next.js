import { UseQueryResult } from '@tanstack/react-query';
import { WritableDraft } from 'immer/dist/internal';
import {
  DeepPartial,
  FieldPath,
  FieldPathValue,
  FieldPathValues,
  FieldValues,
  UseFormProps,
  UseFormReturn,
  WatchObserver,
} from 'react-hook-form';
import { Subscription } from 'react-hook-form/dist/utils/createSubject';
import { UseSelectSearchParamsRouterReturn } from '../useSelectSearchParamsRouter';

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
  afterMiddlewareConversion?: (
    params?: Pick<
      UseGlobalFilterStateReturn<TFieldValues, any>,
      | 'clearErrors'
      | 'getFieldState'
      | 'getValues'
      | 'reset'
      | 'resetField'
      | 'setError'
      | 'setFocus'
      | 'setValue'
      | 'trigger'
    > & {
      middlewareReturn: TFieldValues;
    },
  ) => void;
  onChangeFormValueStates?: (values: TFieldValues) => void | Promise<void>;
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
  TContext = any,
> = UseFormReturn<TFieldValues, TContext>;

type UseWatch<TFieldValues extends FieldValues = FieldValues> = {
  <TFieldNames extends readonly FieldPath<TFieldValues>[]>(
    names: readonly [...TFieldNames],
    defaultValue?: DeepPartial<TFieldValues>,
  ): FieldPathValues<TFieldValues, TFieldNames>;
  <TFieldName extends FieldPath<TFieldValues>>(
    name: TFieldName,
    defaultValue?: FieldPathValue<TFieldValues, TFieldName>,
  ): FieldPathValue<TFieldValues, TFieldName>;
  (
    callback: WatchObserver<TFieldValues>,
    defaultValues?: DeepPartial<TFieldValues>,
  ): Subscription;
};

export type UseOnChangeFilterStateRestProps<
  TFieldValues extends FieldValues = FieldValues,
  SearchParamsKeys extends string = string,
> =
  | [
      (
        values: TFieldValues,
        routerSearchParamState: UseSelectSearchParamsRouterReturn<SearchParamsKeys>,
      ) => void,
      SearchParamsKeys[]?,
    ]
  | (TFieldValues extends infer V
      ? V extends TFieldValues
        ? [
            Parameters<UseWatch<V>>,
            (
              values: ReturnType<UseWatch<V>>,
              routerSearchParamState: UseSelectSearchParamsRouterReturn<SearchParamsKeys>,
            ) => void,
            SearchParamsKeys[]?,
          ]
        : [
            (
              values: TFieldValues,
              routerSearchParamState: UseSelectSearchParamsRouterReturn<SearchParamsKeys>,
            ) => void,
            SearchParamsKeys[]?,
          ]
      : [
          (
            values: TFieldValues,
            routerSearchParamState: UseSelectSearchParamsRouterReturn<SearchParamsKeys>,
          ) => void,
          SearchParamsKeys[]?,
        ]);
