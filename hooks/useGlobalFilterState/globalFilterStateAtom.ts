import { PrimitiveAtom } from 'jotai';
import { atomWithStore } from 'jotai/zustand';
import create from 'zustand/vanilla';

import { MiddlewareHookReturnType, UseGlobalFilterStateReturn } from './types';

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
      };
    }),
);
export const globalFilterStoreAtom = atomWithStore(globalFilterStore);
