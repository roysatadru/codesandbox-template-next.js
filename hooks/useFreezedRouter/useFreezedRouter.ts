import router from 'next/router';
import { useEffect, useMemo } from 'react';

import { useRouterInstance, useSetRouterInstance } from './routerAtom';
import { UseFreezedRouterReturn } from './types';

export const useFreezedRouter = () => {
  const routerInstance = useRouterInstance();
  const setRouterInstance = useSetRouterInstance();

  useEffect(() => {
    if (!Object.entries(routerInstance).length) {
      setRouterInstance(router);
    }
  }, [routerInstance, setRouterInstance]);

  return useMemo(() => {
    return {
      ...routerInstance,
      getCurrentNextRouter: () =>
        router,
    };
  }, [routerInstance]) as UseFreezedRouterReturn;
};
