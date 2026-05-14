import { Box, Button, Chip, Paper, Stack, Typography } from '@mui/material'
import DownloadIcon from '@mui/icons-material/Download'
import { useRef } from 'react'

export interface TierAssignment {
  poziom: string
  elementy: string[]
}

interface Props {
  poziomy: string[]
  assignments: TierAssignment[]
  quizTitle: string
}

const TIER_COLORS: Record<string, string> = {
  S: '#ff7675',
  A: '#fdcb6e',
  B: '#55efc4',
  C: '#74b9ff',
  D: '#a29bfe',
}

const getTierColor = (poziom: string) =>
  TIER_COLORS[poziom.toUpperCase()] ?? '#b2bec3'

export default function RankingResult({ poziomy, assignments, quizTitle }: Props) {
  const tierlistRef = useRef<HTMLDivElement>(null)

  const exportPng = async () => {
    if (!tierlistRef.current) return
    const { default: html2canvas } = await import('html2canvas')
    const canvas = await html2canvas(tierlistRef.current, { scale: 2 })
    const link = document.createElement('a')
    link.download = `${quizTitle.replace(/\s+/g, '_')}_tierlist.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <Box>
      <Box ref={tierlistRef} sx={{ bgcolor: '#1e1e2e', borderRadius: 2, p: 2, mb: 3 }}>
        <Typography
          variant="h6"
          textAlign="center"
          color="white"
          mb={2}
          fontWeight={700}
        >
          {quizTitle}
        </Typography>
        <Stack spacing={0.5}>
          {poziomy.map((poziom) => {
            const tier = assignments.find((a) => a.poziom === poziom)
            const color = getTierColor(poziom)
            return (
              <Box key={poziom} sx={{ display: 'flex', minHeight: 64, borderRadius: 1, overflow: 'hidden' }}>
                <Box
                  sx={{
                    width: 56,
                    bgcolor: color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Typography fontWeight={900} fontSize="1.5rem" color="#1e1e2e">
                    {poziom}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    flex: 1,
                    bgcolor: '#2d2d44',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    gap: 1,
                    p: 1,
                  }}
                >
                  {tier?.elementy.map((el) => (
                    <Chip
                      key={el}
                      label={el}
                      sx={{ bgcolor: color, color: '#1e1e2e', fontWeight: 600 }}
                    />
                  ))}
                  {(!tier || tier.elementy.length === 0) && (
                    <Typography color="grey.600" variant="body2">
                      —
                    </Typography>
                  )}
                </Box>
              </Box>
            )
          })}
        </Stack>
      </Box>

      <Button
        variant="contained"
        startIcon={<DownloadIcon />}
        onClick={exportPng}
        fullWidth
      >
        Pobierz tierlistę jako PNG
      </Button>
    </Box>
  )
}
