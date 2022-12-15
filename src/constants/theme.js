const theme = (themeMode = "dark") => ({
  palette: {
    mode: themeMode,
    type: themeMode,

    primary: {
      main: "#1E88E5",
      dark: "#155FA0",
      light: "#4B9FEA",
    },
    secondary: {
      main: "#BA68C8",
      dark: "#82488C",
      light: "#C786D3",
    },
    tertiary: {
      main: "#068C0B",
      dark: "#046207",
      light: "#37A33B",
    },
    warning: {
      main: "#D47905",
      dark: "#945403",
      light: "#DC9337",
    },
    success: {
      main: "#068c0b",
    },
    error: {
      main: "#F44336",
      dark: "#D32F2F",
      light: "#E57373",
    },

    text: {
      primary: "#F5F5F5",
      disabled: "#919191",
    },
    divider: "#D0D0D0",
    background: {
      default: "#232323",
      card: "#303030",
      paper: "#424242",
    },
    action: {
      // disabledBackground: "rgba(21, 95, 160, 0.51)",
    },
  },
  shape: {
    borderRadius: "8px",
  },
  typography: {
    fontFamily: "Quicksand",
    h1: {
      fontSize: "2.2rem",
    },
    h2: {
      fontSize: "2.2rem",
    },
    body1: {
      fontSize: "2.2rem",
    },
    body2: {
      fontSize: "2.2rem",
    },

    button: {
      fontSize: "2.2rem",
      textTransform: "none",
    },
  },
  components: {
    MuiButtonBase: {
      root: { disableRipple: true },
    },
    MuiButton: {
      disableRipple: true,
      styleOverrides: {
        root: ({ ownerState, theme }) => ({
          ...(ownerState.variant === "contained" && {
            height: "56.44px", //Account for the border height added for the outlined buttons
            "&:hover": {
              backgroundColor: theme.palette[ownerState.color].light,
            },
            "&:disabled": {
              color: theme.palette.text.disabled,
              backgroundColor: theme.palette[ownerState.color].dark,
            },
          }),
          ...(ownerState.variant === "outlined" && {
            border: "4px solid",
            "&:hover": {
              border: "4px solid",
              color: theme.palette[ownerState.color].light,
            },
            "&:disabled": {
              border: `4px solid ${theme.palette[ownerState.color].dark}`,
              color: theme.palette.text.disabled,
            },
          }),
        }),
      },
      variants: [
        {
          props: { variant: "buttonWithIcon" },
          style: ({ ownerState, theme }) => ({
            fontSize: "2rem",
            color: theme.palette.text.primary,
            padding: "0px",
          }),
        },
      ],
    },

    MuiFormHelperText: {
      styleOverrides: {
        root: {
          fontSize: "1.4rem",
        },
      },
    },

    MuiIconButton: {
      styleOverrides: {
        root: ({ ownerState, theme }) => ({
          ...(ownerState.variant === "outlined" && {
            border: `2px solid ${theme.palette[ownerState.color].main}`,
            width: "45px",
            height: "45px",

            "&:hover": {
              border: `2px solid ${theme.palette[ownerState.color].light}`,
            },
            "&:disabled": {
              border: `2px solid ${theme.palette[ownerState.color].dark}`,
            },
          }),
        }),
      },
    },

    MuiDrawer: {
      styleOverrides: {
        paper: ({ ownerState, theme }) => ({
          backgroundColor: theme.palette.background.default,
          justifyContent: "space-between",
          overflowX: "hidden",
        }),
      },
    },

    MuiList: {
      variants: [
        {
          props: { variant: "menu" },
          style: ({ ownerState, theme }) => ({
            paddingTop: "0px",
            width: "350px",
          }),
        },
      ],
    },

    MuiListItem: {
      variants: [
        {
          props: { variant: "menu-header" },
          style: ({ ownerState, theme }) => ({
            backgroundColor: theme.palette.background.card,
            justifyContent: "center",
          }),
        },
        {
          props: { variant: "menu-item" },
          style: ({ ownerState, theme }) => ({
            cursor: "pointer",
            "&:hover": {
              backgroundColor: "rgba(30, 136, 229, 0.16)",
            },
          }),
        },
      ],
    },

    MuiDivider: {
      variants: [
        {
          props: { variant: "menu" },
          style: ({ ownerState, theme }) => ({
            borderColor: theme.palette.text.disabled,
            width: "95%",
            margin: "auto",
            paddingTop: "2.5rem",
          }),
        },
        {
          props: { variant: "device" },
          style: ({ ownerState, theme }) => ({
            borderColor: theme.palette.text.disabled,
            width: "95%",
            margin: "auto",
            paddingTop: "1rem",
          }),
        },
      ],
    },

    MuiDialog: {
      styleOverrides: {
        paper: ({ ownerState, theme }) => ({
          backgroundColor: theme.palette.background.card,
          backgroundImage: "none",
          width: "725px",
          height: "580px",
          padding: "2rem 3rem",
          ...(ownerState.variant === "large" && {
            maxWidth: "unset",
            width: "1050px",
            height: "685px",
          }),
        }),
      },
    },

    // MuiDialogTitle: {
    //   styleOverrides: {
    //     root: {
    //       fontSize: "3.2rem",
    //       fontWeight: "bold",
    //       textAlign: "center",
    //       // paddingBottom: "2rem",
    //       // padding: "1rem",
    //       padding: 0,

    //       "& .MuiDialogContent-root": {
    //         paddingTop: "2rem",
    //       },
    //     },
    //   },
    // },
    // MuiDialogContent: {
    //   styleOverrides: {
    //     root: {
    //       padding: 0,
    //       paddingTop: "1rem",
    //     },
    //   },
    // },
    // MuiDialogActions: {
    //   styleOverrides: {
    //     root: {
    //       padding: 0,
    //     },
    //   },
    // },

    MuiMenu: {
      variants: [
        {
          props: { variant: "medium-length" },
          style: {
            maxHeight: "300px",
          },
        },
        {
          props: { variant: "long" },
          style: {
            maxHeight: "450px",
          },
        },
      ],
    },

    MuiCheckbox: {
      variants: [
        {
          props: { variant: "left" },
          style: {
            paddingLeft: "0px",
          },
        },
        {
          props: { variant: "table" },
          style: {
            padding: "0px",
          },
        },
      ],
    },

    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: "4px",
          "&:hover": {
            backgroundColor: "rgba(30, 136, 229, 0.16)",
          },
          "&.Mui-selected": { backgroundColor: "rgba(30, 136, 229, 0.36)" },
        },
      },
      variants: [
        {
          props: { variant: "withCheckbox" },
          style: {
            "&.Mui-selected": { backgroundColor: "unset" },
          },
        },
      ],
    },

    MuiTable: {
      styleOverrides: { root: { tableLayout: "fixed" } },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.background.card,
          backgroundImage: "none",
          boxShadow: "none",
          border: `1px solid ${theme.palette.background.paper}`,
          width: "auto",
        }),
      },
    },

    MuiTableRow: {
      styleOverrides: {
        root: ({ ownerState, theme }) => ({
          height: ownerState.dense ? "50px" : "60px",
          cursor: "pointer",
        }),
        head: {
          height: "120px",
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: "0.8rem",
          userSelect: "none",
        },
      },
    },

    MuiSelect: {
      styleOverrides: {
        // select: {
        //   "&.MuiInputBase-input": {
        //     maxWidth: "100px",
        //   },
        // },
        icon: {
          width: "30px",
          height: "30px",
          top: "calc(50% - 15px)",
        },
      },
    },

    MuiSlider: {
      styleOverrides: {
        root: {
          width: "80%",
          justifySelf: "center",
        },
        markLabel: ({ ownerState, theme }) => ({
          fontSize: "1.6rem",
          "&[data-index]": {
            top: ownerState.dense ? "25px" : "35px",
          },
        }),
        valueLabel: ({ ownerState, theme }) => ({
          fontSize: "1.6rem",
          lineHeight: "1.2",
          top: "-5px",
          backgroundColor: theme.palette[ownerState.labelColor].dark,
        }),
      },
    },

    MuiStepIcon: {
      styleOverrides: {
        root: {
          height: "35px",
          width: "35px",
          "&>text": {
            fontSize: "1.6rem",
          },
        },
      },
    },
    MuiStepLabel: {
      styleOverrides: {
        alternativeLabel: {
          marginTop: "0px",
        },
      },
    },

    MuiInputAdornment: {
      styleOverrides: {
        root: {
          "& > MuiIconButton": {
            backgroundColor: "red",
          },
        },
        MuiIconButton: {
          backgroundColor: "red",
        },
      },
    },

    MuiCircularProgress: {
      styleOverrides: {
        root: ({ ownerState, theme }) => ({
          color: theme.palette.text.primary,
          width: "30px",
          height: "30px",
          position: "absolute",
          top: "50%",
          left: "50%",
          marginTop: "-15px",
          marginLeft: "-15px",
        }),
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "rgba(74 ,74, 74,0.92)",
          fontSize: "1.2rem",
        },
      },
    },
  },
});

export default theme;
