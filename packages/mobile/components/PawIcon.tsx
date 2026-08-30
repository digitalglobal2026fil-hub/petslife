import Svg, { Ellipse, Path } from "react-native-svg";

/**
 * Patinha clássica (como o 🐾): 4 dedos juntinhos em arco por cima de uma
 * almofada arredondada. Os dedos de fora são inclinados para dentro — antes
 * estavam muito afastados e na horizontal, o que fazia parecer um caranguejo.
 */
export default function PawIcon({ size = 48, color = "#8B5E3C" }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {/* Dedo exterior esquerdo — inclinado para dentro */}
      <Ellipse cx="22" cy="46" rx="10" ry="13" fill={color} transform="rotate(-28 22 46)" />
      {/* Dedo interior esquerdo */}
      <Ellipse cx="39" cy="28" rx="10.5" ry="14" fill={color} transform="rotate(-12 39 28)" />
      {/* Dedo interior direito */}
      <Ellipse cx="61" cy="28" rx="10.5" ry="14" fill={color} transform="rotate(12 61 28)" />
      {/* Dedo exterior direito — inclinado para dentro */}
      <Ellipse cx="78" cy="46" rx="10" ry="13" fill={color} transform="rotate(28 78 46)" />
      {/* Almofada central */}
      <Path
        d="M50 52 C37 52 27 61 27 72 C27 82 36 89 50 89 C64 89 73 82 73 72 C73 61 63 52 50 52Z"
        fill={color}
      />
    </Svg>
  );
}
