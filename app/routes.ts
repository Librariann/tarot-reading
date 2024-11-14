import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("select-spread", "routes/select-spread.tsx"),
  route("draw-cards", "routes/draw-cards.tsx"),
  route("reading-result", "routes/reading-result.tsx"),
] satisfies RouteConfig;
