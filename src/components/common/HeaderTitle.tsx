"use client";
import Link from "next/link";
import Image from "next/image";
import { useContext } from "react";
import convertKebabCaseToTitleCase from "@/utils/convertKebabCaseToTitleCase";
import { GameContext } from "@/context/_context";
import useGameVersion from "@/hooks/useGameVersion";

const logoSize: number = 80;

export default function HeaderTitle() {
  const { game } = useContext(GameContext);

  const versionGroup = useGameVersion(game);
  const formatName = convertKebabCaseToTitleCase;
  const genNumber =
    versionGroup.data && versionGroup.data.generation?.name.split("-")[1];

  return (
    <div className="hidden lg:flex flex flex-row justify-center items-center">
      <Link href="/">
        <Image
          src="/images/dudelax.png"
          width={logoSize}
          height={logoSize}
          alt="Munchlax"
          priority={true}
        />
      </Link>
      <div>
        <Link href="/">
          <h1>POKEMECHANICS</h1>
        </Link>
        {game && versionGroup.data && (
          <span className="text-[0.9em] lg:text-[1em]">
            <span className="hidden lg:inline">&nbsp;-</span> {formatName(game)}{" "}
            <span className="inline lg:hidden">
              <br />
            </span>
            {genNumber && <>(Gen {genNumber.toUpperCase()})</>}
          </span>
        )}
      </div>
    </div>
  );
}
