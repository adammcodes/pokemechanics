import { FlavorTextForVersion } from "@/types/index";
import FlavorText, { DualFlavorText } from "./FlavorText";
import convertKebabCaseToTitleCase from "@/utils/convertKebabCaseToTitleCase";

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
    <div className={`p-[1em] w-full lg:w-[400px] card__border`}>
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
