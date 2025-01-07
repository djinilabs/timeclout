export const getColorAndBackground = (md5: string) => {
  const matches = md5.match(/.{2}/g)!;

  const [red, green, blue] = matches.map((hex) => parseInt(hex, 16));

  const luminance = (red * 0.299 + green * 0.587 + blue * 0.114) / 255;

  const color = luminance > 0.6 ? "#222" : "#fff";

  return {
    background: `rgb(${[red, green, blue]})`,
    color,
  };
};

export const getInitials = (name: string) => {
  name = name.trim();

  if (name.length <= 3) return name;

  return name
    .split(/[\s\.]+/)
    .map((w) => w[0])
    .slice(0, 3)
    .join("")
    .toUpperCase();
};

export interface AvatarProps {
  email: string;
  emailMd5: string;
  size?: number;
}

export const Avatar = ({ emailMd5, email, size = 50 }: AvatarProps) => {
  const url = `https://www.gravatar.com/avatar/${emailMd5}?s=${String(
    Math.max(size, 250)
  )}&d=blank`;

  const initials = getInitials(email.split("@")[0]);

  return (
    <div
      className="relative inline-flex"
      style={{
        ...getColorAndBackground(emailMd5),
        width: `${size}px`,
        height: `${size}px`,
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
          width: size,
          height: size,
          top: 0,
          left: 0,
          borderRadius: "50%",
        }}
        src={url}
        alt={`${email}’s avatar`}
      />
    </div>
  );
};
