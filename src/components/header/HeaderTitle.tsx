"use client";
import Link from "next/link";
import Image from "next/image";
import { useContext } from "react";
import convertKebabCaseToTitleCase from "@/utils/convertKebabCaseToTitleCase";
import { GameContext } from "@/context/_context";

const logoSize: number = 80;

export default function HeaderTitle() {
  const { game, generationString } = useContext(GameContext);

  const formatName = convertKebabCaseToTitleCase;
  const genNumber = generationString?.split("-")[1] || "i";

  return (
    <div className="hidden lg:flex flex flex-row justify-center items-center">
      <Link href="/">
        <Image
          src="/images/dudelax.webp"
          width={logoSize}
          height={logoSize}
          alt="Munchlax"
          priority={true}
        />
      </Link>
      <div>
        {game && genNumber && (
          <>
            <Link href="/">
              <span className="block text-2xl font-bold">POKEMECHANICS</span>
            </Link>
            <span className="text-[0.9em] lg:text-[1em]">
              <span className="hidden lg:inline">&nbsp;-</span>{" "}
              {formatName(game)}{" "}
              <span className="inline lg:hidden">
                <br />
              </span>
              {genNumber && <>(Gen {genNumber.toUpperCase()})</>}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
