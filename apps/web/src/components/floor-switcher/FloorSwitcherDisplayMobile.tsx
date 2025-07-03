import useBoundStore from "@/store";
import type { Building } from "@cmumaps/common";
import { animate, motion, useMotionValue } from "framer-motion";
import { useState } from "react";
import FloorSwitcherCarouselMobile from "./FloorSwitcherCarouselMobile";

interface Props {
  building: Building;
  initialFloorLevel: string;
}

const FloorSwitcherDisplayMobile = ({ building, initialFloorLevel }: Props) => {
  const focusFloor = useBoundStore((state) => state.focusFloor);
  const floorIndex = building.floors.indexOf(initialFloorLevel);

  const progressValue = useMotionValue(floorIndex);

  const [startingTouchY, setStartingTouchY] = useState(0);
  const [startingProgressValue, setStartingProgressValue] = useState(0);

  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches[0]?.clientY) {
      setStartingTouchY(e.touches[0]?.clientY);
      setStartingProgressValue(progressValue.get());
    }
  };

  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches[0]?.clientY) {
      progressValue.set(
        Math.max(
          0,
          Math.min(
            building.floors.length - 1,
            startingProgressValue -
              (e.touches[0]?.clientY - startingTouchY) / 50,
          ),
        ),
      );
    }
  };

  const onTouchEnd = () => {
    const targetFloorIndex = Math.round(progressValue.get());

    const controls = animate(progressValue, targetFloorIndex, {
      duration: Math.abs(progressValue.get() - targetFloorIndex) * 0.5,
      ease: "easeInOut",
      bounce: 0,
    });

    controls.then(() => {
      if (building.floors[targetFloorIndex]) {
        focusFloor({
          buildingCode: building.code,
          level: building.floors[targetFloorIndex],
        });
      }
    });

    return controls.stop;
  };

  return (
    <>
      <motion.div
        className="btn-shadow -translate-x-1/2 -translate-y-1/2 fixed top-1/2 h-52 w-45 bg-white/10 shadow-black/20 shadow-lg backdrop-blur-md"
        style={{ borderRadius: "50% / 50%" }}
        onTouchStart={(e) => {
          onTouchStart(e);
        }}
        onTouchMove={(e) => {
          onTouchMove(e);
        }}
        onTouchEnd={() => {
          onTouchEnd();
        }}
      >
        <FloorSwitcherCarouselMobile
          building={building}
          progressValue={progressValue}
        />
      </motion.div>
    </>
  );
};

export default FloorSwitcherDisplayMobile;
