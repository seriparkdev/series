import { createStitches } from '@stitches/react';

export const { styled, css, getCssText, createTheme, globalCss } =
  createStitches({
    prefix: '',
    theme: {
      colors: {
        gray100: '#f6f6f6',
        gray200: '#ddd',
        gray300: '#a0aec0',
        gray400: '#68768a',
        gray500: '#495467',
        gray600: '#2d3748',
        gray700: '#1a202c',
        white: '#fff',
        black: '#000',
        yellow: '#ffd75e',
        yellowAccent: '#ffa659',

        primary100: '#C8E6C9',
        primary200: '#A5D6A7',
        primary300: '#81C784',
        primary400: '#66BB6A',
        primary500: '#4CAF50',

        text100: '$gray300',
        text200: '$gray400',
        text300: '$gray500',
        text400: '$gray600',
        text500: '$gray700',

        backgroundColor: '$white',

        borderGray: '$gray200',
        borderPrimary: '$primary200',

        inlineCodeBackground: '#C8E6C9',
        inlineCodeColor: '#2E3440',
        link: '$primary300',

        titleFilterBackground: '$gray100',
        tagColor: '$primary500',
        tagFilterBackground: '#e8f5e9',

        headerCircleColor: '$primary200',

        themeSwitchBackground: '$gray500',
      },
      sizes: {
        contentWidth: '43.75rem',
      },
      shadows: {
        themeSymbol: '$colors$gray400',
      },
      transitions: {
        transitionDuration: '0.2s',
        transitionTiming: 'ease-in',
        switchTransitionDuration: '0.1s',
      },
    },
    media: {
      md: '(min-width: 48em)',
    },
  });

export const darkTheme = createTheme('dark-theme', {
  colors: {
    gray100: '#303136',
    gray200: '#3d4144',
    gray300: '#d6cfc4',
    gray400: '#b8ae9f',
    gray500: '#cfc8bc',
    gray600: '#e5dfd6',
    gray700: '#f6f1ea',
    black: '#222425',

    primary100: '#C8E6C9',
    primary200: '#A5D6A7',
    primary300: '#81C784',
    primary400: '#66BB6A',
    primary500: '#4CAF50',

    text100: '$gray300',
    text200: '$gray400',
    text300: '$gray500',
    text400: '$gray600',
    text500: '$gray700',

    backgroundColor: '$black',

    borderGray: '$gray200',
    borderPrimary: '$primary200',

    link: '$primary200',

    titleFilterBackground: '$gray200',
    tagColor: '$primary400',
    tagFilterBackground: '$primary100',

    headerCircleColor: '$gray200',
  },
});
