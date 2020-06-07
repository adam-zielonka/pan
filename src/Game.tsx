import React from 'react'
import { observer } from 'mobx-react-lite'
import Players from './components/Players'
import { useStore } from './store'
import Board from './components/Board'
import { ControlGroup, Button } from '@blueprintjs/core'

const Game: React.FC = () => {
  const { newGame, startGame } = useStore().gameStore

  return (
    <div className="game">
      <div>
        <ControlGroup>
          <Button onClick={newGame} >New</Button>
          <Button onClick={startGame} >Start</Button>
          <Players />
        </ControlGroup>
      </div>
      <Board />
    </div>
  )
}

export default observer(Game)
