import useSetting from '../../useSetting';
import styles from './SettingsModal.module.scss';
import {useRef} from 'react';

export default function SettingsModal({handleClose}) {
  const background = useRef();
  const [showAnswerOverImage, setShowAnswerOverImage] = useSetting(
      'show-answer-over-image', false,
  );

  console.log('XD', showAnswerOverImage);

  const handleChangeShowAnswerOverImage = (event) => {
    setShowAnswerOverImage(event.target.checked);
  };

  const handleCloseButton = () => {
    handleClose();
  };

  const handleCloseBackground = (event) => {
    if (event.target === background.current) {
      handleClose();
    }
  };

  return (
      <div className={styles.background} ref={background}
           onClick={handleCloseBackground}>
        <article className={styles.card}>
          <h1>Ustawienia</h1>
          <p>
            <input type="checkbox" id="answer-over-image"
                   name="answer-over-image"
                   checked={showAnswerOverImage ?? false}
                   onChange={handleChangeShowAnswerOverImage}/>
            <label htmlFor="answer-over-image">Wyświetlaj odpowiedź nad
              obrazkiem</label>
          </p>
          <button onClick={handleCloseButton}>Zapisz i zamknij</button>
        </article>
      </div>
  );
}