"use client";
import Link from "next/link";
import Image from "next/image";
import { useContext } from "react";
import convertKebabCaseToTitleCase from "@/utils/convertKebabCaseToTitleCase";
import { GenerationContext } from "@/context/_context";
import HeaderStarters from "./HeaderStarters";

const LOGO_SIZE: number = 90;

export default function HeaderTitle() {
  const { generation, generationString, genVersions } =
    useContext(GenerationContext);

  const formatName = convertKebabCaseToTitleCase;
  const genNumber = generationString?.split("-")[1] || "i";

  return (
    <div className="hidden lg:flex flex flex-row justify-center items-center">
      <Link href="/" prefetch={false}>
        <Image
          src="/images/dudelax.webp"
          width={LOGO_SIZE}
          height={LOGO_SIZE}
          alt="Munchlax"
          priority={true}
        />
      </Link>
      <div>
        {generation && genNumber && (
          <section className="flex flex-col">
            <div className="flex flex-row justify-left items-end gap-x-2">
              <Link href="/" prefetch={false}>
                <span className="block text-2xl font-bold">New Bark Town</span>
              </Link>
              <HeaderStarters />
            </div>
            <span className="text-[0.9em] lg:text-[1em]">
              <span className="hidden lg:inline">
                Gen {genNumber.toUpperCase()}:
              </span>{" "}
              <small>{genVersions}</small>{" "}
              <span className="inline lg:hidden">
                <br />
              </span>
            </span>
          </section>
        )}
      </div>
    </div>
  );
}
