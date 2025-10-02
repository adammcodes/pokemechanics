import Image from "next/image";

interface Props {
  src: string | null;
  alt: string;
  width: number;
  height: number;
  game: string;
  priority?: boolean;
}

const DynamicImage: React.FC<Props> = ({
  src,
  alt,
  width,
  height,
  game,
  priority = false,
}) => {
  if (!src) {
    return <div>No image available</div>;
  }

  if (game === "x-y" && priority) {
    return <img src={src} alt={alt} />;
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      fetchPriority="high"
    />
  );
};

export default DynamicImage;
