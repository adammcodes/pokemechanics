import Image from "next/image";

interface Props {
  src: string | null;
  alt: string;
  width: number;
  height: number;
  priority: boolean;
}

const DynamicImage: React.FC<Props> = ({
  src,
  alt,
  width,
  height,
  priority = false,
}) => {
  if (!src) {
    return <div>No image available</div>;
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
