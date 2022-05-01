import { createTheme, CssBaseline, PaletteMode, ThemeProvider } from "@mui/material";
import { useState } from "react";
import ModeSwitch from "./modeSwitch";

type Props = {
  children: any;
};

const MuiTeme: React.FC<Props> = (props) => {
  const { children } = props;
  const [mode, setMode] = useState<PaletteMode>("light");
  const theme = createTheme({
    palette: {
      mode: mode,
    },
  });
  return (
    <>
      <ModeSwitch mode={mode} onChange={(v) => setMode(v)} />
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </>
  );
};

export default MuiTeme;
