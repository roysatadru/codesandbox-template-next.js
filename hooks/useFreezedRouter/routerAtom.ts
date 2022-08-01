import { atom, useAtomValue, useSetAtom } from 'jotai';
import { NextRouter } from 'next/router';

const routerAtom = atom({} as Partial<NextRouter>);

export const useRouterInstance = () => {
  return useAtomValue(routerAtom);
};

export const useSetRouterInstance = () => {
  return useSetAtom(routerAtom);
};
