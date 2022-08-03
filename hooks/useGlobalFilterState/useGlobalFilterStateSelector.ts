import { atom, useAtomValue } from 'jotai';
import { selectAtom } from 'jotai/utils';
import { FieldValues } from 'react-hook-form';

import { globalFilterStoreAtom } from './globalFilterStateAtom';
import { FilterKeyPropType, UseGlobalFilterStateReturn } from './types';

export const useGlobalFilterStateSelector = <
  TFieldValues extends FieldValues = FieldValues,
  TContext = any,
>(
  filterKey: FilterKeyPropType,
) => {
  return useAtomValue(
    useAtomValue(
      selectAtom(globalFilterStoreAtom, s => s?.[filterKey]) ?? atom({}),
    )?.methods ?? atom({}),
  ) as UseGlobalFilterStateReturn<TFieldValues, TContext>;
};
