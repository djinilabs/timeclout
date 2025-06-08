import { FC, memo, ReactNode } from "react";

const getColorAndBackground = (md5?: string | null) => {
  if (!md5) {
    return {
      background: "#fff",
      color: "#222",
    };
  }
  const matches = md5.match(/.{2}/g)!;

  const [red, green, blue] = matches.map((hex) => parseInt(hex, 16));

  const luminance = (red * 0.299 + green * 0.587 + blue * 0.114) / 255;

  const color = luminance > 0.6 ? "#222" : "#fff";

  return {
    background: `rgb(${[red, green, blue]})`,
    color,
  };
};

export interface ColorLabelProps {
  randomString: string;
  label: ReactNode;
  size?: number;
  ariaLabel?: string;
}

export const ColorLabel: FC<ColorLabelProps> = memo(
  ({ randomString, label, size = 30, ariaLabel }) => {
    const dimensions = {
      width: `${size}px`,
      minWidth: `${size}px`,
      maxWidth: `${size}px`,
      height: `${size}px`,
      minHeight: `${size}px`,
      maxHeight: `${size}px`,
    };

    const defaultLabel =
      typeof label === "string"
        ? `Colored circle representing ${label}`
        : "Colored circle indicator";

    return (
      <div
        className="relative inline-flex"
        role="img"
        aria-label={ariaLabel || defaultLabel}
        style={{
          ...getColorAndBackground(randomString),
          ...dimensions,
          borderRadius: "50%",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.15)",
        }}
      >
        {label}
      </div>
    );
  }
);
