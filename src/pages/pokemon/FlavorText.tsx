import { FlavorTextForVersion } from "@/types/index";
import replaceNewlinesAndFeeds from "@/utils/replaceNewlinesAndFeeds";

type FlavorTextProps = {
  flavorTextForVersion: FlavorTextForVersion;
};

export const FlavorText: React.FC<FlavorTextProps> = ({
  flavorTextForVersion,
}) => {
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
