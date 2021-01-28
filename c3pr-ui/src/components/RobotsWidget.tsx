import React, { useState } from "react"
import axios from 'axios'
import { Robot } from '../types/Robot'
import { RobotAvailable } from '../types/RobotAvailable'
import { RobotWidget } from './RobotWidget'

export default function RobotsWidget({onSelection}:any) {
  const [error, setError] = useState()
  const [robots, setRobots] = useState<Robot[]>()
  const [robotsAvailable, setRobotsAvailable] = useState<RobotAvailable[]>()
  const [isLoading, setIsLoading] = useState(true)
  //const [isLoadingAvailable, setIsLoadingAvailable] = useState(true)

  axios.get("/free")

  if(!robots && !error) {
  axios.get("/robots.json")
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

  function update_available() {
    //setIsLoadingAvailable(true)

    if(!robotsAvailable && !error) {
      axios.get("available.json")
      .then(
        r => {
          //setIsLoadingAvailable(false)
          setRobotsAvailable(r.data)
        },
        e => {
          //setIsLoadingAvailable(false)
          setError(e)
        }
      )
    }
  }
  update_available()
 
  function isAvailable(robot:Robot) {
    const availabilityEntry = robotsAvailable && robotsAvailable.find(ra => ra.name === robot.name && ra)
    return availabilityEntry && !(availabilityEntry.user)
  }

  return (
    <>
      { isLoading && <p>Loading data...</p> }
      { error && <p>An error occurred</p> }
      { !error && robots && robotsAvailable &&
        <div style={{maxWidth: "1000px"}}>
	  { robots.filter(r => isAvailable(r))
	    .map(robot => <RobotWidget key={robot.name} onSelection={onSelection} robot={robot} />)
	  }
	  { robots.filter(r => !isAvailable(r))
	    .map(robot => <RobotWidget key={robot.name} onSelection={onSelection} robot={robot} disabled={true} />)
	  }
	</div>
      }
    </>
  )
}
