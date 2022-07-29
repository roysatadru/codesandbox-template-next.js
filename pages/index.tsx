import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'

import styles from '../styles/Home.module.css'

const filterConfig = {
    
}

const Home: NextPage = () => {
    const {  } = useRouter();
    const { control, watch } = useForm({
        defaultValues: {
            
        }
    })
    
  return (
    <div className={styles.container}>
        <form>
        Hello world
        </form>
    </div>
  )
}

export default Home
