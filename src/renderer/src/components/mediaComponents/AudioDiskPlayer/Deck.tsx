import Box from '@mui/material/Box'
import AlbumIcon from '@mui/icons-material/Album'
import { useAudioDiskPlayer } from '../../../store/store'
import Typography from '@mui/material/Typography'

export default function Deck() {
  const [disks, deckState, setActiveDisk] =
    useAudioDiskPlayer((state) => [
      state.disks,
      state.deckState
    ])

  const renderDisks = Object.keys(disks).map((key) => (
    <AlbumIcon
      fontSize={'large'}
      key={key}
      color={disks[key].type > 0 ? '' : 'disabled'}
      onClick={() => setActiveDisk(parseInt(key))}
    />
  ))

  return (
    <Box sx={{ display: 'flex' }}>
      {renderDisks}
      <Typography>{deckState}</Typography>
    </Box>
  )
}
