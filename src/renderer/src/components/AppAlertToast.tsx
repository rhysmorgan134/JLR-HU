import { useEffect, useState } from 'react'
import { Alert, AlertTitle, Snackbar } from '@mui/material'
import { socket, useCarplayStore } from '../store/store'

type AppAlert = {
  title: string
  message: string
  severity?: 'warning' | 'error'
}

export default function AppAlertToast() {
  const enabled = useCarplayStore((state) => state.settings?.showErrorToasts !== false)
  const [alert, setAlert] = useState<(AppAlert & { key: number }) | null>(null)

  useEffect(() => {
    const receiveAlert = (nextAlert: AppAlert) => {
      if (enabled) setAlert({ ...nextAlert, key: Date.now() })
    }
    socket.on('appAlert', receiveAlert)
    return () => {
      socket.off('appAlert', receiveAlert)
    }
  }, [enabled])

  useEffect(() => {
    if (!enabled) setAlert(null)
  }, [enabled])

  return <Snackbar
    key={alert?.key}
    open={Boolean(alert)}
    autoHideDuration={6000}
    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    onClose={() => setAlert(null)}
    sx={{ mt: 5.5, maxWidth: 430 }}
  >
    <Alert
      severity={alert?.severity || 'error'}
      variant="filled"
      onClose={() => setAlert(null)}
      sx={{ width: '100%', boxShadow: '0 14px 36px rgba(0,0,0,.48)' }}
    >
      <AlertTitle sx={{ mb: .25, fontWeight: 700 }}>{alert?.title}</AlertTitle>
      {alert?.message}
    </Alert>
  </Snackbar>
}
