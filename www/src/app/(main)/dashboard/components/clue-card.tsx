import { motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import icon from "~/app/icon.svg";

interface ClueCardProps {
  clue: string;
}

const ClueCard = ({ clue }: ClueCardProps) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <motion.div
      className="relative h-72 w-52 cursor-pointer rounded-xl shadow-2xl"
      onClick={() => setFlipped(!flipped)}
      animate={{
        rotateY: flipped ? 180 : 0,
      }}
      transition={{
        duration: 0.6,
        ease: "easeInOut",
      }}
      style={{
        transformStyle: "preserve-3d",
      }}
    >
      <motion.div
        className="border-primary/20 absolute top-0 right-0 bottom-0 left-0 flex flex-col items-center justify-center gap-4 rounded-xl border-4 bg-white text-lg font-semibold"
        style={{
          backfaceVisibility: "hidden",
        }}
      >
        <Image src={icon} alt="icon" height={48} width={48} />
        Globetrotter
      </motion.div>
      <motion.div
        className="border-primary/20 absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center rounded-xl border-4 p-2 text-center font-semibold"
        style={{
          transform: "rotateY(180deg)",
          backfaceVisibility: "hidden",
        }}
      >
        {clue}
      </motion.div>
    </motion.div>
  );
};

export default ClueCard;
