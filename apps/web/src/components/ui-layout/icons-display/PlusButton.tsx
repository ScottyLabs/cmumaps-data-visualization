import plusButtonDeselected from "@/assets/icons/plus_button_menu/plus-button-deselected.svg";
import plusButtonSelected from "@/assets/icons/plus_button_menu/plus-button-selected.svg";
import { motion } from "motion/react";

interface PlusButtonProps {
  isMenuOpen: boolean;
  isPlusButtonSelected: boolean;
  onClick: () => void;
}

const PlusButton = ({
  isMenuOpen,
  isPlusButtonSelected,
  onClick,
}: PlusButtonProps) => {
  const animationControls = {
    rotate: isMenuOpen ? 0 : 45,
    transition: {
      bounce: 0,
    },
  };

  const icon = isPlusButtonSelected ? plusButtonSelected : plusButtonDeselected;

  return (
    <div
      className={`${
        isMenuOpen ? "btn-shadow-dark " : "btn-shadow "
      }fixed right-5 bottom-6 z-50 rounded-full sm:right-3.5 sm:bottom-3.5`}
    >
      <motion.div
        onClick={onClick}
        animate={animationControls}
        initial={{ rotate: 45 }}
      >
        <img alt="Plus Button" className="h-14 w-14" src={icon} />
      </motion.div>
    </div>
  );
};

export default PlusButton;
