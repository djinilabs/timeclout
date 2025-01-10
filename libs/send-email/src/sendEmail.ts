const domain = "tt3.app";

export const sendEmail = async ({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text: string;
  html?: string;
}) => {
  const formData = new FormData();
  formData.append("from", `info@${domain}`);
  formData.append("to", to);
  formData.append("subject", subject);
  formData.append("text", text);
  if (html) {
    formData.append("html", html);
  }

  const response = await fetch(
    `https://api.eu.mailgun.net/v3/${domain}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(
          `api:${process.env.AUTH_MAILGUN_KEY}`
        ).toString("base64")}`,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to send email: ${response.statusText}`);
  }

  return response.json();
};
