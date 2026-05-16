import Svg, { Path, Ellipse } from "react-native-svg";

export default function PawIcon({ size = 48, color = "#8B5E3C" }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {/* Top-left toe */}
      <Ellipse cx="28" cy="22" rx="10" ry="13" fill={color} />
      {/* Top-right toe */}
      <Ellipse cx="72" cy="22" rx="10" ry="13" fill={color} />
      {/* Mid-left toe */}
      <Ellipse cx="14" cy="42" rx="9" ry="12" fill={color} />
      {/* Mid-right toe */}
      <Ellipse cx="86" cy="42" rx="9" ry="12" fill={color} />
      {/* Main pad */}
      <Path
        d="M50 38 C28 38 18 52 20 68 C22 80 34 90 50 90 C66 90 78 80 80 68 C82 52 72 38 50 38Z"
        fill={color}
      />
    </Svg>
  );
}
