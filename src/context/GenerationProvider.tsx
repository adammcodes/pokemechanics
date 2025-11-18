"use client";
import { useEffect } from "react";
import { GenerationContext } from "./_context";
import useCookieState from "@/hooks/useCookieState";
import useGeneration from "@/hooks/useGeneration";
import type { VersionGroupPokedexes } from "@/app/helpers/graphql/getGenerationVersions";
import convertKebabCaseToTitleCase from "@/utils/convertKebabCaseToTitleCase";
import { EXCLUDED_VERSION_GROUPS } from "@/constants/excludedVersionGroups";

type VersionGroup = VersionGroupPokedexes;

type GenerationContextProps = {
  children: React.ReactNode;
  selectedGeneration: string; // comes from the page search params or URL path
  initialGeneration: string; // comes from server-side cookies
};

export const GenerationProvider: React.FC<GenerationContextProps> = ({
  children,
  selectedGeneration,
  initialGeneration,
}) => {
  // Use selectedGeneration as fallback, then initialGeneration from cookies
  const fallbackGeneration = selectedGeneration || initialGeneration;
  const [generation, setGeneration] = useCookieState<string>(
    "generation",
    fallbackGeneration
  );

  // When selectedGeneration changes (e.g., user navigates to /pokedex/generation-i),
  // update the generation context and cookie to match the URL
  useEffect(() => {
    if (selectedGeneration && selectedGeneration !== generation) {
      setGeneration(selectedGeneration);
    }
  }, [selectedGeneration, generation, setGeneration]);

  const { data: generationData } = useGeneration(generation);

  // e.g. "generation-i"
  const generationString = generationData ? generationData.name : "";

  const versionGroups = generationData ? generationData.versiongroups : [];

  const genVersions = versionGroups
    .filter((vg: VersionGroup) => !EXCLUDED_VERSION_GROUPS.includes(vg.name))
    .map((vg: VersionGroup) => vg.versions.map((v: { name: string }) => v.name))
    .flat()
    .map((versionName: string) => convertKebabCaseToTitleCase(versionName))
    .join(", ");

  return (
    <GenerationContext.Provider
      value={{
        generation,
        setGeneration,
        generationData,
        generationString,
        genVersions,
      }}
    >
      {children}
    </GenerationContext.Provider>
  );
};

export default GenerationContext;
