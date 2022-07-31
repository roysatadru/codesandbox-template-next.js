import { UseQueryResult } from '@tanstack/react-query';
import { selectAtom, useAtomValue } from 'jotai/utils';
import { FieldValues } from 'react-hook-form';

import { globalFilterStoreAtom } from './globalFilterStateAtom';
import { FilterKeyPropType, MiddlewareHookReturnType } from './types';

export const useMiddlewareResult = <
  TFieldValues extends FieldValues = FieldValues,
  MiddlewareType extends 'async' | 'sync' = 'sync',
  MiddlewareOtherReturnType = MiddlewareType extends 'async'
    ? UseQueryResult<TFieldValues>
    : {},
>(
  filterKey: FilterKeyPropType,
) => {
  return useAtomValue(
    useAtomValue(selectAtom(globalFilterStoreAtom, s => s?.[filterKey]))
      ?.middlewareReturnAtom,
  ) as MiddlewareHookReturnType<
    TFieldValues,
    MiddlewareType,
    MiddlewareOtherReturnType
  >;
};
