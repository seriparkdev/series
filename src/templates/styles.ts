import { styled } from '~/stitches.config';

export const Article = styled('article', {
  position: 'relative',

  '& .heading-anchor': {
    borderBottom: 0,

    svg: {
      fill: '$text500',
    },
  },
});

export const TableOfContents = styled('div', {
  marginBottom: '5rem',

  '> ul': {
    marginLeft: 0,
  },

  ul: {
    listStyle: 'none',

    li: {
      paddingTop: '0.125rem',
      paddingBottom: '0.125rem',
      marginBottom: '0.5rem',

      color: '$text200',
      fontSize: '0.875rem',

      transition: 'color $transitionDuration $transitionTiming',
      a: {
        textDecoration: 'underline',
        fontSize: '1rem',
      },
    },
  },
});

export const Header = styled('header', {
  marginBottom: '2rem',
});

export const Title = styled('h1', {
  fontSize: '2rem',
  lineHeight: '1.4',
});

export const ArticleMetadata = styled('div', {
  display: 'flex',
  alignItems: 'center',
  marginTop: '0.5rem',

  color: '$text200',

  fontWeight: 700,

  transition: 'color $transitionDuration $transitionTiming',
});

export const Content = styled('section', {
  minWidth: '100%',
  wordBreak: 'break-all',
  fontWeight: 400,
  fontSize: '1.1rem',

  p:{
    strong:{
      fontWeight: 600
    },
    lineHeight: '1.9',
  },
  h1: {
    marginTop: '5rem',
    marginBottom: '1.25rem',
    paddingBottom: '0.25rem',
    borderBottom: '2px solid $gray200',

    a: {
      borderBottom: 'none',
    },
  },
  h2: {
    width: 'fit-content',
    marginTop: '3.5rem',
    marginBottom: '1rem',
    paddingBottom: '0.25rem',
    borderBottom: '2px solid $gray200',

    a: {
      borderBottom: 'none',
    },
  },
  h3: {
    marginTop: '3rem',
  },
  a: {
    borderBottom: '1px solid $borderPrimary',

    color: '$link',

    transition: 'color $transitionDuration $transitionTiming, border-bottom-color $transitionDuration $transitionTiming',
  },
  pre: {
    code: {
      wordBreak: 'break-all',
      overflowWrap: 'break-word',
      float: 'left',
      textSizeAdjust: '100%',
      minWidth: '100%', },
  },
  'pre, code': {
    fontVariantLigatures: 'none',
  },
  li: {
    fontSize: '1.1rem',
    lineHeight: '1.9',
  },
  blockquote: {
    margin: '1.5rem 0',
    fontStyle: 'italic',
    color: '$text200',
  },
  '.gatsby-highlight': {
    fontSize: '14px',
    code: {
      display: 'block',
      width: '600px',
    },
  },
  '.gatsby-highlight-code-line': {
    display: 'table',
    minWidth: 'calc(100% + 1.75em * 2)',
    marginLeft: '-1em',
    paddingLeft: '1.75em',
    backgroundColor: '#3d485a',
    borderLeft: '0.25em solid #aad5ff',
  },
});

export const Footer = styled('footer', {
  '&:before': {
    display: 'block',
    width: '100%',
    height: '0.2rem',
    margin: '3rem auto',

    backgroundColor: '$primary200',

    transition: 'background-color $transitionDuration $transitionTiming',

    content: '',
  },
});