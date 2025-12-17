type PokedexHeaderProps = {
  genNumber: number;
  genVersionsString: string;
};

export default function PokedexHeader({
  genNumber,
  genVersionsString,
}: PokedexHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-center">
        Pokédexes - Gen {genNumber}
      </h1>
      <h2 className="text-2xl text-center">{genVersionsString}</h2>
    </div>
  );
}
