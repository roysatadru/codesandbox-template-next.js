import { Draft, IProduce, PatchListener } from 'immer/dist/internal';
import { MittEmitter } from 'next/dist/shared/lib/mitt';
import { NextRouter } from 'next/router';

export type RouteEventsHandlers = Parameters<
  MittEmitter<'routeChangeComplete'>['on']
>[1];

export type SearchParamKey = string;

export type UseSelectSearchParamsRouterParams = SearchParamKey[];

export type InferSearchParamKey<T extends SearchParamKey = SearchParamKey> =
  T extends infer V
    ? string extends V
      ? string
      : V extends string
      ? V
      : string
    : string;

export type SearchParamsType<
  T extends UseSelectSearchParamsRouterParams = UseSelectSearchParamsRouterParams,
> = {
  [k in InferSearchParamKey<T[number]>]: string[] | string;
};

export type PartialSearchParamsType<
  T extends UseSelectSearchParamsRouterParams,
> = Partial<SearchParamsType<T>>;

class Nothing {
  private _: any;
}

export type ValidRecipeReturnType<State> =
  | State
  | void
  | undefined
  | (State extends undefined ? Nothing : never);

export type ProduceRecipe<D> = (draft: D) => ValidRecipeReturnType<D>;
export type ProduceRecipeFn<Base> = (
  draft: Draft<Base>,
) => ValidRecipeReturnType<Draft<Base>>;

export type Produce<Base, D = Draft<Base>> = (
  base: Base,
  recipe: ProduceRecipe<D>,
  listener?: PatchListener,
) => Base;

export type UseSelectSearchParamsRouterReturn<T extends string = string> = Pick<
  NextRouter,
  'back' | 'reload' | 'beforePopState' | 'prefetch'
> & {
  searchParams: PartialSearchParamsType<T[]>;
  clearSearchParams: (searchParamsClearProps?: {
    replace?: boolean | undefined;
    keys?: T[] | undefined;
  }) => Promise<boolean>;
  pushSearchParams: (
    recipe:
      | ProduceRecipeFn<SearchParamsType<T[]>>
      | PartialSearchParamsType<T[]>,
  ) => Promise<boolean>;
  replaceSearchParams: (
    recipe:
      | ProduceRecipeFn<SearchParamsType<T[]>>
      | PartialSearchParamsType<T[]>,
  ) => Promise<boolean>;
};
