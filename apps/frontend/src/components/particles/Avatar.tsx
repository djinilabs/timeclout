import { memo } from "react";
import { getInitials } from "../../utils/getInitials";

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

export interface AvatarProps {
  name?: string;
  email?: string | null;
  emailMd5?: string | null;
  size?: number;
}

export const Avatar = memo(
  ({ name, emailMd5, email, size = 50 }: AvatarProps) => {
    const url = `https://www.gravatar.com/avatar/${emailMd5}?s=${String(
      Math.max(size, 250)
    )}&d=blank`;

    const initials = getInitials(name ?? email?.split("@")[0] ?? "");

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
        title={name ?? email ?? ""}
        className="relative inline-flex"
        style={{
          ...getColorAndBackground(emailMd5),
          ...dimensions,
          borderRadius: "50%",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.15)",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            fontSize: size / (1.4 * Math.max(initials.length, 2)),
            position: "absolute",
            fontFamily: "sans-serif",
            userSelect: "none",
          }}
        >
          {initials}
        </div>
        <img
          style={{
            position: "absolute",
            ...dimensions,
            top: 0,
            left: 0,
            borderRadius: "50%",
          }}
          src={url}
          alt={`${email ?? ""}’s avatar`}
        />
      </div>
    );
  }
);
