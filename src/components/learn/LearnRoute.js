import {useEffect, useRef, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import {isAnswerCorrect, preloadImage, shuffled} from '../../utils';
import LearnRouteDisplay from './LearnRouteDisplay';

export default function LearnRoute({sectionData}) {
  const {sectionCodeName} = useParams();

  const [toSolve, setToSolve] = useState(null);
  const [solved, setSolved] = useState(null);
  const [isShowingSolution, setIsShowingSolution] = useState(null);
  const [isTextCorrect, setIsTextCorrect] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');

  const userAnswerInput = useRef(null);

  const [current] = toSolve ?? [];

  // initialize component when sectionData or URL changes
  useEffect(() => {
    const itemWithSectionName = (section) => (item) => {
      return {...item, sectionFriendlyName: section.friendlyName};
    };

    const setShuffledToSolve = (arr) => {
      setToSolve(shuffled(arr));
    };

    if (sectionCodeName === 'all') {
      setShuffledToSolve(sectionData.flatMap(
          section => section.items.map(itemWithSectionName(section))));
    } else {
      const section = sectionData.find(
          section => section.codeName === sectionCodeName);
      if (section == null) {
        setToSolve(null);
        setSolved(null);
        return;
      }
      setShuffledToSolve(section.items.map(itemWithSectionName(section)));
    }
    setSolved([]);
    setIsTextCorrect(null);
  }, [sectionCodeName, sectionData]);

  // pre-fetch the next image
  useEffect(() => {
    if (toSolve) {
      const next = toSolve[1];
      if (next) {
        preloadImage(next.imageUrl);
      }
    }
  }, [toSolve]);

  const handleGoNext = (event, isSuccess) => {
    if (event) event.preventDefault();
    if (isSuccess) {
      setToSolve(toSolve.slice(1));
      setSolved([...solved, current]);
    } else {
      if (toSolve.length > 1) {
        setToSolve([...toSolve.slice(1, 2), current, ...toSolve.slice(2)]);
      }
    }
    setIsShowingSolution(false);
    setIsTextCorrect(null);
    setUserAnswer('');
    userAnswerInput.current.focus();
  };

  if (toSolve == null) {
    return (
        <div>
          Nie istnieje taka sekcja, wróć do <Link to="/">strony głównej</Link>
        </div>
    );
  }

  if (current == null) {
    return (
        <div>
          Brawo, zdałxś!!!!!!!! <button
            onClick={() => window.history.go(0)}> Zacznij od nowa</button> bądź
          <Link to="/"> przejdź do menu głównego</Link>, ewentualnie idź spać
        </div>
    );
  }

  const handleShowAnswer = (event) => {
    if (event) event.preventDefault();
    setIsShowingSolution(true);
  };

  const handleSubmitTextAnswer = (event) => {
    event.preventDefault();
    const isCorrect = isAnswerCorrect(current, userAnswer);
    if (userAnswer !== '')
      setIsTextCorrect(isCorrect);
    else
      handleShowAnswer();
    if (isCorrect) {
      if (isTextCorrect) { // if clicked enter again
        handleGoNext(null, true);
      }
      handleShowAnswer();
    }
  };

  const handleAnswerTextChanged = (event) => {
    // hide 'correct' or 'incorrect' when the text input changes
    setIsTextCorrect(null);
    setUserAnswer(event.target.value);
  };

  return (
      <LearnRouteDisplay
          handleAnswerTextChanged={handleAnswerTextChanged}
          handleSubmitTextAnswer={handleSubmitTextAnswer}
          handleGoNext={handleGoNext}
          handleShowAnswer={handleShowAnswer}
          isShowingSolution={isShowingSolution}
          isTextCorrect={isTextCorrect}
          userAnswerInput={userAnswerInput}
          solved={solved}
          toSolve={toSolve}
          userAnswer={userAnswer}
          current={current}
      />
  );
}
