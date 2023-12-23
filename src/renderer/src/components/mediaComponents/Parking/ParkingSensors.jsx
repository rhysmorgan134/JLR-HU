const testMode = false

// Size of the SVG
const size = '80%'

// scale values from the sensor
const sensorScale = [0, 31]

// radius ranges for the sensors - adjust to change the gradient stopping position and other shizzle
// side sensors
const sideSensorRadius = [21.0, 7.2]
// center sensors
const centerSensorRadius = [18.5, 6.2]

// colour fill strength - 100% = very strong - 0% = very weak
const fillStrength = '25%'

// Functions
// function to convert sensor range to radius range of the radial gradient
function convertRange(value, r1, r2) {
  return ((value - r1[0]) * (r2[1] - r2[0])) / (r1[1] - r1[0]) + r2[0]
}

// function to get the correct sensor radius range
function getRadiusRange(sensorGroup) {
  let x
  if (sensorGroup === 'side') {
    x = sideSensorRadius
  } else if (sensorGroup === 'center') {
    x = centerSensorRadius
  } else {
    x = [0, 0]
  }
  return x
}

// colour finder based on value of sensor
function colourFinder(value) {
  let valuePercentage = 100 - (100 / sensorScale[1]) * value
  let r,
    g,
    b = 0
  if (valuePercentage < 50) {
    r = 255
    g = Math.round(5.1 * valuePercentage)
  } else {
    g = 255
    r = Math.round(510 - 5.1 * valuePercentage)
  }
  var h = r * 0x10000 + g * 0x100 + b * 0x1
  return '#' + ('000000' + h.toString(16)).slice(-6)
}

//function to update the sensors graphic - only used in test mode
function adjustSensorGraphic(sensorPosition, sensorGroup) {
  // Get sensor value - using an input range currently for testing so will need to replace with the actual sensor data
  let x = document.getElementById(`${sensorPosition}-Input`).value

  // this line used for testing only - can be deleted
  document.getElementById(`${sensorPosition}-Text`).innerHTML = `${sensorPosition}: ${x}`

  // set the radius of the gradient fill which creates the effect of the sensors graphic moving in and out
  let radiusSetting = convertRange(x, sensorScale, getRadiusRange(sensorGroup))
  document.getElementById(`${sensorPosition}-LG`).setAttribute('r', radiusSetting)

  // set colour based on sensor value
  document
    .getElementById(`${sensorPosition}-stop1`)
    .setAttribute('style', `stop-color:${colourFinder(x)};stop-opacity:1;`)
  document
    .getElementById(`${sensorPosition}-stop2`)
    .setAttribute('style', `stop-color:${colourFinder(x)};stop-opacity:0;`)
}

// functions (other than the exported function) below used in test mode only
function allfunc() {
  let x = document.getElementById('all').value
  document.getElementById('all-Text').innerHTML = 'all: ' + x
  document.getElementById('FRR-Input').value = x
  document.getElementById('FCR-Input').value = x
  document.getElementById('FLL-Input').value = x
  document.getElementById('FCL-Input').value = x
  document.getElementById('BRR-Input').value = x
  document.getElementById('BCR-Input').value = x
  document.getElementById('BLL-Input').value = x
  document.getElementById('BCL-Input').value = x
  adjustSensorGraphic(`FLL`, `side`)
  adjustSensorGraphic(`FRR`, `side`)
  adjustSensorGraphic(`FCL`, `center`)
  adjustSensorGraphic(`FCR`, `center`)
  adjustSensorGraphic(`BLL`, `side`)
  adjustSensorGraphic(`BRR`, `side`)
  adjustSensorGraphic(`BCL`, `center`)
  adjustSensorGraphic(`BCR`, `center`)
}

function SVGDIM(dim) {
  let x = document.getElementById(`SVG${dim}`).value
  document.getElementById(`SVG${dim}-Text`).innerHTML = `SVG ${dim}: ` + x
  document.getElementById('SVGCAR').setAttribute(dim, x)
}

function backColour() {
  let x = document.getElementById('colorpicker').value
  document.getElementById('SVG-div').setAttribute('style', `background-color:${x}`)
}

function fillStrengthFunc() {
  let x = document.getElementById('fillStrength').value
  document.getElementById('fillStrength-Text').innerHTML = `fill strength ${x}%`

  let elements = document.getElementsByClassName('fillStrength')
  for (var i = 0; i < elements.length; i++) {
    elements[i].setAttribute('offset', `${x}%`)
  }
}

