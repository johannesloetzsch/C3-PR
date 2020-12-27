import React from "react"
import { Robot } from '../types/Robot'
import axios from 'axios'

function allocate(robot:Robot) {
  axios.post('/', 'robot=' + robot.name)
}

export function RobotWidget({...robot}:Robot) {
  return (
    <div key={robot.name} onClick={() => allocate(robot)}>
      <h6> {robot.name} </h6>
      <img src={robot.img}/>
    </div>
  )
}
