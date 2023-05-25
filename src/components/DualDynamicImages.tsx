import Image from "next/image";

interface Props {
  labelLeft: string;
  labelRight: string;
  srcLeft: string | null;
  srcRight: string | null;
  altLeft: string;
  altRight: string;
  width: number;
  height: number;
  priority?: boolean;
}

const DualDynamicImages: React.FC<Props> = ({
  labelLeft,
  labelRight,
  srcLeft,
  srcRight,
  altLeft,
  altRight,
  width,
  height,
  priority = false,
}) => {
  return (
    <table className="w-full">
      <tbody>
        <tr>
          <td className="pr-1">
            <div className="flex justify-center items-center">
              {srcLeft && (
                <Image
                  src={srcLeft}
                  alt={altLeft}
                  width={width}
                  height={height}
                  priority={priority}
                />
              )}
              {!srcLeft && "Sprite not available"}
            </div>
          </td>
          <td className="pl-1">
            <div className="flex justify-center items-center">
              {srcRight && (
                <Image
                  src={srcRight}
                  alt={altRight}
                  width={width}
                  height={height}
                  priority={priority}
                />
              )}
              {!srcRight && "Sprite not available"}
            </div>
          </td>
        </tr>
        <tr>
          <td className="text-center pr-1">{labelLeft}</td>
          <td className="text-center pl-1">{labelRight}</td>
        </tr>
      </tbody>
    </table>
  );
};

export default DualDynamicImages;
