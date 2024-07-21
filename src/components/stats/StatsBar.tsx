import styles from "./StatsBar.module.css";

// This component will render a bar chart of the stats for the given pokemon stats
// The bar chart will run horizontally
// The bars will be colored based on the base_stat from 0-255 (0-100%) with 0 being red and 255 being green
// The bars will be labeled with the stat name

type StatsBarProps = {
  name: string;
  base_stat: number;
  effort: number; // this is not used yet
};

const abbreviateStatName = (name: string): string => {
  switch (name) {
    case "special-attack":
      return "Sp. Atk";
    case "special-defense":
      return "Sp. Def";
    default:
      return name.slice(0, 3);
  }
};

const calculateStatColor = (baseStatPercentage: number): string => {
  let hue = 30;
  if (baseStatPercentage < 50) {
    // Interpolate from red (0) to yellow (60)
    hue += (baseStatPercentage / 50) * 60;
  } else {
    // Interpolate from yellow-ish (80) to green (120)
    hue += 80 + ((baseStatPercentage - 50) / 50) * 60;
  }
  return `hsl(${hue}, 100%, 50%)`;
};

// This component is for a single stat bar
const StatsBar: React.FC<StatsBarProps> = ({ name, base_stat }) => {
  const baseStatPercentage = Math.round((base_stat / 255) * 100);
  const statColor = calculateStatColor(baseStatPercentage);
  const statName =
    name === "hp" ? name.toUpperCase() : abbreviateStatName(name).toUpperCase();
  return (
    <div className="flex flex-col gap-y-1">
      <small>
        {statName}: {base_stat}
      </small>
      <div className="relative h-2 w-full rounded">
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
      <div className={styles.stats}>
        {stats.map((stat) => (
          <StatsBar key={stat.name} {...stat} />
        ))}
      </div>
      <div className="mt-2">
        <span className="text-lg leading-none">Effort Values:</span> <br />
        {EVs.map((ev, i, arr) => (
          <span key={ev.stat} className="text-sm">
            +{ev.value} {abbreviateStatName(ev.stat).toUpperCase()}
            {i < arr.length - 1 ? ", " : ""}
          </span>
        ))}
      </div>
    </div>
  );
};

export default StatBars;
