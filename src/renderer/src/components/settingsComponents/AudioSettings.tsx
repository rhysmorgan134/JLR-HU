import Grid from "@mui/material/Unstable_Grid2";
import AudioSlider from "./AudioSlider";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import { socketActions} from "../../store/store";


export default function AudioSettings() {

    const mode = 'stereo'
    const sendMessage = socketActions(state => state.actions.sendMessage)

    const handleChange = (e, alignment) => {
        console.log(alignment, e)
        sendMessage('setAudioMode', 'Amplifier', alignment)
    }

    return (
        <Grid container sx={{overflow: 'hidden'}} spacing={0.5}>

            <Grid xs={6}>
                <AudioSlider min={-6} max={6} name={'bass'}/>
            </Grid>
            <Grid xs={6} sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <ToggleButtonGroup
                    value={mode}
                    exclusive
                    onChange={handleChange}
                >
                    <ToggleButton value={'stereo'}>STEREO</ToggleButton>
                    <ToggleButton value={'3Channel'}>3 CHANNEL</ToggleButton>
                    <ToggleButton value={'dolbyProLogic'}>DOLBY PLII</ToggleButton>
                </ToggleButtonGroup>
            </Grid>
            <Grid xs={6}>
                <AudioSlider min={-6} max={6} name={'treble'}/>
            </Grid>
            <Grid xs={6}>
                <AudioSlider min={0} max={20} name={'subwoofer'}/>
            </Grid>
            <Grid xs={6}>
                <AudioSlider min={-10} max={10} name={'fader'}/>
            </Grid>
            <Grid xs={6}>
                <AudioSlider min={-10} max={10} name={'balance'}/>
            </Grid>
            {mode !== 'stereo' ?
                <Grid xs={6}>
                    <AudioSlider min={-6} max={6} name={'centre'} />
                </Grid> : <Grid xs={6}></Grid>
            }
            {mode === 'dolbyProLogic' ?
                <Grid xs={6}>
                    <AudioSlider min={-6} max={6} name={'surround'} />
                </Grid> : <Grid xs={6}></Grid>
            }
        </Grid>
    )
}
