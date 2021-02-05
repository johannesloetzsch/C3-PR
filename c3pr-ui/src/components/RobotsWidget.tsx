import React, { useState, useEffect } from "react"
import axios from 'axios'
import { Robot } from '../types/Robot'
import { RobotAvailable } from '../types/RobotAvailable'
import { RobotWidget } from './RobotWidget'
import { pingbot_hashed_useragent } from '../conf'

export default function RobotsWidget({onSelection}:any) {
  axios.get("/free")

  const [error, setError] = useState()
  const [robots, setRobots] = useState<Robot[]>()
  const [robotsAvailable, setRobotsAvailable] = useState<RobotAvailable[]>()
  const [isLoading, setIsLoading] = useState(true)
  //const [isLoadingAvailable, setIsLoadingAvailable] = useState(true)

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

  function update_available(force=false) {
    //setIsLoadingAvailable(true)

    if(force || !robotsAvailable && !error) {
      console.log('update available')
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

  useEffect(() => {
    const interval = setInterval(() => update_available(true), 10*1000)
    return () => clearInterval(interval)
  })

  function availability(robot:Robot) {
    const availabilityEntry = robotsAvailable && robotsAvailable.find(ra => ra.name === robot.name && ra)
    if( availabilityEntry && !(availabilityEntry.user) )
      return 'free'
    if( !availabilityEntry || availabilityEntry.user === pingbot_hashed_useragent )
      return 'offline'
    return 'used'
  }

  return (
    <div style={{textAlign: 'center'}}>
      { isLoading && <p>Loading data...</p> }
      { error && <p>An error occurred</p> }
      { !error && robots && robotsAvailable &&
        <>
	  <div>
            { robots.filter(r => availability(r) !== 'offline').length === 0
	      ? <div className="offlineMsg">
		  <p>Derzeit sind leider keine Roboter online, bitte versuche es später erneut.</p>
		  <p>Im Februar 2021 können die Roboter in den Technischen Sammlungen jeden Freitag zwischen 16h und 20h benutzt werden.</p>
		</div>
	      : ''
	    }
	  </div>
          <div style={{maxWidth: "1000px", display: "inline-block"}}>
            { robots.filter(r => availability(r) === 'free')
              .map(robot => <RobotWidget key={robot.name} onSelection={onSelection} robot={robot} />)
            }
          </div><br/>
          <div style={{maxWidth: "1000px", display: "inline-block"}}>
            { robots.filter(r => availability(r) === 'used')
              .map(robot => <RobotWidget key={robot.name} onSelection={onSelection} robot={robot} disabled={'used'} />)
            }
          </div><br/>
          <div style={{maxWidth: "1000px", display: "inline-block"}}>
            { robots.filter(r => availability(r) === 'offline')
              .map(robot => <RobotWidget key={robot.name} onSelection={onSelection} robot={robot} disabled={'offline'} />)
            }
          </div>
        </>
      }
    </div>
  )
}
