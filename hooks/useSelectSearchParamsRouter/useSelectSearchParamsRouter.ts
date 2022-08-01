import produce, { Draft, Immutable } from 'immer';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useFreezedRouter } from '../useFreezedRouter';
import {
  PartialSearchParamsType,
  ProduceRecipeFn,
  RouteEventsHandlers,
  SearchParamsType,
  UseSelectSearchParamsRouterReturn,
} from './types';
import {
  convertToSearchString,
  generateSearchParams,
  getCommonsRouteProps,
  isQueryParamsValueEqual,
  replaceQueryParams,
} from './utils';

export const useSelectSearchParamsRouter = <T extends string>(
  watchSearchParamKeys?: T[],
) => {
  const {
    events,
    push,
    replace,
    back,
    reload,
    beforePopState,
    prefetch,
    getCurrentNextRouter,
  } = useFreezedRouter();

  const [searchParams, setSearchParams] = useState<SearchParamsType<string[]>>(
    {},
  );

  const previousSearchParams = useRef<SearchParamsType<string[]>>({});
  const watchSearchParamKeysRef = useRef(watchSearchParamKeys ?? []);
  watchSearchParamKeysRef.current = watchSearchParamKeys ?? [];

  useEffect(() => {
    if (events) {
      const handleRouteChange: RouteEventsHandlers = url => {
        const _searchParams = generateSearchParams(url, {
          select: watchSearchParamKeysRef.current,
        });

        const newWatchSearchParamKeys = produce(
          previousSearchParams.current,
          draftState => {
            if (
              Object.keys(_searchParams).length !==
              Object.keys(draftState).length
            ) {
              return _searchParams;
            }

            let hasUndefinedKey = false;
            let hasChanged = false;
            let tempObj = { ...draftState };

            Object.keys(tempObj).forEach(key => {
              if (!_searchParams.hasOwnProperty(key)) {
                hasChanged = true;
                hasUndefinedKey = true;
                tempObj[key] = undefined as any;
              } else if (
                !isQueryParamsValueEqual(tempObj[key], _searchParams[key])
              ) {
                hasChanged = true;
                tempObj[key] = _searchParams[key];
              }
            });

            if (hasUndefinedKey) {
              tempObj = Object.fromEntries(
                Object.entries(tempObj).filter(([, value]) => !!value),
              );
            }

            if (
              Object.keys(_searchParams).length !== Object.keys(tempObj).length
            ) {
              return _searchParams;
            }

            if (hasChanged) {
              return tempObj;
            }
          },
        );

        if (newWatchSearchParamKeys !== previousSearchParams.current) {
          previousSearchParams.current = newWatchSearchParamKeys;
          setSearchParams({ ...newWatchSearchParamKeys });
        }
      };

      events.on('routeChangeComplete', handleRouteChange);

      return () => {
        events.off('routeChangeComplete', handleRouteChange);
      };
    }
  }, [events, getCurrentNextRouter]);

  const generateNewRoute = useCallback(
    (
      recipe:
        | ProduceRecipeFn<SearchParamsType<T[]>>
        | PartialSearchParamsType<T[]>,
    ) => {
      const _rest = getCurrentNextRouter();

      let updatedParams = {} as SearchParamsType<T[]>;

      if (typeof recipe === 'function') {
        const presentSelectedSearchParams = generateSearchParams(_rest.asPath, {
          select: watchSearchParamKeysRef.current,
        });

        updatedParams = produce(recipe)(
          presentSelectedSearchParams as Immutable<
            Draft<SearchParamsType<T[]>>
          >,
        ) as any;
      } else {
        updatedParams = recipe as any;
      }

      return {
        ...getCommonsRouteProps(_rest),
        search: convertToSearchString(
          replaceQueryParams(watchSearchParamKeysRef.current)(
            generateSearchParams(_rest.asPath),
            () => {
              return updatedParams as any;
            },
          ),
        ),
      };
    },
    [getCurrentNextRouter],
  );

  return useMemo(
    () =>
      ({
        pushSearchParams(
          recipe:
            | ProduceRecipeFn<SearchParamsType<T[]>>
            | PartialSearchParamsType<T[]>,
        ) {
          return push(generateNewRoute(recipe));
        },
        replaceSearchParams(
          recipe:
            | ProduceRecipeFn<SearchParamsType<T[]>>
            | PartialSearchParamsType<T[]>,
        ) {
          return replace(generateNewRoute(recipe));
        },
        clearSearchParams(
          searchParamsClearProps: { replace?: boolean; keys?: T[] } = {},
        ) {
          const { replace: routeReplace, keys: clearKeys } =
            searchParamsClearProps;
          const _rest = getCurrentNextRouter();

          const newRoute = {
            ...getCommonsRouteProps(_rest),
            search: convertToSearchString(
              replaceQueryParams(watchSearchParamKeysRef.current)(
                generateSearchParams(_rest.asPath),
                (_, clearParams) => {
                  return clearParams(clearKeys);
                },
              ),
            ),
          };

          if (routeReplace) {
            return replace(newRoute);
          }

          return push(newRoute);
        },
        back,
        reload,
        beforePopState,
        prefetch,
        searchParams: searchParams as PartialSearchParamsType<T[]>,
      } as UseSelectSearchParamsRouterReturn<T>),
    [
      back,
      beforePopState,
      generateNewRoute,
      getCurrentNextRouter,
      prefetch,
      push,
      reload,
      replace,
      searchParams,
    ],
  );
};
