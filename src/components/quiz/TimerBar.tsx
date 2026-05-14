import { Box, LinearProgress, Typography } from '@mui/material'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import { useTimer } from '../../hooks/useTimer'

interface Props {
  seconds: number
  onExpire: () => void
}

export default function TimerBar({ seconds, onExpire }: Props) {
  const { formatted, fraction } = useTimer(seconds, onExpire)
  const isLow = fraction < 0.2

  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
        <AccessTimeIcon fontSize="small" color={isLow ? 'error' : 'action'} />
        <Typography
          variant="body2"
          fontWeight={600}
          color={isLow ? 'error.main' : 'text.secondary'}
        >
          {formatted}
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={fraction * 100}
        color={isLow ? 'error' : 'primary'}
        sx={{ height: 6, borderRadius: 3 }}
      />
    </Box>
  )
}
