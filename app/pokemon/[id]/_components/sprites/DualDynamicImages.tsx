import Image from "next/image";
import styles from "./DualDynamicImages.module.css"; // Assuming you have a CSS module

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
    <div className={styles.gridContainer}>
      <div className={styles.imageContainer}>
        {srcLeft ? (
          <Image
            src={srcLeft}
            alt={altLeft}
            data-testid={`${altLeft}-main-sprite`}
            width={width}
            height={height}
            priority={priority}
            fetchPriority="high"
          />
        ) : (
          "Sprite not available"
        )}
        <p className={styles.label}>{labelLeft}</p>
      </div>
      <div className={styles.imageContainer}>
        {srcRight ? (
          <Image
            src={srcRight}
            alt={altRight}
            data-testid={`${altRight}-main-sprite`}
            width={width}
            height={height}
            priority={priority}
            fetchPriority="high"
          />
        ) : (
          "Sprite not available"
        )}
        <p className={styles.label}>{labelRight}</p>
      </div>
    </div>
  );
};

export default DualDynamicImages;
