import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  const seoulOpenApiKey = env.VITE_SEOUL_OPENAPI_KEY ?? "";

  return {
    plugins: [react()],
    server: {
      proxy: {
        "/seoul-openapi": {
          target: "http://swopenapi.seoul.go.kr",
          changeOrigin: true,
          rewrite: (path) =>
            path.replace(
              /^\/seoul-openapi/,
              `/api/subway/${seoulOpenApiKey}`,
            ),
        },
      },
    },
  };
});
