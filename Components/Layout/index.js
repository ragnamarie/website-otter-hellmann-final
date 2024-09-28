import styled from "styled-components";

export default function Layout({ children }) {
  return (
    <>
      <header></header>
      <main>{children}</main>
      <footer />
    </>
  );
}
