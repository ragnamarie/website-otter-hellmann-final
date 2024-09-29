import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  #__next {
    margin: 0;
    min-height: 100vh; /* Change min-height to min-height: 100vh */
    min-width: 100%;
    display: flex;
    flex-direction: column; /* Make sure the container is a column layout */
  }

  header {
  }

  /* if any layout stuff is weird delete this part */
  html,
  body {
    margin: 0;
    padding: 0;
    height: 100%;
  }
  /* if any layout stuff is weird delete this part */
  
  body {
    font-family: "Inter", sans-serif;
    font-optical-sizing: auto;
    font-style: normal;
  }

  main {
  }

  footer {
  } 

  li {
    list-style-type: none;
    font-weight: 400;
    font-size: 64px;
  }

  a {
    text-decoration: none;
    color: black;
  }

  h1 {
    font-weight: 400;
  } 

`;
