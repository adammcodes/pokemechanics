import { FlavorTextForVersion } from "@/types/index";
import FlavorText, { DualFlavorText } from "./FlavorText";
import convertKebabCaseToTitleCase from "@/utils/convertKebabCaseToTitleCase";
import styles from "@/styles/PokemonCard.module.css";

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
    <div
      className={`bg-white p-[1em] w-[400px] lg:w-1/4 ${styles.card__border}`}
    >
      <h2 className="text-3xl">Flavor Text:</h2>
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
    </div>
  );
};

export default PokemonFlavorText;
