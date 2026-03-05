import { useNavigate } from "react-router";
import { HeroAnimation }   from "./HeroAnimation";
import { HeroAnimationV2 } from "./HeroAnimationV2";
import { FeatureShowcase }  from "./FeatureShowcase";

export function HeroAnimationPage() {
  const nav = useNavigate();
  return <HeroAnimation onBack={() => nav(-1)} />;
}

export function HeroAnimationV2Page() {
  const nav = useNavigate();
  return <HeroAnimationV2 onBack={() => nav(-1)} />;
}

export function FeatureShowcasePage() {
  const nav = useNavigate();
  return <FeatureShowcase onBack={() => nav(-1)} />;
}
