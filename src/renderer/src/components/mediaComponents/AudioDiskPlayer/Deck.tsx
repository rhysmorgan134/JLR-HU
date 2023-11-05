import Box from "@mui/material/Box";
import AlbumIcon from '@mui/icons-material/Album';
import {useStatusStore} from "../../../Store/store";
import Typography from "@mui/material/Typography";


export default function Deck({sendMessage}) {
    const disks = useStatusStore(state => state.AudioDiskPlayer.data.media.disk)
    const deckState = useStatusStore(state => state.AudioDiskPlayer.data.deck.state)

    const renderDisks = Object.keys(disks).map(key =>
            <AlbumIcon fontSize={'large'} key={key} color={disks[key].type > 0 ? '' : 'disabled'} onClick={() => sendMessage('setActiveDisk', [key])}/>
        )


    return (
        <Box sx={{display: 'flex'}}>
            {renderDisks}
            <Typography>{deckState}</Typography>
        </Box>
    )
}
