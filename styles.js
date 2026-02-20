import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`

  @font-face {
    font-family: "Atico";
    src: url("/fonts/Atico-Thin.otf") format("opentype");
    font-weight: 100;
    font-style: normal;
  }

  @font-face {
    font-family: "Atico";
    src: url("/fonts/Atico-Light.otf") format("opentype");
    font-weight: 300;
    font-style: normal;
  }

  @font-face {
    font-family: "Atico";
    src: url("/fonts/Atico-Regular.otf") format("opentype");
    font-weight: 400;
    font-style: normal;
  }

  @font-face {
    font-family: "Atico";
    src: url("/fonts/Atico-Text.otf") format("opentype");
    font-weight: 450; /* between regular and medium */
    font-style: normal;
  }

  @font-face {
    font-family: "Atico";
    src: url("/fonts/Atico-SemiBold.otf") format("opentype");
    font-weight: 600;
    font-style: normal;
  }

  @font-face {
    font-family: "Atico";
    src: url("/fonts/Atico-Bold.otf") format("opentype");
    font-weight: 700;
    font-style: normal;
  }

  @font-face {
    font-family: "Atico";
    src: url("/fonts/Atico-ExtraBold.otf") format("opentype");
    font-weight: 800;
    font-style: normal;
  }

  @font-face {
    font-family: "Atico";
    src: url("/fonts/Atico-Heavy.otf") format("opentype");
    font-weight: 900;
    font-style: normal;
  }

  @font-face {
    font-family: "Atico";
    src: url("/fonts/Atico-Black.otf") format("opentype");
    font-weight: 950; /* heavier than 900 */
    font-style: normal;
  }


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
    font-family: "Atico", sans-serif;
    font-optical-sizing: auto;
    font-style: normal;
    font-weight: 700;
  }

  main {
    background-size: cover !important; /* Ensures the image covers the entire background */
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

`;
