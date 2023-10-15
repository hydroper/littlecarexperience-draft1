import { useState, useEffect } from 'react';
import { Box, Button, Container, Dialog, Stack, Typography } from '@mui/material';
import Level from '@/app/level/Level';
import CurrentScreen from '@/app/CurrentScreen';

const { level } = Level;

export default function LevelUI({
  connecting,
  connectionFailed,
  setConnectionFailed,
  setCurrentScreen,
}: {
  connecting: boolean,
  connectionFailed: boolean,
  setConnectionFailed: (value: boolean) => void,
  setCurrentScreen: (value: CurrentScreen) => void,
}) {
  return (
    <>
      <Dialog
        open={connecting}
      >
        <Box p={5} minWidth={300}>
           <Typography variant="body1">Connecting</Typography>
        </Box>
      </Dialog>

      <Dialog
        open={connectionFailed}
        onClose={_ => { setCurrentScreen('servers') }}
      >
        <Box p={5} minWidth={300}>
          <Stack spacing={5} minWidth={300}>
            <Typography variant="body1" minWidth={300}>Connection failed</Typography>
            <Button variant="contained"
              onClick={_ => {
                setConnectionFailed(false);
                setCurrentScreen("servers");
              }}
            >
              Back
            </Button>
          </Stack>
        </Box>
      </Dialog>
    </>
  );
}