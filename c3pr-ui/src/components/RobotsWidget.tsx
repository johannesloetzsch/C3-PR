import React, { useState } from "react"
import axios from 'axios'
import { Robot } from '../types/Robot'
import { RobotWidget } from './RobotWidget'

export default function RobotsWidget({onSelection}:any) {
  const [robots, setRobots] = useState<Robot[]>()
  const [error, setError] = useState()
  const [isLoading, setIsLoading] = useState(true)

  if(!robots && !error) {
  axios.get("robots.json")
    .then(
      r => {
        setIsLoading(false)
        setRobots(r.data)
      },
      e => {
        setIsLoading(false)
        setError(e)
      }
    )
  }

  return (
    <>
      { isLoading && <p>Loading data...</p> }
      { error && <p>An error occurred</p> }
      { !error && robots &&
        <div>
	  { robots.map(robot => <RobotWidget key={robot.name} onSelection={onSelection} robot={robot} />) }
	</div>
      }
    </>
  )
}
