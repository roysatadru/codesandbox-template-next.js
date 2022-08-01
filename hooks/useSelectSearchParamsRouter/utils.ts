import produce, { Draft } from 'immer';
import { isEqual } from 'lodash-es';
import { NextRouter } from 'next/router';

import { SearchParamsType, ValidRecipeReturnType } from './types';

export const generateSearchParams = (
  url: URL | string | SearchParamsType<string[]>,
  options?: { select?: string[] },
) => {
  const { select } = {
    ...(options ?? {}),
  };

  const selectedParams = Array.from(new Set(select ?? []));

  if (
    typeof url !== 'string' &&
    !(url instanceof URL) &&
    typeof url === 'object'
  ) {
    if (!selectedParams.length) {
      return url;
    }
    return produce(url, draftState => {
      Object.keys(draftState).forEach(key => {
        if (!selectedParams.includes(key)) {
          delete draftState[key];
        }
      });
    });
  }

  const { searchParams: urlSearchParams } =
    url instanceof URL
      ? url
      : new URL(
          url.startsWith('http')
            ? url
            : window.location.origin + (url.startsWith('/') ? '' : '/') + url,
        );

  return Object.fromEntries(
    produce(Array.from(urlSearchParams.entries()), draftState => {
      if (selectedParams.length) {
        return draftState.filter(([key]) => selectedParams.includes(key));
      }
    }),
  );
};

export const isQueryParamsValueEqual = (...args: (string | string[])[]) => {
  let [first, ...rest] = args;

  if (typeof first === 'string') {
    for (const arg of rest) {
      if (first === arg) {
        continue;
      }

      return false;
    }
  } else {
    const firstSortedArray = first.sort();

    for (const arg of rest) {
      if (first === arg) {
        continue;
      }

      if (typeof arg === 'string') {
        return false;
      }

      const argSortedArray = arg.sort();
      if (isEqual(firstSortedArray, argSortedArray)) {
        continue;
      }

      return false;
    }
  }

  return true;
};

export const replaceQueryParams = <T extends string = string>(
  watchedQueryParams: T[] = [],
) => {
  return (
    presentRouteParams: SearchParamsType,
    recipe?: (
      draft: Draft<SearchParamsType<T[]>>,
      clearParams: (params?: T[]) => void,
    ) => ValidRecipeReturnType<Draft<SearchParamsType<T[]>>>,
  ) => {
    const _watchQueryParams = Array.from(new Set(watchedQueryParams));
    const allExceptWatched = produce(presentRouteParams, draftState => {
      _watchQueryParams.forEach(key => {
        delete draftState[key];
      });
    });

    const generateNewSearchParams = produce((draft: any) => {
      const clearParams = produce((_dS: any, params?: string[]) => {
        (params && params.length
          ? params
          : _watchQueryParams.length
          ? _watchQueryParams
          : [...Object.keys(_dS)]
        ).forEach(key => {
          delete _dS[key];
        });
      }).bind(null, draft);

      if (recipe) {
        return produce(recipe)(draft, clearParams);
      }
    });

    return {
      ...(_watchQueryParams.length ? allExceptWatched : {}),
      ...generateNewSearchParams(
        !_watchQueryParams.length ? allExceptWatched : {},
      ),
    } as SearchParamsType<T[]> & SearchParamsType;
  };
};

export const convertToSearchString = (searchParams: SearchParamsType) => {
  return Object.entries(searchParams).reduce(
    (acc, [key, value], index) =>
      `${acc}${index === 0 ? '?' : '&'}${key}=${value}`,
    '',
  );
};

export const getCommonsRouteProps = (prop: NextRouter) => {
  return {
    pathname: prop.asPath.split('?')[0],
    hash: prop.asPath.split('#')?.[1] ? `#${prop.asPath.split('#')[1]}` : '',
  };
};
