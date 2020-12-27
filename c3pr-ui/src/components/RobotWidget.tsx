import React from "react"
import { Robot } from '../types/Robot'
import axios from 'axios'

function allocate(robot:Robot) {
  axios.post('/', 'robot=' + robot.name)
}

export function RobotWidget({...robot}:Robot) {
  return (
    <div key={robot.name} onClick={() => allocate(robot)} style={{maxWidth: "30%", maxHeight: "40%", float: "left", margin: "10px", padding: "10px", border: "solid 1px"}}>
      <h4 style={{textAlign: "center"}}> {robot.name} </h4>
      <img src={robot.img}/>
    </div>
  )
}
