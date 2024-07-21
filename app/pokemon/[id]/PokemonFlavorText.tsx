import convertKebabCaseToTitleCase from "@/utils/convertKebabCaseToTitleCase";
import replaceNewlinesAndFeeds from "@/utils/replaceNewlinesAndFeeds";
import { FlavorTextForVersion } from "@/types/index";
import Box from "@/components/common/Box";

type FlavorTextProps = {
  flavorTextForVersion: FlavorTextForVersion;
};

const FlavorText: React.FC<FlavorTextProps> = ({ flavorTextForVersion }) => {
  return (
    <>
      {flavorTextForVersion && (
        <div>
          <p className="text-base">
            {replaceNewlinesAndFeeds(flavorTextForVersion.flavor_text)}
          </p>
        </div>
      )}
    </>
  );
};

type DualFlavorTextProps = {
  flavorTextForVersions: FlavorTextForVersion[];
};

const DualFlavorText: React.FC<DualFlavorTextProps> = ({
  flavorTextForVersions,
}) => {
  return (
    <>
      {flavorTextForVersions.map((text: any, i: any) => {
        let desc: string = replaceNewlinesAndFeeds(text.flavor_text);
        return (
          <div key={i}>
            <h4 className="border-b-2">{text.version.name.toUpperCase()}</h4>
            <p className="text-base leading-none">{desc}</p>
          </div>
        );
      })}
    </>
  );
};

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
    <Box headingText="Flavor Text:">
      {flavorTextForVersion && (
        <FlavorText flavorTextForVersion={flavorTextForVersion} />
      )}
      {flavorTextForVersions && (
        <DualFlavorText flavorTextForVersions={flavorTextForVersions} />
      )}
      {!flavorTextForVersion && !flavorTextForVersions.length && (
        <div>
          <p className="text-base leading-none">
            There is no flavour text on {name} for{" "}
            {convertKebabCaseToTitleCase(game)}.
          </p>
        </div>
      )}
    </Box>
  );
};

export default PokemonFlavorText;
