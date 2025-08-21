// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import asap from "@architect/asap";

import { handlingErrors } from "../../utils/handlingErrors";

export const handler = handlingErrors(
  asap({
    spa: true,
  })
);
