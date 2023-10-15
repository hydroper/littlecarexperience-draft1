'use client';

import { useState, useEffect } from 'react';
import { Box, Button, Container, Dialog, Stack, Typography } from '@mui/material';
import { Auth } from '@/app/Auth';
import SigIn from '@/components/SigIn/SigIn';
import LevelUI from '@/components/LevelUI/LevelUI';
import Level from '@/app/level/Level';
import CurrentScreen from '@/app/CurrentScreen';
import '@/app/input';
import { Input } from "@/app/inputHandling";

const movingDirections = {
  left: false,
  right: false,
  up: false,
  down: false,
};

window.addEventListener('keydown', evt => {
  const { level } = Level;
  movingDirections.left ||= Input.isPressed("moveLeft");
  movingDirections.right ||= Input.isPressed("moveRight");
  movingDirections.up ||= Input.isPressed("moveUp");
  movingDirections.down ||= Input.isPressed("moveDown");
  if (level.connected) {
    level.socket!.sendMovingDirections(movingDirections);
  }
});

window.addEventListener('keyup', evt => {
  const { level } = Level;
  movingDirections.left &&= !Input.isPressed("moveLeft");
  movingDirections.right &&= !Input.isPressed("moveRight");
  movingDirections.up &&= !Input.isPressed("moveUp");
  movingDirections.down &&= !Input.isPressed("moveDown");
  if (level.connected) {
    level.socket!.sendMovingDirections(movingDirections);
  }
});

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<CurrentScreen>('level');
  const [connecting, setConnecting] = useState(false);
  const [connectionFailed, setConnectionFailed] = useState(false);
  const [auth, setAuth] = useState<Auth | null>(null);

  const backToServers = () => {
    setCurrentScreen('servers');
  };

  useEffect(() => {
    const { level } = Level;
    if (currentScreen == 'level') {
      level.play({
        backToServers,
        setConnecting,
        setConnectionFailed,
      });
    } else {
      level.stop();
    }
  }, [currentScreen]);

  return (
    <>
      <main className="flex flex-col items-center justify-center w-full h-full page-background">
        { currentScreen == 'level' ? <div id="levelContainer"></div> : null }
        <Container>
          <Box>
            { currentScreen == 'sigIn' ? <SigIn setAuth={setAuth}/> : null }
            { currentScreen == 'level' ?
              <LevelUI
                connecting={connecting}
                connectionFailed={connectionFailed}
                setConnectionFailed={setConnectionFailed}
                setCurrentScreen={setCurrentScreen}
              />
              : null
            }
          </Box>
        </Container>
      </main>
    </>
  )
}