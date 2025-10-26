type MoveMachineProps = {
  item_name: string;
};

export const MoveMachine: React.FC<MoveMachineProps> = ({ item_name }) => {
  return <label>{item_name.toUpperCase()}</label>;
};
