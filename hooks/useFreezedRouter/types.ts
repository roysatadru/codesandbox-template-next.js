import { NextRouter, Router } from 'next/router';

type MethodParams =
  | 'push'
  | 'replace'
  | 'reload'
  | 'back'
  | 'prefetch'
  | 'beforePopState'
  | 'events';

export type UseFreezedRouterReturn = NextRouter & {
  getCurrentNextRouter: () => NextRouter;
};
export type UseRouterMethodsReturn = Pick<UseFreezedRouterReturn, MethodParams>;
