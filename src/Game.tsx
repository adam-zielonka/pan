import React from 'react'
import { observer } from 'mobx-react-lite'
import Players from './components/Players'
import { useStore } from './store'

const Game: React.FC = () => {
  const { newGame, startGame } = useStore()

  return (
    <div className="Game">
      <div>
        <button onClick={newGame} >New</button>
        <button onClick={startGame} >Start</button>
      </div>
      <Players />
    </div>
  )
}

export default observer(Game)
