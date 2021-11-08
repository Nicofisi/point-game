import { randomElement } from './utils'

export const tips = [
  'sen sprzyja zapamiętywaniu',
  'pij dwa litry wody dziennie',
  'organizm wymaga regularnego jedzenia',
]

export const randomTip = () => randomElement(tips)