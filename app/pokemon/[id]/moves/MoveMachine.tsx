"use client";
import { useQuery } from "@tanstack/react-query";
import { MachineVersion } from "@/types/index";
import useMachineClient from "@/hooks/useMachineClient";

type MoveMachineProps = {
  machines: MachineVersion[];
  game: string;
};

export const MoveMachine: React.FC<MoveMachineProps> = ({ machines, game }) => {
  const api = useMachineClient();

  const machineForVersion = machines.find((machine: MachineVersion) => {
    return machine.version_group.name === game;
  });
  const machineId = Number(machineForVersion?.machine.url.split("/").at(-2));

  const fetchMachine = async (machineId: number) => {
    return api
      .getMachineById(machineId)
      .then((data) => data)
      .catch((e) => {
        throw e;
      });
  };

  const machineQ = useQuery({
    queryKey: [`machine`, machineId],
    queryFn: () => fetchMachine(machineId),
    enabled: Boolean(machineId),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return (
    <>
      {machineQ.data && <label>{machineQ.data.item.name.toUpperCase()}</label>}
      {machineQ.isLoading && "Loading..."}
    </>
  );
};
