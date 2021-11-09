import styles from './Loading.module.scss'
import { useEffect, useState } from 'react'
import { randomTip } from '../tips'

export default function Loading({error}) {
  const [loadingText, setLoadingText] = useState(null);

  useEffect(() => {
    setLoadingText(randomTip())
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.tip}>{loadingText}</div>
      <div className={styles.subtext}>{error ?? "ładowanie"}</div>
    </div>
  )
}