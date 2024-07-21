import { versionColours } from "@/constants/versionColours";

export default function VersionChip({ versionName }: { versionName: string }) {
  // version names are all in kebab-case from the API
  let versionColour: string = versionColours[versionName];

  // Use a css property for text color that contrasts with the versionColour hex code
  let textColour: string =
    versionColour === "#ffffff" ? "text-black" : "text-white";

  return (
    <div
      className={`shadow-lg text-center rounded-sm uppercase px-2 flex justify-center items-center`}
      style={{ background: versionColour }}
    >
      <span className={`text-lg leading-none ${textColour}`}>
        {versionName.toUpperCase()}
      </span>
    </div>
  );
}
