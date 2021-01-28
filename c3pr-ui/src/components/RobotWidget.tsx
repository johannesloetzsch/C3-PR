import React from "react"
import { Robot } from '../types/Robot'
import axios from 'axios'

function allocate(robot:Robot, onSelection:any) {
  axios.post('/', 'robot=' + robot.name)
  onSelection(robot)
}

export function RobotWidget({onSelection, robot, disabled=false}:any) {
  return (
    <div style={{float: "left", maxWidth: "33%", maxHeight: "420px"}}>
      <div key={robot.name} onClick={() => {if(!disabled) allocate(robot, onSelection)}}
           style={{margin: "10px", padding: "10px", border: "solid 1px",
               opacity: disabled ? "50%" : "100%" }}>
        <h4 style={{textAlign: "center"}}> {robot.name} </h4>
        { !disabled ? "" :
          <div style={{height: "0", transform: "translate(0, 100px) rotate(-35deg)", fontSize: "xxx-large", color: "orange"}}>
            In Benutzung
          </div>
        }
        <img src={robot.img}/>
      </div>
    </div>
  )
}
