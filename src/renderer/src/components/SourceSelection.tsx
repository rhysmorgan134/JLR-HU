import { Box, Typography } from '@mui/material'
import RadioRoundedIcon from '@mui/icons-material/RadioRounded'
import AlbumRoundedIcon from '@mui/icons-material/AlbumRounded'
import UsbRoundedIcon from '@mui/icons-material/UsbRounded'
import PhoneIphoneRoundedIcon from '@mui/icons-material/PhoneIphoneRounded'
import { useAudioControlStore, useCarplayStore } from '../store/store'
import { useNavigate } from 'react-router-dom'

export default function SourceSelection({ onSelect = () => {} }: { onSelect?: () => void }) {
  const setSource = useAudioControlStore((state) => state.setSource)
  const carplayPlugged = useCarplayStore((state) => state.plugged)
  const navigate = useNavigate()
  const sources = [
    {
      name: 'Radio',
      detail: 'FM · AM',
      icon: <RadioRoundedIcon />,
      source: 'AmFmTuner',
      route: undefined,
      active: true
    },
    {
      name: 'CD Player',
      detail: '6-disc changer',
      icon: <AlbumRoundedIcon />,
      source: 'AudioDiskPlayer',
      route: undefined,
      active: true
    },
    {
      name: 'CarPlay',
      detail: carplayPlugged ? 'Phone connected' : 'Not connected',
      icon: <PhoneIphoneRoundedIcon />,
      source: 'carplay',
      route: '/carplay',
      active: carplayPlugged
    },
    {
      name: 'USB Audio',
      detail: 'Not connected',
      icon: <UsbRoundedIcon />,
      source: '',
      route: undefined,
      active: false
    }
  ]
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 1.5 }}>
      {sources.map((item) => (
        <Box
          key={item.name}
          className="touch-card"
          onClick={() => {
            if (item.active) {
              setSource(item.source)
              if (item.route) navigate(item.route)
              onSelect()
            }
          }}
          sx={{
            minHeight: 132,
            p: 2,
            borderRadius: 2.5,
            border: '1px solid var(--stroke)',
            background: item.active
              ? 'linear-gradient(145deg,rgba(45,61,79,.8),rgba(21,29,40,.8))'
              : 'rgba(255,255,255,.025)',
            opacity: item.active ? 1 : 0.45,
            cursor: item.active ? 'pointer' : 'default',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <Box
            sx={{
              color: item.active ? 'primary.main' : 'text.secondary',
              '& svg': { fontSize: 34 }
            }}
          >
            {item.icon}
          </Box>
          <Box>
            <Typography sx={{ fontSize: 17, fontWeight: 600 }}>{item.name}</Typography>
            <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{item.detail}</Typography>
          </Box>
        </Box>
      ))}
    </Box>
  )
}
