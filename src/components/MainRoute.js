import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { preloadImage } from '../utils'
import styles from './MainRoute.module.scss'
import { randomTip } from '../tips'

export default function MainRoute ({ sectionData }) {
  const [isPreloadDone, setIsPreloadDone] = useState(null)
  const [tip, setTip] = useState(null)

  const handlePreloadImages = (event) => {
    event.preventDefault()
    setIsPreloadDone(false)

    const imageUrls = sectionData.flatMap(
      section => section.items.map(item => item.imageUrl))
    Promise.all(imageUrls.map(x => preloadImage(x))).then(() => {
      setIsPreloadDone(true)
    })
  }

  useEffect(() => {
    setTip(randomTip())
  }, [])

  return (
    <div className={styles.body}>
      <nav className={styles.navbar}>
        <h1 className={styles.title}>Point Game</h1>
      </nav>
      <div className={styles.tipBar}>
        <div className={styles.tipBarContent}>protip — {tip}</div>
      </div>
      <div className={styles.mainContainer}>
        <main className={styles.main}>
          <Link to="/train/all" className={styles.sectionLink}>
            <span className={styles.sectionLinkText}>Wszystkie działy</span>
          </Link>
          {sectionData ? sectionData.map(section =>
            <Link key={section.codeName} className={styles.sectionLink}
                  to={`/train/${section.codeName}`}>
              <span
                className={styles.sectionLinkText}>{section.friendlyName}</span>
            </Link>,
          ) : ''}
          <section className={styles.optimize}>
            <div>Jeśli nie szkoda ci internetu to dla płynniejszego działania
              aplikacji możesz na zapas pobrać z góry wszystkie
              zdjęcia do pamięci podręcznej
            </div>
            <button className={styles.optimizeButton}
                    onClick={handlePreloadImages}>
              Wczytaj obrazki
            </button>
            {isPreloadDone === false ? <div>Wczytywanie obrazków...</div> : ''}
            {isPreloadDone === true ? <div>Obrazki wczytane</div> : ''}
          </section>
        </main>
      </div>
      <footer className={styles.footer}>
        <div>Copyright Nicofisi 2021 | Wersja 2.5.0</div>
      </footer>
    </div>
  )
}
