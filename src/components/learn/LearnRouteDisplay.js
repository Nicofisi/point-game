import styles from './LearnRouteDisplay.module.scss';
import SettingsModal from './SettingsModal';
import {useState} from 'react';
import useSetting from '../../useSetting';

export default function LearnRouteDisplay({
  handleAnswerTextChanged,
  handleSubmitTextAnswer,
  handleGoNext,
  handleShowAnswer,
  isShowingSolution,
  isTextCorrect,
  userAnswerInput,
  solved,
  toSolve,
  userAnswer,
  current,
}) {
  const handleAmRight = (event) => handleGoNext(event, true);
  const handleAmWrong = (event) => handleGoNext(event, false);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [showAnswerOverImage, setShowAnswerOverImage, refreshAnswerOverImage] = useSetting(
      'show-answer-over-image', false,
  );

  const handleSettingsClose = () => {
    refreshAnswerOverImage();
    setIsSettingsOpen(false);
  };

  const handleOpenSettings = () => {
    setIsSettingsOpen(true);
  };

  const answers = isShowingSolution ?
      current.names.map(name =>
          <div key={name} className={styles.answerOption}>{name}</div>,
      ) : '';

  return (
      <div>
        <div className={styles.learnGrid}>
          <div className={styles.questContainer}>
            <img src={current.imageUrl}
                 alt="tutaj powinien być obrazek z pytaniem"/>
            {(isShowingSolution && showAnswerOverImage) ?
                <div className={styles.answerOverQuest}>
                  {answers}
                </div> : ''
            }
          </div>
          {isShowingSolution ?
              <div className={styles.answerContainer}>
                {answers}
              </div> : ''
          }
          <div className={styles.inputContainer}>
            <div className={styles.inputUpper}>
              <div className={styles.inputUpperUpper}>
                {isShowingSolution ?
                    <>
                      <button onClick={handleAmRight}>Wiem</button>
                      <button onClick={handleAmWrong}>Nie wiem</button>
                    </> :
                    <>
                      <button onClick={handleShowAnswer}>Pokaż odpowiedź
                      </button>
                    </>
                }

                <form className={styles.answerForm}
                      onSubmit={handleSubmitTextAnswer} autoComplete="off">
                  <input ref={userAnswerInput} type="text" name="answer"
                         className={styles.input}
                         onChange={handleAnswerTextChanged}
                         value={userAnswer} autoComplete="off"/>
                  <button type="submit">Sprawdź</button>
                </form>
              </div>
              <div>
                {isTextCorrect === true
                    ? <span className={styles.good}>dobrze</span>
                    : ''}
                {isTextCorrect === false
                    ? <span className={styles.bad}>źle</span>
                    : ''
                }
              </div>
            </div>
            <div>
              <div>
                <button onClick={handleOpenSettings}>Ustawienia</button>
              </div>
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
        {isSettingsOpen
            ? <SettingsModal handleClose={handleSettingsClose}/>
            : ''}
      </div>
  );
}