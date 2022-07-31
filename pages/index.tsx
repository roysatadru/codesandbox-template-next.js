import { useQuery } from '@tanstack/react-query'
import produce from 'immer'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { useGlobalFilterState } from '../hooks/useGlobalFilterState'

import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  const { } = useRouter();

  const { watch, getValues } = useGlobalFilterState('cars-filter', {
    defaultValues: {

    }
  })

  const { data, status, fetchStatus } = useQuery(['cars-filter'], async () => {
    const response = await fetch("https://my-json-server.typicode.com/roysatadru/filter-search-param/filterHashKeys?filterKey=dgfhsjdgfh643hdsfafd")
    if (!response.ok) {
      return new Error('Something went wrong')
    }
    return response.json()
  })

  console.log({ data, status, fetchStatus })

  console.log(watch())

  useEffect(() => {
    const lame = {
      a: 'a'
    }

    const newLame = produce(lame, (d) => {
      d.a = 'b'
    })

    console.log(newLame === lame)
  }, [])

  return (
    <div className={styles.container}>
      <form>
        <label htmlFor="cars" className={styles["form-field-label"]}>Choose a car:</label>

        <select name="cars" id="cars">
          <option value="">No option selected</option>
          <option value="volvo">Volvo</option>
          <option value="saab">Saab</option>
          <option value="mercedes">Mercedes</option>
          <option value="audi">Audi</option>
        </select>
      </form>
    </div>
  )
}

export default Home
