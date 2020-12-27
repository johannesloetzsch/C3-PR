import React from "react"
import { Robot } from '../types/Robot'
import axios from 'axios'

function allocate(robot:Robot, onSelection:any) {
  axios.post('/', 'robot=' + robot.name)
  onSelection(robot)
}

export function RobotWidget({onSelection, robot}:any) {
  return (
    <div key={robot.name} onClick={() => allocate(robot, onSelection)}
         style={{maxWidth: "30%", maxHeight: "40%", float: "left", margin: "10px", padding: "10px", border: "solid 1px"}}>
      <h4 style={{textAlign: "center"}}> {robot.name} </h4>
      <img src={robot.img}/>
    </div>
  )
}
