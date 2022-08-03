import { useQuery } from '@tanstack/react-query';
import type { NextPage } from 'next';
import { useEffect } from 'react';
import { EditUrlParams } from '../components/organisms/EditUrlParams';

import { useGlobalFilterState } from '../hooks/useGlobalFilterState';
import { useSelectSearchParamsRouter } from '../hooks/useSelectSearchParamsRouter';

import styles from '../styles/Home.module.css';

const OPTIONS = [
  { id: 'volvo', optionLabel: 'Volvo' },
  { id: 'saab', optionLabel: 'Saab' },
  { id: 'mercedes', optionLabel: 'Mercedes' },
  { id: 'audi', optionLabel: 'Audi' },
];

const Home: NextPage = () => {
  const { watch, getValues } = useGlobalFilterState('cars-filter', {
    defaultValues: {},
  });

  const { searchParams, clearSearchParams, pushSearchParams } =
    useSelectSearchParamsRouter(['car-value']);
  const { pushSearchParams: pushDummy, clearSearchParams: clearAll } =
    useSelectSearchParamsRouter();

  useEffect(() => {
    console.log('query', searchParams);
  }, [searchParams]);

  const { data, status, fetchStatus } = useQuery(['cars-filter'], async () => {
    const response = await fetch(
      'https://my-json-server.typicode.com/roysatadru/filter-search-param/filterHashKeys?filterKey=dgfhsjdgfh643hdsfafd',
    );
    if (!response.ok) {
      return new Error('Something went wrong');
    }
    return response.json();
  });

  return (
    <div className={styles.container}>
      <form>
        <label htmlFor="cars" className={styles['form-field-label']}>
          Choose a car:
        </label>

        <select name="cars" id="cars">
          <option value="">No option selected</option>
          {OPTIONS.map(({ id, optionLabel }) => (
            <option key={id} value={id}>
              {optionLabel}
            </option>
          ))}
        </select>
      </form>

      {/* {OPTIONS.map(({ id, optionLabel }) => (
        <button
          key={id}
          onClick={() => {
            pushSearchParams(prevSearchParams => {
              prevSearchParams['car-value'] = id;
            });
          }}
        >
          Go to {optionLabel}
        </button>
      ))} */}
      <button
        onClick={() => {
          pushSearchParams({
            'car-value': searchParams['car-value'],
          });
        }}
      >
        Go to dummy param change
      </button>
      <button
        onClick={() => {
          pushDummy({
            'dummy-cart': 'dummy-value',
            'car-value': searchParams['car-value'],
          });
        }}
      >
        Go to dummy cart
      </button>
      <button
        onClick={() => {
          // clearSearchParams();
          clearAll();
        }}
      >
        Clear All
      </button>

      <EditUrlParams />
    </div>
  );
};

export default Home;
