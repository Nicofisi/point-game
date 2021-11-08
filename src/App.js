import './App.css'
import { useEffect, useState } from 'react'
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom'
import MainRoute from './components/MainRoute'
import TrainRoute from './components/LearnRoute'
import Loading from './components/Loading'

function App () {
  const [sections, setSections] = useState(null)
  const [sectionData, setSectionData] = useState(null)
  const [error, setError] = useState(null)

  const parseRows = (text) => {
    const parser = new DOMParser()
    const htmlDoc = parser.parseFromString(text, 'text/html')
    const tbody = htmlDoc.querySelector('tbody')
    return Array.from(tbody.children)
  }

  useEffect(() => {
    fetch('/point-game/data/zzz_działy.html').
      then((r) => r.text()).
      then(text => {
        const data = parseRows(text).map(row => {
          const rowElems = Array.from(row.querySelectorAll('td'))
          return rowElems.map(elem => elem.textContent)
        })
        setSections(data)
      }).
      catch(ex => {
        console.log(ex)
        setError('Nie udało się pobrać lub przetworzyć pliku zzz_działy.html')
      })
  }, [])

  useEffect(() => {
    if (sections)
      Promise.all(sections.map(([, sectionSheetName]) => fetch(
        `/point-game/data/${sectionSheetName}.html`))).
        then(rs => Promise.all(rs.map(r => r.text()))).
        then(sheets => {
          return sheets.map(sheet => {
              return parseRows(sheet).slice(1).map(row => {
                const rowElems = Array.from(row.querySelectorAll('td'))
                const imageUrl = rowElems[0].children.item(0).
                  children.
                  item(0).
                  getAttribute('src').
                  replace(/=w\d+-h\d+$/, '')
                return {
                  imageUrl,
                  names: rowElems.slice(1).map(elem => elem.innerText),
                }
              })
            },
          )
        }).
        then(elementLists => {
          return sections.map(([sectionCodeName, sectionFriendlyName], i) => {
            return {
              codeName: sectionCodeName,
              friendlyName: sectionFriendlyName,
              items: elementLists[i],
            }
          })
        }).
        then(data => {
          setSectionData(data)
        }).
        catch(ex => {
          console.log(ex)
          setError(
            'Nie udało się pobrać lub przetworzyć jednego z plików z fiszkami')
        })
  }, [sections])

  console.log(sectionData)

  return (
    <div className="App">
      {error ?? ''}
      {sectionData ?
        (<HashRouter>
          <Switch>
            <Route path="/" exact>
              <MainRoute sectionData={sectionData}/>
            </Route>
            <Route path="/train/:sectionCodeName">
              <TrainRoute sectionData={sectionData}/>
            </Route>
            <Redirect to="/"/>
          </Switch>
        </HashRouter>) :
        <Loading/>
      }
    </div>
  )
}

export default App
