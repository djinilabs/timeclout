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
  label: string;
  size?: number;
}

export const ColorLabel = ({
  randomString,
  label,
  size = 30,
}: ColorLabelProps) => {
  const dimensions = {
    width: `${size}px`,
    minWidth: `${size}px`,
    maxWidth: `${size}px`,
    height: `${size}px`,
    minHeight: `${size}px`,
    maxHeight: `${size}px`,
  };

  return (
    <div
      className="relative inline-flex"
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
};
