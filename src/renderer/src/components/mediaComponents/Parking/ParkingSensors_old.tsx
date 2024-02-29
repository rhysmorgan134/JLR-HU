import './Pam.css'
import car from './car.png'
import { useCanGatewayStore } from '../../../store/store'

const Pam = () => {
  const pam = useCanGatewayStore((state) => state.parkingSensors)

  return (
    <div style={{ height: '300px', width: '250px' }}>
      <div id="pam">
        <div id="sensors">
          <div id="mainPam">
            <div
              id="disA4"
              className={pam.frontLeft > 5 ? 'sensorLine disClear' : 'sensorLine'}
            ></div>
            <div
              id="disA1"
              className={pam.frontLeft > 13 ? 'sensorLine disClear' : 'sensorLine'}
            ></div>
            <div
              id="disA2"
              className={pam.frontLeft > 22 ? 'sensorLine disClear' : 'sensorLine'}
            ></div>
            <div
              id="disA3"
              className={pam.frontLeft > 28 ? 'sensorLine disClear' : 'sensorLine'}
            ></div>
          </div>
          <div id="main2">
            <div
              id="dis4"
              className={pam.frontCentreLeft > 5 ? 'sensorLine disClear' : 'sensorLine'}
            ></div>
            <div
              id="dis1"
              className={pam.frontCentreLeft > 13 ? 'sensorLine disClear' : 'sensorLine'}
            ></div>
            <div
              id="dis2"
              className={pam.frontCentreLeft > 22 ? 'sensorLine disClear' : 'sensorLine'}
            ></div>
            <div
              id="dis3"
              className={pam.frontCentreLeft > 28 ? 'sensorLine disClear' : 'sensorLine'}
            ></div>
          </div>
          <div id="main3">
            <div
              id="dis4"
              className={pam.frontCentreRight > 5 ? 'sensorLine disClear' : 'sensorLine'}
            ></div>
            <div
              id="dis1"
              className={pam.frontCentreRight > 13 ? 'sensorLine disClear' : 'sensorLine'}
            ></div>
            <div
              id="dis2"
              className={pam.frontCentreRight > 22 ? 'sensorLine disClear' : 'sensorLine'}
            ></div>
            <div
              id="dis3"
              className={pam.frontCentreRight > 28 ? 'sensorLine disClear' : 'sensorLine'}
            ></div>
          </div>
          <div id="main4">
            <div
              id="disA4"
              className={pam.frontRight > 5 ? 'sensorLine disClear' : 'sensorLine'}
            ></div>
            <div
              id="disA1"
              className={pam.frontRight > 13 ? 'sensorLine disClear' : 'sensorLine'}
            ></div>
            <div
              id="disA2"
              className={pam.frontRight > 22 ? 'sensorLine disClear' : 'sensorLine'}
            ></div>
            <div
              id="disA3"
              className={pam.frontRight > 28 ? 'sensorLine disClear' : 'sensorLine'}
            ></div>
          </div>
        </div>
        <div id="pic">
          <img src={car} />
        </div>
        <div id="sensors2">
          <div id="mainPam">
            <div
              id="disA4"
              className={pam.rearRight > 5 ? 'sensorLine disClear' : 'sensorLine'}
            ></div>
            <div
              id="disA1"
              className={pam.rearRight > 13 ? 'sensorLine disClear' : 'sensorLine'}
            ></div>
            <div
              id="disA2"
              className={pam.rearRight > 22 ? 'sensorLine disClear' : 'sensorLine'}
            ></div>
            <div
              id="disA3"
              className={pam.rearRight > 28 ? 'sensorLine disClear' : 'sensorLine'}
            ></div>
          </div>
          <div id="main2">
            <div
              id="dis4"
              className={pam.rearCentreRight > 5 ? 'sensorLine disClear' : 'sensorLine'}
            ></div>
            <div
              id="dis1"
              className={pam.rearCentreRight > 13 ? 'sensorLine disClear' : 'sensorLine'}
            ></div>
            <div
              id="dis2"
              className={pam.rearCentreRight > 22 ? 'sensorLine disClear' : 'sensorLine'}
            ></div>
            <div
              id="dis3"
              className={pam.rearCentreRight > 28 ? 'sensorLine disClear' : 'sensorLine'}
            ></div>
          </div>
          <div id="main3">
            <div
              id="dis4"
              className={pam.rearCentreLeft > 5 ? 'sensorLine disClear' : 'sensorLine'}
            ></div>
            <div
              id="dis1"
              className={pam.rearCentreLeft > 13 ? 'sensorLine disClear' : 'sensorLine'}
            ></div>
            <div
              id="dis2"
              className={pam.rearCentreLeft > 22 ? 'sensorLine disClear' : 'sensorLine'}
            ></div>
            <div
              id="dis3"
              className={pam.rearCentreLeft > 28 ? 'sensorLine disClear' : 'sensorLine'}
            ></div>
          </div>
          <div id="main4">
            <div
              id="disA4"
              className={pam.rearLeft > 5 ? 'sensorLine disClear' : 'sensorLine'}
            ></div>
            <div
              id="disA1"
              className={pam.rearLeft > 13 ? 'sensorLine disClear' : 'sensorLine'}
            ></div>
            <div
              id="disA2"
              className={pam.rearLeft > 22 ? 'sensorLine disClear' : 'sensorLine'}
            ></div>
            <div
              id="disA3"
              className={pam.rearLeft > 28 ? 'sensorLine disClear' : 'sensorLine'}
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Pam
