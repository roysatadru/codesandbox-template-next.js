import { PrimitiveAtom } from 'jotai';
import { atomWithStore } from 'jotai/zustand';
import create from 'zustand/vanilla';

import {
  DefaultOnChangeExtendedStates,
  MiddlewareHookReturnType,
  OnChangeExtendedStatesAtom,
  UseGlobalFilterStateReturn,
} from './types';

export const globalFilterStore = create(
  () =>
    ({} as {
      [a: string]: {
        methods: PrimitiveAtom<UseGlobalFilterStateReturn> & {
          init: UseGlobalFilterStateReturn;
        };
        middlewareReturnAtom: PrimitiveAtom<MiddlewareHookReturnType> & {
          init: UseGlobalFilterStateReturn;
        };
        onChangeExtendedStatesAtom: OnChangeExtendedStatesAtom<DefaultOnChangeExtendedStates>;
      };
    }),
);
export const globalFilterStoreAtom = atomWithStore(globalFilterStore);
