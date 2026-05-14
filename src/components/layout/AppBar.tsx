import {
  AppBar as MuiAppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  IconButton,
} from '@mui/material'
import QuizIcon from '@mui/icons-material/Quiz'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { logoutUser } from '../../store/authSlice'

export default function AppBar() {
  const { user, isLoggedIn, dispatch } = useAuth()
  const navigate = useNavigate()
  const [anchor, setAnchor] = useState<null | HTMLElement>(null)

  const handleLogout = async () => {
    setAnchor(null)
    await dispatch(logoutUser())
    navigate('/')
  }

  return (
    <MuiAppBar position="sticky" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', color: 'text.primary' }}>
      <Toolbar>
        <IconButton onClick={() => navigate('/')} sx={{ mr: 1 }} color="primary">
          <QuizIcon />
        </IconButton>
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, cursor: 'pointer', color: 'primary.main', fontWeight: 700 }}
          onClick={() => navigate('/')}
        >
          Quizard
        </Typography>

        {isLoggedIn ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button variant="outlined" size="small" onClick={() => navigate('/my-quizzes')}>
              Moje quizy
            </Button>
            <Button variant="contained" size="small" onClick={() => navigate('/quizzes/create')}>
              + Utwórz quiz
            </Button>
            <Avatar
              sx={{ width: 34, height: 34, bgcolor: 'primary.main', cursor: 'pointer', ml: 1 }}
              onClick={(e) => setAnchor(e.currentTarget)}
            >
              {user?.username?.[0]?.toUpperCase()}
            </Avatar>
            <Menu
              anchorEl={anchor}
              open={Boolean(anchor)}
              onClose={() => setAnchor(null)}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem disabled>
                <Typography variant="body2" color="text.secondary">
                  {user?.username} · {user?.role}
                </Typography>
              </MenuItem>
              <Divider />
              <MenuItem onClick={() => { setAnchor(null); navigate('/my-quizzes') }}>
                Moje quizy
              </MenuItem>
              <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                Wyloguj
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="text" onClick={() => navigate('/login')}>
              Zaloguj
            </Button>
            <Button variant="contained" onClick={() => navigate('/register')}>
              Zarejestruj
            </Button>
          </Box>
        )}
      </Toolbar>
    </MuiAppBar>
  )
}
