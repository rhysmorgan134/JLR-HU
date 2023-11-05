import Box from "@mui/material/Box";
import FastRewindIcon from '@mui/icons-material/FastRewind';
import FastForwardIcon from '@mui/icons-material/FastForward';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import ShuffleOnIcon from '@mui/icons-material/ShuffleOn';
import RepeatIcon from '@mui/icons-material/Repeat';
import AlbumIcon from '@mui/icons-material/Album';
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import IconButton from "@mui/material/IconButton";
import {useEffect, useState} from "react";
import {useStatusStore} from "../../../Store";



export default function AmFmAudioControls({sendMessage}) {
    const [width, setWidth] = useState(100);
    const [height, setHeight] = useState(100);
    //socket.emit("runFkt", {address: selectedFunction, type: chosenType.split("_")[0], instance: chosenType.split("_")[1], functionName: alignment})

    useEffect(() => {
        const resizeObserver = new ResizeObserver((event) => {
            // Depending on the layout, you may need to swap inlineSize with blockSize
            // https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserverEntry/contentBoxSize
            setWidth(event[0].contentBoxSize[0].inlineSize);
            setHeight(event[0].contentBoxSize[0].blockSize);
        });

        resizeObserver.observe(document.getElementById("AudioControls"));
    });


    const buttonClick = (e) => {
        console.log("skip pressed")
        e.nativeEvent.stopPropagation()
        e.stopPropagation()
        e.preventDefault()
    }


    const handleClick = (e, message) => {
        e.stopPropagation()
        sendMessage('seek', [message])
    }

    return(
        <Box sx={{display: 'flex', justifyContent: 'space-around', flexDirection: 'row'}} id={'AudioControls'}>
            <IconButton onClick={(e) => handleClick(e,0x31)}>
                <FastRewindIcon fontSize={'large'}  />
            </IconButton>
            {/*<IconButton>*/}
            {/*    {state === "Play" ? <PauseIcon fontSize={'large'} onClick={(e) => handleClick(e,'pause')}/> : <PlayArrowIcon fontSize={'large'} onClick={(e) => handleClick(e,'play')}/>}*/}
            {/*</IconButton>*/}
            <IconButton onClick={(e) => handleClick(e, 0x11)}>
                <FastForwardIcon fontSize={'large'} />
            </IconButton>
        </Box>
    )
}