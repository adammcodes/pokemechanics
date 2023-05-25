import { FlavorTextForVersion } from "../types";
import replaceNewlinesAndFeeds from "../utils/replaceNewlinesAndFeeds";

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
            <p className={`${i !== 0 ? "mt-5" : ""} mb-5`}>
              {text.version.name.toUpperCase()}
            </p>
            <p className="leading-5">{desc}</p>
          </div>
        );
      })}
    </>
  );
};
