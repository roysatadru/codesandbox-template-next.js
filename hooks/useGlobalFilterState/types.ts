import { UseQueryResult } from '@tanstack/react-query';
import { WritableAtom } from 'jotai';
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

export type SetOnChangeExtendedStates<
  OnChangeExtendedStates extends DefaultOnChangeExtendedStates = DefaultOnChangeExtendedStates,
> = {
  (
    update: OnChangeExtendedStates | ((draft: OnChangeExtendedStates) => void),
  ): void;
};

export type SyncValues<
  SyncValuesType = unknown,
  TFieldValues extends FieldValues = FieldValues,
  MiddlewareType extends 'async' | 'sync' = 'sync',
  MiddlewareOtherReturnType = MiddlewareType extends 'async'
    ? UseQueryResult<TFieldValues>
    : {},
  OnChangeExtendedStates extends DefaultOnChangeExtendedStates = DefaultOnChangeExtendedStates,
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
  onChangeFormValueStates?: (
    values: TFieldValues,
    setOnChangeExtendedStates: SetOnChangeExtendedStates<OnChangeExtendedStates>,
  ) => void | Promise<void>;
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
  OnChangeExtendedStates extends DefaultOnChangeExtendedStates = DefaultOnChangeExtendedStates,
> = SyncValues<
  SyncValuesType,
  TFieldValues,
  MiddlewareType,
  MiddlewareOtherReturnType,
  OnChangeExtendedStates
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

export type DefaultOnChangeExtendedStates<
  Value extends {
    [key: string | number | symbol]: unknown;
  } = {
    [key: string | number | symbol]: unknown;
  },
> = Value;

export type OnChangeExtendedStatesAtom<Value> = WritableAtom<
  Value,
  Value | ((draft: Value) => void),
  void
>;

export type UseOnChangeFilterFormStateProps<
  TFieldValues extends FieldValues = FieldValues,
  OnChangeExtendedStates extends DefaultOnChangeExtendedStates = DefaultOnChangeExtendedStates,
> = {
  (
    filterKey: FilterKeyPropType,
    effect?: (
      fieldPathValues: TFieldValues,
      setOnChangeExtendedStates: SetOnChangeExtendedStates<OnChangeExtendedStates>,
    ) => void,
  ): TFieldValues;
  <TFieldNames extends readonly FieldPath<TFieldValues>[]>(
    filterKey: FilterKeyPropType,
    names: readonly [...TFieldNames],
    defaultValue?: DeepPartial<TFieldValues>,
    effect?: (
      fieldPathValues: FieldPathValues<TFieldValues, TFieldNames>,
      setOnChangeExtendedStates: SetOnChangeExtendedStates<OnChangeExtendedStates>,
    ) => void,
  ): FieldPathValues<TFieldValues, TFieldNames>;
  <TFieldName extends FieldPath<TFieldValues>>(
    filterKey: FilterKeyPropType,
    names: TFieldName,
    defaultValue?: FieldPathValue<TFieldValues, TFieldName>,
    effect?: (
      fieldPathValues: FieldPathValue<TFieldValues, TFieldName>,
      setOnChangeExtendedStates: SetOnChangeExtendedStates<OnChangeExtendedStates>,
    ) => void,
  ): FieldPathValue<TFieldValues, TFieldName>;
};
