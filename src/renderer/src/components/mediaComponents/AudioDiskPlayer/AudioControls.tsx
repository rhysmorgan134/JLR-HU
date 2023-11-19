import Box from "@mui/material/Box";
import FastRewindIcon from '@mui/icons-material/FastRewind';
import FastForwardIcon from '@mui/icons-material/FastForward';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import ShuffleOnIcon from '@mui/icons-material/ShuffleOn';
import RepeatIcon from '@mui/icons-material/Repeat';
import RepeatOnIcon from '@mui/icons-material/RepeatOn';
import AlbumIcon from '@mui/icons-material/Album';
import IconButton from "@mui/material/IconButton";
import {useEffect, useState} from "react";
import { useAudioDiskPlayer } from "../../../store/store";
import { Button } from "@mui/material";



export default function AudioControls({sendMessage}) {
    const [width, setWidth] = useState(100);
    const [height, setHeight] = useState(100);
    const [deckState, setActiveDisk, nextTrack, prevTrack, setRandom, setRepeat, play, pause, shuffle, repeat] =
      useAudioDiskPlayer((state) => [
          state.deckState,
          state.setActiveDisk,
          state.nextTrack,
          state.prevTrack,
          state.setRandom,
          state.setRepeat,
        state.play,
        state.pause,
        state.shuffle,
        state.repeat
      ])
    // const state = useAudioDiskPlayer(state => state.deckState)
    // const shuffle = useAudioDiskPlayer(state => state.shuffle)
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

    const setShuffle = () => {
        switch (shuffle) {
            case 'off':
                setRandom('disk')
                break
            case 'disk':
                setRandom('magazine')
                break
            case 'magazine':
                setRandom('off')
                break
        }
    }

    const renderShuffle = () => {
        switch(shuffle) {
            case 'off':
                return <IconButton onClick={() => setShuffle()}><ShuffleIcon fontSize={'large'} /></IconButton>
            case 'disk':
                return <IconButton onClick={() => setShuffle()}><ShuffleOnIcon fontSize={'large'} /></IconButton>
            case 'magazine':
                return <IconButton onClick={() => setShuffle()}><ShuffleOnIcon fontSize={'large'} /><AlbumIcon /></IconButton>
        }
    }

    const setRepeatTemp = () => {
        switch (repeat) {
            case 'off':
                setRepeat('track')
                break
            case 'track':
                setRepeat('disk')
                break
            case 'disk':
                setRepeat('off')
                break
        }
    }

    const renderRepeat = () => {
        switch(repeat) {
            case 'off':
                return <IconButton onClick={() => setRepeatTemp()}><RepeatIcon fontSize={'large'} /></IconButton>
            case 'track':
                return <IconButton onClick={() => setRepeatTemp()}><RepeatOnIcon fontSize={'large'} /></IconButton>
            case 'disk':
                return <IconButton onClick={() => setRepeatTemp()}><RepeatIcon fontSize={'large'} /><AlbumIcon /></IconButton>
        }
    }


    return(
        <Box sx={{display: 'flex', justifyContent: 'space-around', flexDirection: 'row'}} id={'AudioControls'}>
            <IconButton onClick={() => prevTrack()}>
                <FastRewindIcon fontSize={'large'}  />
            </IconButton>
            <IconButton>
                {deckState !== "Play" ? <PauseIcon fontSize={'large'} onClick={(e) => play()}/> : <PlayArrowIcon fontSize={'large'} onClick={(e) => play()}/>}
            </IconButton>
            <IconButton onClick={() => nextTrack()}>
                <FastForwardIcon fontSize={'large'} />
            </IconButton>
            {width > 500 ? renderShuffle(): null}
            {width > 500 ? renderRepeat() : null}
        </Box>
    )
}
