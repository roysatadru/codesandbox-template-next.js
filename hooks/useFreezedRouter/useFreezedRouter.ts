import router, { makePublicRouterInstance, Router } from 'next/router';
import { useEffect, useMemo } from 'react';

import { useRouterInstance, useSetRouterInstance } from './routerAtom';
import { UseFreezedRouterReturn } from './types';

export const useFreezedRouter = () => {
  const routerInstance = useRouterInstance();
  const setRouterInstance = useSetRouterInstance();

  useEffect(() => {
    if (!Object.entries(routerInstance).length) {
      setRouterInstance(makePublicRouterInstance(router.router as Router));
    }
  }, [routerInstance, setRouterInstance]);

  return useMemo(() => {
    return {
      ...routerInstance,
      getCurrentNextRouter: () =>
        makePublicRouterInstance(router.router as Router),
    };
  }, [routerInstance]) as UseFreezedRouterReturn;
};
