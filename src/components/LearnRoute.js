import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { isAnswerCorrect, preloadImage, shuffled } from '../utils'
import styles from './LearnRoute.module.scss'

export default function LearnRoute ({ sectionData }) {
  const { sectionCodeName } = useParams()

  const [toSolve, setToSolve] = useState(null)
  const [solved, setSolved] = useState(null)
  const [isShowingSolution, setIsShowingSolution] = useState(null)
  const [isTextCorrect, setIsTextCorrect] = useState(null)
  const [userAnswer, setUserAnswer] = useState('')

  const userAnswerInput = useRef(null)

  const [current] = toSolve ?? []

  // initialize component when sectionData or URL changes
  useEffect(() => {
    const itemWithSectionName = (section) => (item) => {
      return { ...item, sectionFriendlyName: section.friendlyName }
    }

    const setShuffledToSolve = (arr) => {
      setToSolve(shuffled(arr))
    }

    if (sectionCodeName === 'all') {
      setShuffledToSolve(sectionData.flatMap(
        section => section.items.map(itemWithSectionName(section))))
    } else {
      const section = sectionData.find(
        section => section.codeName === sectionCodeName)
      if (section == null) {
        setToSolve(null)
        setSolved(null)
        return
      }
      setShuffledToSolve(section.items.map(itemWithSectionName(section)))
    }
    setSolved([])
    setIsTextCorrect(null)
  }, [sectionCodeName, sectionData])

  // pre-fetch the next image
  useEffect(() => {
    if (toSolve) {
      const next = toSolve[1]
      if (next) {
        preloadImage(next.imageUrl)
      }
    }
  }, [toSolve])

  const handleGoNext = (event, isSuccess) => {
    if (event) event.preventDefault()
    if (isSuccess) {
      setToSolve(toSolve.slice(1))
      setSolved([...solved, current])
    } else {
      if (toSolve.length > 1) {
        setToSolve([...toSolve.slice(1, 2), current, ...toSolve.slice(2)])
      }
    }
    setIsShowingSolution(false)
    setIsTextCorrect(null)
    setUserAnswer('')
    userAnswerInput.current.focus()
  }
  const handleAmRight = (event) => handleGoNext(event, true)
  const handleAmWrong = (event) => handleGoNext(event, false)

  if (toSolve == null) {
    return (
      <div>
        Nie istnieje taka sekcja, wróć do <Link to="/">strony głównej</Link>
      </div>
    )
  }

  if (current == null) {
    return (
      <div>
        Brawo, zdałxś!!!!!!!! <button
        onClick={() => window.history.go(0)}> Zacznij od nowa</button> bądź
        <Link to="/"> przejdź do menu głównego</Link>, ewentualnie idź spać
      </div>
    )
  }

  const handleShowAnswer = (event) => {
    if (event) event.preventDefault()
    setIsShowingSolution(true)
  }

  const handleSubmitTextAnswer = (event) => {
    event.preventDefault()
    const isCorrect = isAnswerCorrect(current, userAnswer)
    if (userAnswer !== '')
      setIsTextCorrect(isCorrect)
    else
      handleShowAnswer()
    if (isCorrect) {
      if (isTextCorrect) { // if clicked enter again
        handleGoNext(null, true)
      }
      handleShowAnswer()
    }
  }

  const handleAnswerTextChanged = (event) => {
    // hide 'correct' or 'incorrect' when the text input changes
    setIsTextCorrect(null)
    setUserAnswer(event.target.value)
  }

  return (
    <div>
      <div className={styles.learnGrid}>
        <div className={styles.questContainer}>
          <img src={current.imageUrl} alt="tutaj powinien być obrazek z pytaniem"/>
        </div>
        {isShowingSolution ?
          <div className={styles.answerContainer}>
            {current.names.map(name =>
              <div key={name} className={styles.answerOption}>{name}</div>
            )}
          </div> :
          ''}
        <div className={styles.inputContainer}>
          <div className={styles.inputUpper}>
            <div className={styles.inputUpperUpper}>
              {isShowingSolution ?
                <>
                  <button onClick={handleAmRight}>Wiem</button>
                  <button onClick={handleAmWrong}>Nie wiem</button>
                </> :
                <>
                  <button onClick={handleShowAnswer}>Pokaż odpowiedź</button>
                </>
              }

              <form className={styles.answerForm}
                    onSubmit={handleSubmitTextAnswer} autoComplete="off">
                <input ref={userAnswerInput} type="text" name="answer"
                       className={styles.input} onChange={handleAnswerTextChanged}
                       value={userAnswer} autoComplete="off"/>
                <button type="submit">Sprawdź</button>
              </form>
            </div>
            <div>
              {isTextCorrect === true ? <span
                className={styles.good}>dobrze</span> : ''}
              {isTextCorrect === false
                ? <span className={styles.bad}>źle</span>
                : ''}
            </div>
          </div>
          <div>
            <div>
              wiesz: {solved.length} | nie wiesz: {toSolve.length}
            </div>
            <div>
              <progress id="file" max={solved.length + toSolve.length}
                        value={solved.length}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
