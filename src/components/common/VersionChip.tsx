import { versionColours } from "@/constants/versionColours";

function getLuminance(hex: string): number {
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const a = [r, g, b].map((v) => {
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });

  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function getTextColor(backgroundColor: string): string {
  const luminance = getLuminance(backgroundColor);
  return luminance > 0.5 ? "text-black" : "text-white";
}

export default function VersionChip({ versionName }: { versionName: string }) {
  // version names are all in kebab-case from the API
  let versionColour: string = versionColours[versionName];

  // Use a css property for text color that contrasts with the versionColour hex code
  let textColour: string = getTextColor(versionColour);

  return (
    <div
      className={`shadow-lg text-center rounded-sm uppercase px-2 flex justify-center items-center`}
      style={{ background: versionColour }}
    >
      <span className={`text-lg leading-tight ${textColour}`}>
        {versionName.toUpperCase()}
      </span>
    </div>
  );
}
