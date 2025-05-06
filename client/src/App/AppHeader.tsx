import {
  AppBar,
  Stack, Toolbar, Typography
} from '@mui/material';
import { UserDetailsButton } from './UserDetailsButton';
import { VersionId } from './VersionId';

export const AppHeader = ({ children }) => {
  return (
    <AppBar position="static"
    // style={{ maxHeight: '5em' }}
    >
      <Toolbar>
        <UserDetailsButton
        />
        <Stack
          direction={'row'}
          justifyContent="space-between"
          alignItems="center"
          // spacing={1}
          sx={{ flexGrow: 1 }}
        >
          <Stack
            direction={'row'}
            justifyContent="space-between"
            alignItems="center"
            spacing={1}
          >
            <Typography variant="h6" component="div">
              Argos
            </Typography>
            <VersionId
            />
          </Stack>
          {/* <Stack
                        direction={'row'}
                        justifyContent="space-between"
                        alignItems="center"
                    > */}
          {children}
          {/* </Stack> */}
        </Stack>
        {/* <Button color="inherit">Login</Button> */}
      </Toolbar>
    </AppBar>
  )
}