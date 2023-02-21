import { options } from "https://esm.sh/preact@10.5.15";
import { setup } from "https://esm.sh/@twind/preact@1.0.5?deps=twind@0.16.16";
import { CSSRules, Falsy, strict, Token } from "https://esm.sh/twind@0.16.16";
import { virtualSheet } from "https://esm.sh/twind@0.16.16/sheets";
import * as colors from "https://esm.sh/twind@0.16.16/colors";

export const sheet = virtualSheet();

setup({
  theme: {
    fontFamily: {
      sans: ["Helvetica", "sans-serif"],
      serif: ["Times", "serif"],
    },
    extend: { colors },
  },
  mode: strict,
  sheet,
}, options);

declare module "https://esm.sh/preact@10.5.15" {
  namespace JSX {
    interface DOMAttributes<Target extends EventTarget> {
      tw?: Token;
      css?: CSSRules | Falsy;
      class?: string;
      className?: string;
    }
  }
}
