import React from 'react'
import { observer } from 'mobx-react-lite'
import Players from './Players'
import { useGameStore } from '../store/store'
import Board from './Board'
import { ControlGroup, Button } from '@blueprintjs/core'

const Game: React.FC = () => {
  const { newGame } = useGameStore()

  return (
    <div className="game">
      <div className="cards bp3-card">
        <ControlGroup className="menu">
          <Button onClick={newGame}>New Game</Button>
          <Players />
        </ControlGroup>
      </div>
      <Board />
    </div>
  )
}

export default observer(Game)
