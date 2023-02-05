import { type ReactNode } from "react";
import { Footer } from "./footer";
import { Header } from "./header";

interface Props {
  children?: ReactNode;
}

export const Layout = ({ children, ...props }: Props) => {
  return (
    <div className="relative">
      <Header></Header>
      <main {...props}>{children}</main>
      <Footer></Footer>
    </div>
  );
};
