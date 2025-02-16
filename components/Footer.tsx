import { PropsWithChildren } from "react";
import { ThemedText } from "./ThemedText";

type Props = PropsWithChildren<{
  textColor: string;
  backgroundColor: string;
}>;

export function Footer({ textColor, backgroundColor }: Props) {
  return (
    <ThemedText
      style={{
        color: textColor,
        backgroundColor: backgroundColor,
        paddingVertical: 8,
      }}
    >
      This app was created for learning purposed for a workshop at Boston
      University Spark! on February 19, 2025.
    </ThemedText>
  );
}
