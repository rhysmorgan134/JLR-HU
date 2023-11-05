import AlbumIcon from '@mui/icons-material/Album';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import AudioFileIcon from '@mui/icons-material/AudioFile';
import RadioIcon from '@mui/icons-material/Radio';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {SvgIcon} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {CellTower} from "@mui/icons-material";

export default function Title({title, type}) {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('md'))

    const renderIcon = () => {
        switch (type) {
            case 'song':
                return <MusicNoteIcon fontSize={matches ? 'large' : 'medium'}/>
            case 'album':
                return <AlbumIcon fontSize={matches ? 'large' : 'medium'}/>
            case 'track':
                return <AudioFileIcon fontSize={matches ? 'large' : 'medium'} />
            case 'radio':
                return <RadioIcon fontSize={matches ? 'large' : 'medium'}/>
            case 'frequency':
                return <CellTower fontSize={matches ? 'large' : 'medium'}/>
            default:
                return <MusicNoteIcon fontSize={matches ? 'large' : 'medium'}/>
        }
    }

    return(
        <Box sx={{display: 'flex', marginTop: '1rem'}}>
            <Box sx={{width: '20%', verticalAlign: 'center'}}/>
            {renderIcon()}
            <Typography align={'center'} sx={{verticalAlign: 'center', textAlign: 'center'}}>{title}</Typography>
        </Box>
    )
}