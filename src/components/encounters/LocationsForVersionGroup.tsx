import Encounters from "./Encounters";
import styles from "@/app/pokemon/[id]/PokemonCard.module.css";

type LocationsForVersionGroupProps = {
  versions: string[]; // e.g. ["red", "blue"]
  pokemonSpeciesId: number; // national dex number
};

const LocationsForVersionGroup: React.FC<LocationsForVersionGroupProps> = ({
  versions,
  pokemonSpeciesId,
}) => {
  // console.log(versions, pokemonSpeciesId);
  return (
    <section
      className={`card__border w-full lg:w-[400px] p-[1em] flex flex-col gap-y-3`}
    >
      <h2 className="text-3xl">Encounters:</h2>
      {versions.length &&
        versions.map((version) => (
          <Encounters
            key={version}
            version={version}
            pokemonSpeciesId={pokemonSpeciesId}
          />
        ))}
    </section>
  );
};

export default LocationsForVersionGroup;
