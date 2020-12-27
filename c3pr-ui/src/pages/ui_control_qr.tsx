import React from 'react'
import Explore from '../components/Explore'
import {Robot} from 'src/types/Robot'

const allocatedRobot:Robot = {name: 'unknown', img: 'ignore', rotate: 0}

export default () => (
  <Explore allocatedRobot={allocatedRobot} />
)
