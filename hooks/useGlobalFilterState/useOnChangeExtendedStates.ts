import { atom, useAtomValue } from 'jotai';
import { selectAtom } from 'jotai/utils';

import { globalFilterStoreAtom } from './globalFilterStateAtom';
import { DefaultOnChangeExtendedStates, FilterKeyPropType } from './types';

export const useOnChangeExtendedStates = <
  OnChangeExtendedStates extends DefaultOnChangeExtendedStates = DefaultOnChangeExtendedStates,
>(
  filterKey: FilterKeyPropType,
) => {
  return useAtomValue(
    useAtomValue(
      selectAtom(globalFilterStoreAtom, s => s?.[filterKey]) ?? atom({}),
    )?.onChangeExtendedStatesAtom,
  ) as OnChangeExtendedStates;
};
