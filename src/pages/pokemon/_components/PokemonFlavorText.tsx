import styles from "@/styles/PokemonCard.module.css";
import { FlavorTextForVersion } from "@/types/index";
import FlavorText, { DualFlavorText } from "./FlavorText";
import convertKebabCaseToTitleCase from "@/utils/convertKebabCaseToTitleCase";
import PokeballSpans from "@/components/common/PokeballSpans";

type PokemonFlavorTextProps = {
  flavorTextForVersion: FlavorTextForVersion;
  flavorTextForVersions: FlavorTextForVersion[];
  name: string;
  game: string;
};

const PokemonFlavorText: React.FC<PokemonFlavorTextProps> = ({
  flavorTextForVersion,
  flavorTextForVersions,
  name,
  game,
}) => {
  return (
    <div className={`pokeball-box w-1/4 ${styles.box}`}>
      {flavorTextForVersion && (
        <FlavorText flavorTextForVersion={flavorTextForVersion} />
      )}
      {flavorTextForVersions && (
        <DualFlavorText flavorTextForVersions={flavorTextForVersions} />
      )}
      {!flavorTextForVersion && !flavorTextForVersions.length && (
        <div>
          <p className="leading-5">
            There is no flavour text on {name} for{" "}
            {convertKebabCaseToTitleCase(game)}.
          </p>
        </div>
      )}
      <PokeballSpans />
    </div>
  );
};

export default PokemonFlavorText;
