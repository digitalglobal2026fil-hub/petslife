import { AnimatedPet } from "./AnimatedPet";

/**
 * Mantido para compatibilidade — todos os ecrãs que já usavam
 * <PetIllustration /> passam automaticamente a mostrar as mascotes
 * ilustradas novas com a animação própria de cada espécie
 * (cão abana a cauda, pássaro voa, coelho salta, etc).
 */
export function PetIllustration({
  species,
  size = 64,
  animate = true,
}: {
  species?: string;
  size?: number;
  animate?: boolean;
}) {
  return <AnimatedPet species={species} size={size} animate={animate} />;
}
