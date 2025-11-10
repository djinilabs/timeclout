const domain = "timeclout.com";

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
    // Add charset headers for Mailslurp compatibility
    formData.append("h:Content-Type", "text/html; charset=UTF-8");
    formData.append("h:Content-Transfer-Encoding", "8bit");
    formData.append("h:MIME-Version", "1.0");
  }

  const response = await fetch(
    `https://api.eu.mailgun.net/v3/${domain}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(
          `api:${process.env.MAILGUN_KEY}`
        ).toString("base64")}`,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    console.error(formData);
    console.error(response.status);
    console.error(response.statusText);
    console.error(await response.text());
    throw new Error(`Failed to send email: ${response.statusText}`);
  }

  const result = await response.json();

  return result;
};
