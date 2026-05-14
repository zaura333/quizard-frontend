import { Box, Container } from '@mui/material'
import type { ReactNode } from 'react'
import AppBar from './AppBar'

interface Props {
  children: ReactNode
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

export default function Layout({ children, maxWidth = 'lg' }: Props) {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
      <AppBar />
      <Container maxWidth={maxWidth} sx={{ py: 4, flex: 1 }}>
        {children}
      </Container>
    </Box>
  )
}
