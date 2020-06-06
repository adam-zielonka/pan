import React from 'react'
import { observer } from 'mobx-react-lite'
import Players from './components/Players'
import { useStore } from './store'
import Board from './components/Board'

const Game: React.FC = () => {
  const { newGame, startGame } = useStore().gameStore

  return (
    <div className="Game">
      <div>
        <button onClick={newGame} >New</button>
        <button onClick={startGame} >Start</button>
      </div>
      <Players />
      <Board />
    </div>
  )
}

export default observer(Game)
