import { PropsWithChildren } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Se connecter",
};

export default function Layout({ children }: PropsWithChildren) {
  return children;
}
