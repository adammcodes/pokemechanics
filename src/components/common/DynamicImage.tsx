import Image from "next/image";

interface Props {
  src: string | null;
  alt: string;
  width: number;
  height: number;
  priority: boolean;
  game: string;
}

const DynamicImage: React.FC<Props> = ({
  src,
  alt,
  width,
  height,
  priority = false,
  game,
}) => {
  if (!src) {
    return <div>No image available</div>;
  }

  if (game === "x-y") {
    return <img src={src} alt={alt} />;
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
    />
  );
};

export default DynamicImage;
