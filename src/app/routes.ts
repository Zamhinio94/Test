// routes.ts — plain TypeScript only, no JSX. All JSX wrappers are in RouteWrappers.tsx
import { createBrowserRouter, redirect } from "react-router";

// Desktop product pages
import { Dashboard }             from "./pages/Dashboard";
import { PhotoGallery }          from "./pages/PhotoGallery";
import { ProjectDetails }        from "./pages/ProjectDetails";

// Comparison / showcase / marketing pages
import { DockComparison }        from "./pages/DockComparison";
import { PhotoReviewComparison } from "./pages/PhotoReviewComparison";

// Framer embed — zero chrome, scales to iframe width
import { HeroEmbed }             from "./pages/HeroEmbed";

// Mobile prototype — the Snapchat-style phone showcase
import { MobileApp }             from "./pages/MobileApp";

// JSX wrapper components (useNavigate → onBack prop injection)
import {
  HeroAnimationPage,
  HeroAnimationV2Page,
  FeatureShowcasePage,
} from "./pages/RouteWrappers";

export const router = createBrowserRouter([
  // Default: redirect / → /prototype
  { path: "/",                   loader: () => redirect("/prototype") },

  // Mobile prototype
  { path: "/prototype",          Component: MobileApp             },

  // Desktop product
  { path: "/dashboard",          Component: Dashboard             },
  { path: "/gallery/:projectId", Component: PhotoGallery          },
  { path: "/project/:projectId", Component: ProjectDetails        },
  { path: "/dock-comparison",    Component: DockComparison        },
  { path: "/review-comparison",  Component: PhotoReviewComparison },
  { path: "/feature-showcase",   Component: FeatureShowcasePage   },

  // Hero animation standalone pages
  { path: "/hero-animation",     Component: HeroAnimationPage     },
  { path: "/hero-animation-v2",  Component: HeroAnimationV2Page   },

  // Framer iframe embed
  { path: "/hero",               Component: HeroEmbed             },
]);
