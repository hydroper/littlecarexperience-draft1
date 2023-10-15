import { Card, CardHeader, CardContent, TextField, Typography, Button } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Auth } from '@/app/Auth';

const usernameMaxLength = 25;
const passwordMaxLength = 255;

export default function SigIn({setAuth}: {
  setAuth: (auth: Auth) => void,
}) {
  return (
    <Card>
      <CardContent>
        <div className="flex flex-col gap-4">
        <Typography variant="subtitle2">Please sign in to your CarBang account before playing</Typography>
          <TextField required id="username" label="Username"/>
          <TextField required id="password" type="password" label="Password" autoComplete="current-password"/>
          <Button variant="contained">Sig in</Button>
        </div>
      </CardContent>
    </Card>
  );
}