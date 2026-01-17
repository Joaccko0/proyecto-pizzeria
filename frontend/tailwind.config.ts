import type { Config } from "tailwindcss";

export default {
  theme: {
    extend: {
      colors: {
        "gray-dark": "var(--gray-dark)",
        "cream": "var(--cream)",
        "cream-dark": "var(--cream-dark)",
        "primary-red": "var(--primary-red)",
      },
    },
  },
} satisfies Config;
