// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import { StyledChart } from './components/chart';
import SnackbarProvider from './components/snackbar';
import { MotionLazyContainer } from './components/animate';

export default function App() {
  return (
    <MotionLazyContainer>
      <ThemeProvider>
        <SnackbarProvider>
          <StyledChart />
          <Router />
        </SnackbarProvider>
      </ThemeProvider>
    </MotionLazyContainer>
  );
}
