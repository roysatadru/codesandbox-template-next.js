import { useMemo } from 'react';

import { UseRouterMethodsReturn } from './types';
import { useFreezedRouter } from './useFreezedRouter';

export const useRouterMethods = () => {
  const routerInstance = useFreezedRouter();

  const routerMethods = useMemo(() => {
    return Object.fromEntries(
      Object.entries(routerInstance).filter(
        ([key, value]) => typeof value === 'function' || key === 'events',
      ),
    );
  }, [routerInstance]);

  return routerMethods as UseRouterMethodsReturn;
};
