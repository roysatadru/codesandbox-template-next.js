import { useAtomValue, useSetAtom } from 'jotai'
import { withImmer } from 'jotai/immer'
import { atomWithStore } from 'jotai/zustand'
import create from 'zustand/vanilla'
import { UseGlobalFilterStateReturn } from './types';

const emptyFilterState = Object.freeze({});
export const globalFilterStore = create(() => ({} as Record<string, UseGlobalFilterStateReturn>));
export const globalFilterStoreAtom = atomWithStore(globalFilterStore)
export const globalFilterStoreAtomWithImmer = withImmer(globalFilterStoreAtom)

export const useGetGlobalFilterState = () => {
  return useAtomValue(globalFilterStoreAtomWithImmer)
}

export const useSetGlobalFilterState = () => {
  return useSetAtom(globalFilterStoreAtomWithImmer)
}

export const getGlobalFilterState = (globalFilterKey: string) => {
  return globalFilterStore.getState()?.[globalFilterKey] ?? emptyFilterState
}
