import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

// 아래처럼 config() 형태로 변경
const eslintConfig = [
  ...compat.config({
    extends: ["next/core-web-vitals"],
    rules: {
      "react/no-unescaped-entities": "off"
    }
  })
];

export default eslintConfig;
