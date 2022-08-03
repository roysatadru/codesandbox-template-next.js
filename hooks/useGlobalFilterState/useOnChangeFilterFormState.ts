import { atom, useSetAtom } from 'jotai';
import { selectAtom, useAtomValue } from 'jotai/utils';
import { useEffect, useRef } from 'react';
import { globalFilterStoreAtom } from './globalFilterStateAtom';
import { UseOnChangeFilterFormStateProps } from './types';
import { useGlobalFilterStateSelector } from './useGlobalFilterStateSelector';

export const useOnChangeFilterFormState: UseOnChangeFilterFormStateProps = (
  ...props: any[]
) => {
  const [filterKey] = props;
  const fnIndex = props.findIndex(p => typeof p === 'function');
  const watchObserver = props.slice(1, fnIndex === -1 ? props.length : fnIndex);
  const effectRef = useRef(props[fnIndex]);
  effectRef.current = props[fnIndex];

  const firstTimeRef = useRef(true);

  const { watch } = useGlobalFilterStateSelector(filterKey);
  const watchedValues = watch(watchObserver);
  const setOnChangeExtendedStates = useSetAtom(
    useAtomValue(
      selectAtom(globalFilterStoreAtom, s => s?.[filterKey]) ?? atom({}),
    )?.onChangeExtendedStatesAtom,
  );

  useEffect(() => {
    if (firstTimeRef.current) {
      return () => {
        firstTimeRef.current = false;
      };
    }

    effectRef.current?.(watchedValues, setOnChangeExtendedStates);
    return;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedValues]);

  return watchedValues;
};
