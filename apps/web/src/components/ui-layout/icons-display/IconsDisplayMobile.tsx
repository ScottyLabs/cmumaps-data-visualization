import coursesButtonDeselected from "@/assets/icons/plus_button_menu/courses-button-deselected.svg";
import coursesButtonSelected from "@/assets/icons/plus_button_menu/courses-button-selected.svg";
import questionMarkButtonDeselected from "@/assets/icons/plus_button_menu/question-mark-button-deselected.svg";
import questionMarkButtonSelected from "@/assets/icons/plus_button_menu/question-mark-button-selected.svg";
import userButtonDeselected from "@/assets/icons/plus_button_menu/user-button-deselected.svg";
import userButtonSelected from "@/assets/icons/plus_button_menu/user-button-selected.svg";
import useLocationParams from "@/hooks/useLocationParams";
import useBoundStore from "@/store";
import { useClerk, useUser } from "@clerk/clerk-react";
import { motion } from "motion/react";
import { useState } from "react";
import AboutMenu from "./AboutMenu";
import CoursesMenu from "./CoursesMenu";
import PlusButton from "./PlusButton";
import UserMenu from "./UserMenu";

enum PlusButtonMenuState {
  CLOSED = 0,
  OPEN = 1,
  COURSES_SELECTED = 2,
  QUESTION_MARK_SELECTED = 3,
  USER_SELECTED = 4,
}

interface MenuButtonProps {
  deselectedIcon: string;
  selectedIcon: string;
  altText: string;
  selectedMenuState: PlusButtonMenuState;
  menu: () => React.ReactElement;
}

const IconsDisplayMobile = () => {
  const isSearchOpen = useBoundStore((state) => state.isSearchOpen);
  const { isCardOpen } = useLocationParams();

  const userProps = useUser();
  const clerkFunctions = useClerk();

  const [plusButtonMenuState, setPlusButtonMenuState] = useState(
    PlusButtonMenuState.CLOSED,
  );

  if (isSearchOpen || isCardOpen) {
    return;
  }

  const menuButtons: MenuButtonProps[] = [
    {
      deselectedIcon: userButtonDeselected,
      selectedIcon: userButtonSelected,
      altText: "User Menu",
      selectedMenuState: PlusButtonMenuState.USER_SELECTED,
      menu: () => {
        return UserMenu({ userProps, clerkFunctions });
      },
    },
    {
      deselectedIcon: questionMarkButtonDeselected,
      selectedIcon: questionMarkButtonSelected,
      altText: "About",
      selectedMenuState: PlusButtonMenuState.QUESTION_MARK_SELECTED,
      menu: AboutMenu,
    },
    {
      deselectedIcon: coursesButtonDeselected,
      selectedIcon: coursesButtonSelected,
      altText: "Courses",
      selectedMenuState: PlusButtonMenuState.COURSES_SELECTED,
      menu: CoursesMenu,
    },
  ];

  const renderMenuButton = (
    {
      deselectedIcon,
      selectedIcon,
      altText,
      selectedMenuState,
      menu,
    }: MenuButtonProps,
    index: number,
  ) => {
    const onClick = () => {
      if (plusButtonMenuState === selectedMenuState) {
        setPlusButtonMenuState(PlusButtonMenuState.OPEN);
      } else if (plusButtonMenuState !== PlusButtonMenuState.CLOSED) {
        setPlusButtonMenuState(selectedMenuState);
      }
    };

    const animationControls = {
      y:
        plusButtonMenuState === PlusButtonMenuState.CLOSED
          ? 0
          : -68 * (menuButtons.length - index),
      transition: {
        bounce: 0,
      },
    };

    const icon =
      plusButtonMenuState === selectedMenuState ? selectedIcon : deselectedIcon;

    return (
      <>
        <motion.div
          animate={animationControls}
          className={`${
            plusButtonMenuState === PlusButtonMenuState.CLOSED
              ? ""
              : "btn-shadow-dark "
          }fixed right-5 bottom-6 z-50 rounded-full sm:right-3.5 sm:bottom-3.5`}
          onClick={onClick}
        >
          <img className="h-14 w-14" alt={altText} src={icon} />
        </motion.div>
        {plusButtonMenuState === selectedMenuState && menu()}
      </>
    );
  };

  const onClickBackground = () => {
    if (plusButtonMenuState === PlusButtonMenuState.OPEN)
      setPlusButtonMenuState(PlusButtonMenuState.CLOSED);
    else setPlusButtonMenuState(PlusButtonMenuState.OPEN);
  };

  const plusButtonOnClick = () => {
    setPlusButtonMenuState(
      plusButtonMenuState === PlusButtonMenuState.CLOSED
        ? PlusButtonMenuState.OPEN
        : PlusButtonMenuState.CLOSED,
    );
  };

  return (
    <>
      {plusButtonMenuState !== PlusButtonMenuState.CLOSED && (
        // biome-ignore lint/a11y/useKeyWithClickEvents: Only used for mobile
        <div
          className="fixed inset-0 z-50 bg-black/30 backdrop-blur-md"
          onClick={onClickBackground}
        />
      )}

      {menuButtons.map(renderMenuButton)}

      <PlusButton
        isMenuOpen={plusButtonMenuState !== PlusButtonMenuState.CLOSED}
        isPlusButtonSelected={
          plusButtonMenuState === PlusButtonMenuState.CLOSED ||
          plusButtonMenuState === PlusButtonMenuState.OPEN
        }
        onClick={plusButtonOnClick}
      />
    </>
  );
};

export default IconsDisplayMobile;
