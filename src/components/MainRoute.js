import {Link} from 'react-router-dom';
import {useState} from 'react';
import {preloadImage} from '../utils';

export default function MainRoute({sectionData}) {
  const [isPreloadDone, setIsPreloadDone] = useState(null);

  const handlePreloadImages = (event) => {
    event.preventDefault();
    setIsPreloadDone(false);

    const imageUrls = sectionData.flatMap(section => section.items.map(item => item.imageUrl));
    Promise.all(imageUrls.map(x => preloadImage(x)))
        .then(() => {
          setIsPreloadDone(true);
        });
  };

  return (
      <div>
        <h1>Point Game</h1>
        <div>
          <Link to='/train/all'>Wszystkie działy</Link>
        </div>
        {sectionData ? sectionData.map(section =>
            <div key={section.codeName}>
              <Link to={`/train/${section.codeName}`}>{section.friendlyName}</Link>
            </div>,
        ) : ''}
        <div>Jeśli nie szkoda ci internetu to dla płynniejszego działania aplikacji możesz na zapas pobrać z góry wszystkie
          zdjęcia do pamięci podręcznej
        </div>
        <button onClick={handlePreloadImages}>Wczytaj obrazki</button>
        {isPreloadDone === false ? <div>Wczytywanie obrazków...</div> : ''}
        {isPreloadDone === true ? <div>Obrazki wczytane</div> : ''}
        <div>Wersja 2.3</div>
      </div>
  );
}
