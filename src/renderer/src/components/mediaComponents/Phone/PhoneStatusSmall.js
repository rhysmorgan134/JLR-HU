import {Box, Typography} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import {
    Battery0Bar, Battery1Bar, Battery2Bar, Battery3Bar, Battery4Bar, Battery5Bar, Battery6Bar, BatteryFull, PhoneIphone,
    SignalCellular0Bar,
    SignalCellular1Bar,
    SignalCellular2Bar,
    SignalCellular3Bar,
    SignalCellular4Bar
} from "@mui/icons-material";


export default function PhoneStatusSmall() {
    const signalValue = 50
    const batteryValue = 70

    const renderSignal = () => {
        if(signalValue < 15) {
            return <SignalCellular0Bar fontSize={'large'}/>
        } else if(signalValue < 35) {
            return <SignalCellular1Bar fontSize={'large'}/>
        } else if(signalValue < 50) {
            return <SignalCellular2Bar fontSize={'large'}/>
        } else if(signalValue < 80) {
            return <SignalCellular3Bar fontSize={'large'}/>
        } else {
            return <SignalCellular4Bar fontSize={'large'}/>
        }
    }

    const renderBattery = () => {
        if(batteryValue < 15) {
            return <Battery0Bar fontSize={'large'}/>
        } else if(batteryValue < 30) {
            return <Battery1Bar fontSize={'large'}/>
        } else if(batteryValue < 45) {
            return <Battery2Bar fontSize={'large'}/>
        } else if(batteryValue < 60) {
            return <Battery3Bar fontSize={'large'}/>
        } else if(batteryValue < 75) {
            return <Battery4Bar fontSize={'large'}/>
        } else if(batteryValue < 90) {
            return <Battery5Bar fontSize={'large'}/>
        } else if(batteryValue < 95) {
            return <Battery6Bar fontSize={'large'}/>
        } else {
            return <BatteryFull fontSize={'large'}/>
        }
    }

    return(
        <Grid container  direction={'row'} id={'PhoneStatusSmall'} sx={{width: '100%'}}>
            <Grid xs={3} sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignContent: 'center'}}>
                <PhoneIphone sx={{fontSize: 90}} />
            </Grid>
            <Grid container direction={'column'} justifyContent={'space-around'} xs={9}>
                <Grid xs={12}>
                    <Box sx={{display: 'flex', justifyContent: 'space-around', width: '100%'}}>
                        {renderSignal()}
                        {renderBattery()}
                    </Box>
                </Grid>
                <Grid xs={12}>
                    <Box sx={{display: 'flex', justifyContent: 'space-around', width: '100%'}}>
                        <Typography>Rhys's IPhone 13 Pro</Typography>
                    </Box>
                </Grid>
                <Grid xs={12}>
                    <Box sx={{display: 'flex', justifyContent: 'space-around', width: '100%'}}>
                    </Box>
                </Grid>
            </Grid>

        </Grid>
    )
}