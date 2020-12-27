import React, { useState } from "react"
import { Robot } from '../types/Robot'
import RobotsWidget from './RobotsWidget'
import Explore from '../components/Explore'

export default () => {
  const [allocatedRobot, allocateRobot] = useState<Robot>()

  if(!allocatedRobot)
    return ( <RobotsWidget onSelection={allocateRobot} /> )
  else
    return ( <Explore allocatedRobot={allocatedRobot} /> )
}