function ParkingSensors({
  sensorFLL,
  sensorFCL,
  sensorFCR,
  sensorFRR,
  sensorBLL,
  sensorBCL,
  sensorBCR,
  sensorBRR
}) {
  //function to update the sensors graphic position
  function setSensorGraphicPosition(sensorGroup, value) {
    // set the radius of the gradient fill which creates the effect of the sensors graphic moving in and out
    let radiusSetting = convertRange(value, sensorScale, getRadiusRange(sensorGroup))
    return radiusSetting
  }

  //function to update the sensors graphic colour
  function setSensorGraphicColour(opacity, value) {
    return {
      stopColor: colourFinder(value),
      stopOpacity: opacity
    }
  }

  return (
    <div style={{ display: `table` }}>
      {/* only need to copy in this SVG and div and the logic from main.js with the call to the script*/}
      <div id="SVG-div">
        {/* width and height are a 2 to 1 ratio */}
        <svg id="SVGCAR" width={size} height={size * 1.88} viewBox="0 0 128 241">
          {/* linear and radial gradients */}
          {/* front left left  */}
          <linearGradient id="frontLeftLeft">
            <stop
              className="fillStrength"
              id="FLL-stop1"
              style={setSensorGraphicColour(1, sensorFLL)}
              offset={fillStrength}
            />
            <stop id="FLL-stop2" style={setSensorGraphicColour(0, sensorFLL)} offset="100%" />
          </linearGradient>
          <radialGradient
            xlinkHref="#frontLeftLeft"
            id="FLL-LG"
            gradientUnits="userSpaceOnUse"
            gradientTransform="matrix(3.0892363,-2.8044072,2.6782459,2.9502609,-303.29614,51.293231)"
            cx="60.478725"
            cy="65.146957"
            fx="60.478725"
            fy="65.146957"
            r={setSensorGraphicPosition('side', sensorFLL)}
          />
          {/* front center left */}
          <linearGradient id="frontCenterLeft">
            <stop
              className="fillStrength"
              id="FCL-stop1"
              style={setSensorGraphicColour(1, sensorFCL)}
              offset={fillStrength}
            />
            <stop id="FCL-stop2" style={setSensorGraphicColour(0, sensorFCL)} offset="100%" />
          </linearGradient>
          <radialGradient
            xlinkHref="#frontCenterLeft"
            id="FCL-LG"
            gradientUnits="userSpaceOnUse"
            gradientTransform="matrix(4.9961732,-0.80779407,0.71428713,4.4178509,-253.63206,-139.53536)"
            cx="54.057732"
            cy="58.193375"
            fx="54.057732"
            fy="58.193375"
            r={setSensorGraphicPosition('center', sensorFCL)}
          />
          {/* Front center right */}
          <linearGradient id="frontCenterRight">
            <stop
              className="fillStrength"
              id="FCR-stop1"
              style={setSensorGraphicColour(1, sensorFCR)}
              offset={fillStrength}
            />
            <stop id="FCR-stop2" style={setSensorGraphicColour(0, sensorFCR)} offset="100%" />
          </linearGradient>
          <radialGradient
            xlinkHref="#frontCenterRight"
            id="FCR-LG"
            gradientTransform="matrix(0.7157413,-4.4178566,4.9959202,0.80939386,-301.63414,316.14543)"
            gradientUnits="userSpaceOnUse"
            cx="66.713608"
            cy="64.829391"
            fx="66.713608"
            fy="64.829391"
            r={setSensorGraphicPosition('center', sensorFCR)}
          />
          {/* Front right right */}
          <linearGradient id="frontRightRight">
            <stop
              className="fillStrength"
              id="FRR-stop1"
              style={setSensorGraphicColour(1, sensorFRR)}
              offset={fillStrength}
            />
            <stop id="FRR-stop2" style={setSensorGraphicColour(0, sensorFRR)} offset="100%" />
          </linearGradient>
          <radialGradient
            xlinkHref="#frontRightRight"
            id="FRR-LG"
            gradientTransform="matrix(2.6782622,-2.9502606,3.0892269,2.8044163,-323.17537,66.511485)"
            gradientUnits="userSpaceOnUse"
            cx="64.955345"
            cy="70.963249"
            fx="64.955345"
            fy="70.963249"
            r={setSensorGraphicPosition('side', sensorFRR)}
          />
          {/* Back center left */}
          <linearGradient id="backCenterLeft">
            <stop
              className="fillStrength"
              id="BCL-stop1"
              style={setSensorGraphicColour(1, sensorBCL)}
              offset={fillStrength}
            />
            <stop id="BCL-stop2" style={setSensorGraphicColour(0, sensorBCL)} offset="100%" />
          </linearGradient>
          <radialGradient
            xlinkHref="#backCenterLeft"
            id="BCL-LG"
            gradientUnits="userSpaceOnUse"
            gradientTransform="matrix(4.9961733,0.80779407,0.71428712,-4.4178508,-253.63205,381.39921)"
            cx="54.057732"
            cy="58.193375"
            fx="54.057732"
            fy="58.193375"
            r={setSensorGraphicPosition('center', sensorBCL)}
          />
          {/* Back left left */}
          <linearGradient id="backLeftLeft">
            <stop
              className="fillStrength"
              id="BLL-stop1"
              style={setSensorGraphicColour(1, sensorBLL)}
              offset={fillStrength}
            />
            <stop id="BLL-stop2" style={setSensorGraphicColour(0, sensorBLL)} offset="100%" />
          </linearGradient>
          <radialGradient
            xlinkHref="#backLeftLeft"
            id="BLL-LG"
            gradientUnits="userSpaceOnUse"
            gradientTransform="matrix(3.0892363,2.8044071,2.6782458,-2.9502608,-303.29614,190.57057)"
            cx="60.478725"
            cy="65.146957"
            fx="60.478725"
            fy="65.146957"
            r={setSensorGraphicPosition('side', sensorBLL)}
          />
          {/* Back right right */}
          <linearGradient id="backRightRight">
            <stop
              className="fillStrength"
              id="BRR-stop1"
              style={setSensorGraphicColour(1, sensorBRR)}
              offset={fillStrength}
            />
            <stop id="BRR-stop2" style={setSensorGraphicColour(0, sensorBRR)} offset="100%" />
          </linearGradient>
          <radialGradient
            xlinkHref="#backRightRight"
            id="BRR-LG"
            cx="64.955345"
            cy="70.963249"
            fx="64.955345"
            fy="70.963249"
            r={setSensorGraphicPosition('side', sensorBRR)}
            gradientTransform="matrix(2.6782622,2.9502605,3.0892268,-2.8044163,-323.17537,175.3523)"
            gradientUnits="userSpaceOnUse"
          />
          {/* Back center right */}
          <linearGradient id="backCenterRight">
            <stop
              className="fillStrength"
              id="BCR-stop1"
              style={setSensorGraphicColour(1, sensorBCR)}
              offset={fillStrength}
            />
            <stop id="BCR-stop2" style={setSensorGraphicColour(0, sensorBCR)} offset="100%" />
          </linearGradient>
          <radialGradient
            xlinkHref="#backCenterRight"
            id="BCR-LG"
            cx="66.713608"
            cy="64.829391"
            fx="66.713608"
            fy="64.829391"
            r={setSensorGraphicPosition('center', sensorBCR)}
            gradientTransform="matrix(0.7157413,4.4178566,4.9959201,-0.80939385,-301.63413,-74.28158)"
            gradientUnits="userSpaceOnUse"
          />
          {/* paths */}
          {/* front left left */}
          <path
            style={{
              fill: 'url(#FLL-LG)',
              stroke: 'none',
              strokeWidth: '0.264583px',
              strokeLinecap: 'butt',
              strokeLinejoin: 'miter',
              strokeOpacity: 1,
              fillOpacity: 1
            }}
            d="M 2.8021653,32.895399 C 6.9302304,24.383192 11.20818,15.871477 25.654382,7.3930975 l 21.25388,42.6061645 c -3.453537,0.600629 -6.075048,3.047759 -8.395311,6.163447 z"
            id="path102"
          />
          {/* front center left */}
          <path
            style={{
              fill: 'url(#FCL-LG)',
              stroke: 'none',
              strokeWidth: '0.264583px',
              strokeLinecap: 'butt',
              strokeLinejoin: 'miter',
              strokeOpacity: 1,
              fillOpacity: 1
            }}
            d="M 26.964002,6.6319079 C 37.118148,2.6898132 51.316899,3.6178658 63.301638,3.4295222 l 0.02313,44.4773588 C 58.316938,47.72882 53.306296,48.408448 48.29422,49.525382 Z"
            id="path104"
          />
          {/* front right right */}
          <path
            style={{
              fill: 'url(#FRR-LG)',
              fillOpacity: 1,
              stroke: 'none',
              strokeWidth: '0.264583px',
              strokeLinecap: 'butt',
              strokeLinejoin: 'miter',
              strokeOpacity: 1
            }}
            d="M 125.43486,32.895396 C 121.3068,24.38319 117.02884,15.871475 102.58263,7.3930956 L 81.328774,49.999258 c 3.453537,0.60063 6.075047,3.04776 8.395311,6.163447 z"
            id="12r3qwf"
          />
          {/* front center right */}
          <path
            style={{
              fill: 'url(#FCR-LG)',
              fillOpacity: 1,
              stroke: 'none',
              strokeWidth: '0.264583px',
              strokeLinecap: 'butt',
              strokeLinejoin: 'miter',
              strokeOpacity: 1
            }}
            d="M 101.27301,6.6319066 C 91.118889,2.6898116 76.920135,3.6178646 64.935396,3.4295206 l -0.02313,44.4773604 c 5.007831,-0.178062 10.018473,0.501565 15.030549,1.618498 z"
            id="124eqwg"
          />
          {/* back center left */}
          <path
            style={{
              fill: 'url(#BCL-LG)',
              fillOpacity: 1,
              stroke: 'none',
              strokeWidth: '0.264583px',
              strokeLinecap: 'butt',
              strokeLinejoin: 'miter',
              strokeOpacity: 1
            }}
            d="m 26.964009,235.23192 c 10.15415,3.94209 24.3529,3.01404 36.33763,3.20238 l 0.0231,-44.47738 c -5.00783,0.17806 -10.01847,-0.50157 -15.03054,-1.6185 z"
            id="path104-1"
          />
          {/* back left left */}
          <path
            style={{
              fill: 'url(#BLL-LG)',
              fillOpacity: 1,
              stroke: 'none',
              strokeWidth: '0.264583px',
              strokeLinecap: 'butt',
              strokeLinejoin: 'miter',
              strokeOpacity: 1
            }}
            d="m 2.8021386,208.96841 c 4.12806,8.51221 8.4060204,17.02393 22.8522204,25.50232 l 21.25388,-42.60619 c -3.45354,-0.60063 -6.07505,-3.04776 -8.39532,-6.16345 z"
            id="path102-1"
          />
          {/* back right right */}
          <path
            style={{
              fill: 'url(#BRR-LG)',
              fillOpacity: 1,
              stroke: 'none',
              strokeWidth: '0.264583px',
              strokeLinecap: 'butt',
              strokeLinejoin: 'miter',
              strokeOpacity: 1
            }}
            d="m 125.43485,208.96841 c -4.12806,8.51222 -8.40602,17.02393 -22.85223,25.50232 L 81.328739,191.86454 c 3.45354,-0.60063 6.07505,-3.04776 8.39531,-6.16345 z"
            id="12r3qwf-9"
          />
          {/* back center right */}
          <path
            style={{
              fill: 'url(#BCR-LG)',
              fillOpacity: 1,
              stroke: 'none',
              strokeWidth: '0.264583px',
              strokeLinecap: 'butt',
              strokeLinejoin: 'miter',
              strokeOpacity: 1
            }}
            d="m 101.27298,235.23192 c -10.154121,3.94209 -24.352871,3.01404 -36.337611,3.20239 l -0.0231,-44.47739 c 5.00783,0.17806 10.01848,-0.50157 15.03054,-1.6185 z"
            id="124eqwg-2"
          />
          {/* Car */}
          <path
            id="CAR"
            style={{ fill: '#808080', stroke: 'none', strokeWidth: '0.79375' }}
            d="m 52.330589,191.89061 c -5.605759,-0.9286 -9.584471,-3.01779 -11.268314,-5.91692 -2.573498,-4.43088 -3.819282,-21.42417 -3.820323,-52.11164 -9.44e-4,-27.84708 -0.03059,-28.37657 -1.588463,-28.37657 -1.164167,0 -1.5875,-0.52916 -1.5875,-1.98437 0,-1.09141 0.714375,-2.69875 1.5875,-3.571877 1.470754,-1.470744 1.683895,-2.653065 1.596921,-16.073405 -0.14778,-22.802907 2.300247,-30.877805 13.57149,-33.292449 3.499887,-0.749783 6.087158,-1.292076 13.370744,-1.2883 10.54638,0.0065 14.202739,0.391266 19.755809,3.944173 5.40878,3.460589 7.267358,10.607762 7.267358,31.957574 0,12.623609 0.11461,13.703993 1.587491,14.965114 0.873124,0.74759 1.587491,2.21407 1.587491,3.25882 0,1.23202 -0.557877,2.04546 -1.587491,2.31471 -1.551421,0.40571 -1.588281,1.09756 -1.622361,30.45351 -0.0286,24.58574 -0.292867,31.80173 -1.456151,39.75261 -1.485981,10.15657 -2.323538,11.98626 -6.444554,14.07865 -5.00115,2.53926 -21.09741,3.5224 -30.949647,1.89037 z m 22.478035,-1.99351 c 2.188608,-0.36163 3.235782,-1.01831 3.740429,-2.34564 0.385467,-1.01388 1.932608,-2.65086 3.438082,-3.63773 1.505471,-0.98686 3.541769,-3.40997 4.525093,-5.38468 1.727761,-3.46966 1.813451,-4.7166 2.548535,-37.08448 0.418367,-18.42175 0.525457,-34.43126 0.23798,-35.5767 -0.28749,-1.14543 -0.956014,-1.93871 -1.485611,-1.76285 -0.670957,0.22281 -1.030247,3.36599 -1.184994,10.36699 l -0.22209,10.04723 -2.472225,1.27845 -2.472225,1.27843 0.424587,-7.02497 c 0.436317,-7.21944 4.641763,-22.503095 6.191924,-22.503095 1.043094,0 1.006594,-30.707958 -0.0373,-31.353104 -0.436557,-0.269811 -0.793744,0.02256 -0.793744,0.649714 0,0.627154 -0.472,1.532008 -1.048884,2.010786 -0.829797,0.688671 -1.718421,-0.595317 -4.254166,-6.146906 l -3.205272,-7.017412 -4.278596,-1.055512 c -5.35771,-1.321723 -17.597389,-1.334809 -21.54235,-0.02304 -2.609556,0.867728 -3.306,1.691204 -5.651984,6.682896 -1.471584,3.131271 -2.925963,6.407594 -3.231911,7.280719 -0.549279,1.56755 -0.570518,1.568138 -1.690204,0.04673 -0.623664,-0.847424 -1.139405,-2.097581 -1.14609,-2.778125 -0.01069,-1.088671 -0.104611,-1.094286 -0.781595,-0.04673 -1.012136,1.566169 -1.047566,31.749974 -0.03727,31.749974 1.593359,0 5.810491,15.289965 6.204575,22.495805 l 0.383796,7.0177 -2.458149,-1.27116 -2.458147,-1.27116 -0.222092,-10.04723 c -0.154755,-7.001 -0.514038,-10.14418 -1.185004,-10.36699 -0.529601,-0.17586 -1.189785,0.58418 -1.467072,1.68898 -0.277289,1.10481 -0.176658,16.93573 0.223623,35.17983 0.682183,31.09263 0.832054,33.4041 2.391855,36.88992 1.030665,2.30331 2.738996,4.41822 4.488098,5.55625 1.553219,1.01058 3.225935,2.79966 3.717156,3.97575 0.64562,1.54576 1.58642,2.22543 3.39494,2.45265 4.314467,0.54208 18.23867,0.57373 21.416322,0.0487 z M 55.750308,174.53847 c -2.69848,-0.37524 -5.828062,-1.2862 -6.954639,-2.02437 -3.411958,-2.23559 -3.412841,-3.59853 -0.01,-15.43481 0.288663,-1.00406 2.684295,-1.19062 15.288575,-1.19062 H 79.02046 l 1.335204,4.52969 c 0.734364,2.49134 1.335211,5.994 1.335211,7.7837 0,3.06708 -0.19379,3.33895 -3.373422,4.73294 -4.047886,1.77463 -15.48986,2.58762 -22.567152,1.60347 z M 42.003503,142.79179 c 0,-13.0826 0.117142,-14.28647 1.389062,-14.27534 3.303949,0.0289 3.558262,0.92024 3.195339,11.19932 -0.282025,7.98791 -0.675418,10.52722 -2.105875,13.59321 -0.967484,2.07367 -1.920941,3.77031 -2.118794,3.77031 -0.197852,0 -0.359732,-6.42937 -0.359732,-14.2875 z m 42.07492,10.51719 c -1.595811,-3.17082 -1.949861,-5.25579 -2.226608,-13.11269 -0.34634,-9.83239 0.14851,-11.692 3.111232,-11.692 1.402711,0 1.490301,0.83976 1.490301,14.2875 0,7.85813 -0.10742,14.2875 -0.238697,14.2875 -0.1313,0 -1.092604,-1.69664 -2.136228,-3.77031 z M 48.729319,111.00773 c -0.714144,-1.15552 -4.344566,-15.8496 -4.344566,-17.584599 0,-1.879354 4.757055,-5.314902 9.218485,-6.657594 5.155287,-1.551511 16.226166,-1.44095 21.477796,0.214495 2.334885,0.736013 5.402357,2.305185 6.816611,3.487055 l 2.571345,2.148856 -2.381238,9.411347 -2.381235,9.41138 -3.174982,-0.39688 c -4.925913,-0.61574 -21.097783,-0.46774 -24.345823,0.22279 -1.904849,0.40498 -3.102348,0.316 -3.456393,-0.25685 z"
          />
        </svg>
      </div>

      {/* input ranges - set testMode constant at the top of the page true to enable the below*/}
      {testMode && (
        <div style={{ display: `table-cell`, verticalAlign: `top` }}>
          <p id="FLL-Text">Front Left Left: </p>
          <input
            style={{ height: 15, width: 800 }}
            type="range"
            id="FLL-Input"
            onInput={() => adjustSensorGraphic(`FLL`, `side`)}
            min={0}
            max={31}
          />
          <p id="FCL-Text">Front Center Left: </p>
          <input
            style={{ height: 15, width: 800 }}
            type="range"
            id="FCL-Input"
            onInput={() => adjustSensorGraphic(`FCL`, `center`)}
            min={0}
            max={31}
          />
          <p id="FCR-Text">Front Center Right: </p>
          <input
            style={{ height: 15, width: 800 }}
            type="range"
            id="FCR-Input"
            onInput={() => adjustSensorGraphic(`FCR`, `center`)}
            min={0}
            max={31}
          />
          <p id="FRR-Text">Front Right Right: </p>
          <input
            style={{ height: 15, width: 800 }}
            type="range"
            id="FRR-Input"
            onInput={() => adjustSensorGraphic(`FRR`, `side`)}
            min={0}
            max={31}
          />
          <p id="BRR-Text">Back Right Right: </p>
          <input
            style={{ height: 15, width: 800 }}
            type="range"
            id="BRR-Input"
            onInput={() => adjustSensorGraphic(`BRR`, `side`)}
            min={0}
            max={31}
          />
          <p id="BCR-Text">Back Center Right: </p>
          <input
            style={{ height: 15, width: 800 }}
            type="range"
            id="BCR-Input"
            onInput={() => adjustSensorGraphic(`BCR`, `center`)}
            min={0}
            max={31}
          />
          <p id="BCL-Text">Back Center Left: </p>
          <input
            style={{ height: 15, width: 800 }}
            type="range"
            id="BCL-Input"
            onInput={() => adjustSensorGraphic(`BCL`, `center`)}
            min={0}
            max={31}
          />
          <p id="BLL-Text">Back Left Left: </p>
          <input
            style={{ height: 15, width: 800 }}
            type="range"
            id="BLL-Input"
            onInput={() => adjustSensorGraphic(`BLL`, `side`)}
            min={0}
            max={31}
          />
          <p id="all-Text">all: </p>
          <input
            style={{ height: 15, width: 800 }}
            type="range"
            id="all"
            onInput={() => allfunc()}
            min={0}
            max={31}
          />
          <p id="fillStrength-Text">Fill Strength: </p>
          <input
            style={{ height: 15, width: 800 }}
            type="range"
            id="fillStrength"
            onInput={() => fillStrengthFunc()}
            min={0}
            max={90}
          />
          <p id="SVGheight-Text">Height: </p>
          <input
            style={{ height: 15, width: 800 }}
            type="range"
            id="SVGheight"
            onInput={() => SVGDIM(`height`)}
            min={100}
            max={1200}
          />
          <p id="SVGwidth-Text">Width: </p>
          <input
            style={{ height: 15, width: 800 }}
            type="range"
            id="SVGwidth"
            onInput={() => SVGDIM(`width`)}
            min={50}
            max={600}
          />
          <p id="colour">Background colour </p>
          <input
            type="color"
            id="colorpicker"
            defaultValue="#ffffff"
            onInput={() => backColour()}
          />
        </div>
      )}
    </div>
  )
}

export default ParkingSensors
