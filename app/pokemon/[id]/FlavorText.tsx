import { FlavorTextForVersion } from "@/types/index";
import replaceNewlinesAndFeeds from "@/utils/replaceNewlinesAndFeeds";

type FlavorTextProps = {
  flavorTextForVersion: FlavorTextForVersion;
};

const FlavorText: React.FC<FlavorTextProps> = ({ flavorTextForVersion }) => {
  return (
    <>
      {flavorTextForVersion && (
        <div>
          <p className="leading-5">
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

export const DualFlavorText: React.FC<DualFlavorTextProps> = ({
  flavorTextForVersions,
}) => {
  return (
    <>
      {flavorTextForVersions.map((text: any, i: any) => {
        let desc: string = replaceNewlinesAndFeeds(text.flavor_text);
        return (
          <div key={i}>
            <h3 className="text-2xl border-b-2">
              {text.version.name.toUpperCase()}
            </h3>
            <p className="text-xl leading-[1em]">{desc}</p>
          </div>
        );
      })}
    </>
  );
};

export default FlavorText;
