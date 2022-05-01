import React, { DependencyList, useEffect, useState } from "react";
import {
  Autocomplete,
  AutocompleteInputChangeReason,
  AutocompleteProps,
  CircularProgress,
  SvgIcon,
  TextField,
  useTheme,
} from "@mui/material";
import jsonp from "jsonp";
export interface MuiAutocompleteProps<T>
  extends Omit<
    AutocompleteProps<
      T,
      boolean | undefined,
      boolean | undefined,
      boolean | undefined
    >,
    | "renderInput"
    | "options"
    | "open"
    | "onOpen"
    | "onClose"
    | "loading"
    | "onInputChange"
  > {
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  textFieldClassName?: string;
  width?: string;
  widthWhenFocused?: string;
  variant?: "standard" | "filled" | "outlined";
  placeholder?: string;

  suggestSource?: "Google" | "Amazon" | "Manual";
  suggestDelaymsec?: number;

  onInputDoneDelaymsec?: number;
  onInputDone?: (
    event: React.ChangeEvent<{}>,
    value: string,
    reason?: AutocompleteInputChangeReason
  ) => void;
  onInputChange?: (
    event: React.ChangeEvent<{}>,
    value: string,
    reason?: AutocompleteInputChangeReason
  ) => void;

  options?: T[];
}

function MuiAutocomplete<T>(props: MuiAutocompleteProps<T>) {
  const {
    startAdornment,
    endAdornment,
    textFieldClassName,
    width,
    widthWhenFocused,
    variant,
    placeholder,
    suggestSource,
    suggestDelaymsec,
    onInputDoneDelaymsec,
    onInputDone,
    onInputChange,
    options,
    sx,
    ...baseProps
  } = props;
  const [open, setOpen] = useState(false);
  const [defaultOptions, setDefaultOptions] = useState([]);
  const loading = open && (options ?? []).length === 0;
  const theme = useTheme();
  useEffectAsync(async () => {
    if (
      !suggestSource ||
      suggestSource === "Amazon" ||
      suggestSource === "Google"
    ) {
      const q: string = String(baseProps.value);
      if (!q || q === "" || q === undefined) {
        setDefaultOptions([]);
        return;
      }

      const enq = encodeURI(String(baseProps.value));
      if (!suggestSource || suggestSource === "Google") {
        await lazy(async () => {
          jsonp(
            `https://www.google.com/complete/search?q=${enq}&client=firefox`,
            (error, data) => {
              setDefaultOptions(data[1]);
            }
          );
        }, suggestDelaymsec ?? 500);
      } else if (suggestSource === "Amazon") {
        await lazy(async () => {
          jsonp(
            `https://completion.amazon.co.jp/search/complete?mkt=6&method=completion&search-alias=aps&q=${enq}`,
            (error, data) => {
              setDefaultOptions(data[1]);
            }
          );
        }, suggestDelaymsec ?? 500);
      }
    }
  }, [baseProps.value]);

  function onLocalInputChanged(
    event: React.ChangeEvent<{}>,
    value: string,
    reason: AutocompleteInputChangeReason
  ) {
    if (onInputChange) {
      onInputChange(event, value, reason);
    }
    if (onInputDone) {
      lazy(() => {
        onInputDone(event, value, reason);
      }, onInputDoneDelaymsec ?? 500);
    }
  }

  return (
    <Autocomplete
      {...baseProps}
      options={options ?? defaultOptions}
      autoComplete={baseProps?.autoComplete ?? true}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      id={baseProps?.id ?? `ac-${uuidv4()}`}
      freeSolo={baseProps?.freeSolo ?? true}
      sx={{
        position: "relative",
        marginLeft: 0,
        width: props?.width,
        transition: theme.transitions.create("width"),
        "&.Mui-focused": {
          width: props?.widthWhenFocused,
        },
        ...sx,
      }}
      loading={loading}
      onInputChange={onLocalInputChanged}
      renderInput={(params) => (
        <TextField
          {...params}
          variant={props?.variant ?? "standard"}
          className={props?.textFieldClassName}
          InputProps={{
            ...params.InputProps,
            style: {
              paddingRight: 30,
            },
            placeholder: props?.placeholder ?? "Search…",
            startAdornment: props?.startAdornment ?? (
              <SvgIcon>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24"
                  viewBox="0 0 24 24"
                  width="24"
                >
                  <path d="M0 0h24v24H0z" fill="none" />
                  <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                </svg>
              </SvgIcon>
            ),
            endAdornment: (
              <>
                {loading
                  ? props?.endAdornment ?? (
                      <CircularProgress color="inherit" size={20} />
                    )
                  : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
}
export default MuiAutocomplete;

function useEffectAsync<T>(action: () => Promise<T>, deps?: unknown[]) {
  useEffect(() => {
    let unmount = false;
    let result: any;
    const asyncAction = async () => {
      if (unmount) return;

      try {
        result = await action();
      } catch (e) {
        console.error(e);
      }
    };
    asyncAction();
    return () => {
      if (unmount) return;
      unmount = true;

      if (result instanceof Function) {
        try {
          result();
        } catch {}
      }
    };
  }, deps);
}

var setTimeoutHandle: { [key: string]: any } = {};
export function lazy(action: Function, msec: number) {
  const key = action.toString();
  clearTimeout(setTimeoutHandle[key]);
  return new Promise((resolve, reject) => {
    setTimeoutHandle[key] = setTimeout(() => {
      resolve(action());
    }, msec);
  });
}

export function uuidv4() {
  let chars = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".split("");
  for (let i = 0, len = chars.length; i < len; i++) {
    switch (chars[i]) {
      case "x":
        chars[i] = Math.floor(Math.random() * 16).toString(16);
        break;
      case "y":
        chars[i] = (Math.floor(Math.random() * 4) + 8).toString(16);
        break;
    }
  }
  return chars.join("");
}