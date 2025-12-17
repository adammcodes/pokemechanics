import { EXCLUDED_VERSION_GROUPS } from "@/constants/excludedVersionGroups";
import type { VersionGroupPokedexes } from "@/app/helpers/graphql/getGenerationVersions";
import convertKebabCaseToTitleCase from "@/utils/convertKebabCaseToTitleCase";

export const getGenVersionsString = (
  versionGroups: VersionGroupPokedexes[]
) => {
  return versionGroups
    .filter(
      (vg: VersionGroupPokedexes) => !EXCLUDED_VERSION_GROUPS.includes(vg.name)
    )
    .map((vg: VersionGroupPokedexes) =>
      vg.versions.map((v: { name: string }) => v.name)
    )
    .flat()
    .map((versionName: string) => convertKebabCaseToTitleCase(versionName))
    .join(", ");
};
