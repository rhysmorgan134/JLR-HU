import {Slider} from "@mui/material";
import {Buffer} from "buffer";
import Box from "@mui/material/Box";
import {AddCircle, PlusOne, RemoveCircle} from "@mui/icons-material";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";

//const marks = [{value: -3, label: '-3'}];

export default function AudioSlider({min, max, name, setValue, value, disabled=false}) {

    // useEffect(() => {
    //     console.log("Sending", "set" + name.charAt(0).toUpperCase() + name.slice(1))
    //   sendMessage("get" + name.charAt(0).toUpperCase() + name.slice(1), 'Amplifier')
    // }, [])

    const getMax = () => {
        let marks = []
        console.log(max - min)
        if((max - min) > 12) {
            for(let i=min; i<= max; i+=2) {
                marks.push({value: i, label: i.toString()})
            }
        } else {
            for(let i=min; i<= max; i++) {
                marks.push({value: i, label: i.toString()})
            }
        }
        return marks
    }

    const onChange = (e, value) => {
        console.log("sending", "set" + name.charAt(0).toUpperCase() + name.slice(1), 'Amplifier',  Buffer.from([value]))
        console.log(setValue)
        setValue(value + 1)
    }

    const increment = () => {
        if((value + 1) <= max) {
            setValue(value + 1)
        }
    }

    const decrement = () => {
        if((value - 1) >= min) {
            setValue(value - 1)
        }
    }

    function valuetext(value) {
        return `${value}°C`;
    }

    return (
        <Grid xs={12}>
            <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
                <Typography>{ name.charAt(0).toUpperCase() + name.slice(1)}</Typography>
            </Box>
            <Box display={"flex"}>
                <RemoveCircle fontSize={'large'} sx={{visibility: value <= min ? 'hidden' : '', marginLeft: '1rem', marginRight: '1rem'}} onClick={decrement}/>
                <Slider
                    aria-label="Custom marks"
                    defaultValue={0}
                    step={1}
                    min={min}
                    max={max}
                    valueLabelDisplay="auto"
                    getAriaValueText={valuetext}
                    onChange={onChange}
                    value={value}
                    marks={getMax()}
                    disabled={disabled}
                    sx={{marginLeft: '1rem', marginRight: '1rem'}}
                />
                <AddCircle fontSize={'large'} sx={{visibility: value >= max ? 'hidden' : '', marginLeft: '1rem', marginRight: '1rem'}} onClick={increment} />
            </Box>
        </Grid>


    )
}
