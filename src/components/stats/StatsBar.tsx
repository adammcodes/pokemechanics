import convertKebabCaseToTitleCase from "@/utils/convertKebabCaseToTitleCase";
// This component will render a bar chart of the stats for the given pokemon stats
// The bar chart will run horizontally
// The bars will be colored based on the base_stat from 0-255 (0-100%) with 0 being red and 255 being green
// The bars will be labeled with the stat name

type StatsBarProps = {
  name: string;
  base_stat: number;
  effort: number; // this is not used yet
};

// This component is for a single stat bar
const StatsBar: React.FC<StatsBarProps> = ({ name, base_stat }) => {
  const formatName = convertKebabCaseToTitleCase;
  const baseStatPercentage = Math.round((base_stat / 255) * 100);
  const statColor = `hsl(${baseStatPercentage}, 100%, 50%)`;
  const statName = name === "hp" ? name.toUpperCase() : formatName(name);
  return (
    <div className="flex flex-col gap-y-1">
      <div className="flex">
        <p>
          {statName}: {base_stat}
        </p>
      </div>
      <div className="relative h-2 w-full bg-gray-300 rounded">
        <div
          className="absolute top-0 left-0 h-2 rounded"
          style={{
            width: `${baseStatPercentage}%`,
            backgroundColor: statColor,
          }}
        ></div>
      </div>
    </div>
  );
};

type StatBarsProps = {
  stats: StatsBarProps[];
};

type EffortValues = {
  value: number;
  stat: string;
};

// This component is for all the stat bars
const StatBars: React.FC<StatBarsProps> = ({ stats }) => {
  const formatName = convertKebabCaseToTitleCase;
  // figure out which stats this pokemon gives effort values (EVs) for
  const EVs: EffortValues[] = stats
    .filter((stat) => stat.effort > 0)
    .map((stat) => {
      const { effort, name } = stat;
      return {
        value: effort,
        stat: name,
      };
    });

  return (
    <div className="flex flex-col gap-y-1">
      {stats.map((stat) => (
        <StatsBar key={stat.name} {...stat} />
      ))}
      <div className="flex flex-col gap-1 xl:flex-row">
        <span>Effort Values:</span>{" "}
        {EVs.map((ev, i, arr) => (
          <span key={ev.stat}>
            +{ev.value} {formatName(ev.stat)}
            {i < arr.length - 1 ? ", " : ""}
          </span>
        ))}
      </div>
    </div>
  );
};

export default StatBars;
