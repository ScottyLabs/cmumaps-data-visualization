import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { motion, useAnimation } from "motion/react";

import { useEffect, useState } from "react";

import coursesButtonDeselected from "@/assets/icons/plus_button_menu/courses-button-deselected.svg";
import coursesButtonSelected from "@/assets/icons/plus_button_menu/courses-button-selected.svg";
import plusButtonDeselected from "@/assets/icons/plus_button_menu/plus-button-deselected.svg";
import plusButtonSelected from "@/assets/icons/plus_button_menu/plus-button-selected.svg";
import questionMarkButtonDeselected from "@/assets/icons/plus_button_menu/question-mark-button-deselected.svg";
import questionMarkButtonSelected from "@/assets/icons/plus_button_menu/question-mark-button-selected.svg";
import settingsIcon from "@/assets/icons/plus_button_menu/settings.svg";
import signInIcon from "@/assets/icons/plus_button_menu/sign-in.svg";
import signOutIcon from "@/assets/icons/plus_button_menu/sign-out.svg";
import userButtonDeselected from "@/assets/icons/plus_button_menu/user-button-deselected.svg";
import userButtonSelected from "@/assets/icons/plus_button_menu/user-button-selected.svg";
import questionMarkIcon from "@/assets/icons/question-mark.png";
import useIsMobile from "@/hooks/useIsMobile";
import useLocationParams from "@/hooks/useLocationParams";
import useBoundStore from "@/store";

const IconsDisplay = () => {
  const isMobile = useIsMobile();
  const isSearchOpen = useBoundStore((state) => state.isSearchOpen);
  const { isCardOpen } = useLocationParams();

  const plusButtonControls = useAnimation();
  const coursesButtonControls = useAnimation();
  const questionMarkButtonControls = useAnimation();
  const userButtonControls = useAnimation();

  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut, openUserProfile, openSignIn } = useClerk();

  enum PlusButtonMenuState {
    CLOSED = 0,
    OPEN = 1,
    COURSES_SELECTED = 2,
    QUESTION_MARK_SELECTED = 3,
    USER_SELECTED = 4,
  }

  const [plusButtonMenuState, setPlusButtonMenuState] = useState(
    PlusButtonMenuState.CLOSED,
  );

  useEffect(() => {
    plusButtonControls.start({
      rotate: plusButtonMenuState != PlusButtonMenuState.CLOSED ? 0 : 45,
      transition: {
        bounce: 0,
      },
    });
    [
      coursesButtonControls,
      questionMarkButtonControls,
      userButtonControls,
    ].forEach((control, i) => {
      control?.start({
        y:
          plusButtonMenuState != PlusButtonMenuState.CLOSED ? -54 * (i + 1) : 0,
        transition: {
          bounce: 0,
        },
      });
    });
  }, [
    PlusButtonMenuState.CLOSED,
    coursesButtonControls,
    plusButtonControls,
    plusButtonMenuState,
    questionMarkButtonControls,
    userButtonControls,
  ]);

  if (isMobile && (isSearchOpen || isCardOpen)) {
    return <></>;
  }

  const plusButtonOnClick = () => {
    setPlusButtonMenuState(
      plusButtonMenuState == PlusButtonMenuState.CLOSED
        ? PlusButtonMenuState.OPEN
        : PlusButtonMenuState.CLOSED,
    );
  };

  const renderPlusButton = () => {
    return (
      <div
        className={
          (plusButtonMenuState == PlusButtonMenuState.CLOSED
            ? "btn-shadow "
            : "btn-shadow-dark ") +
          "fixed right-3 bottom-3 z-50 rounded-full sm:right-3.5 sm:bottom-3.5"
        }
        onClick={plusButtonOnClick}
      >
        <motion.div animate={plusButtonControls} initial={{ rotate: 45 }}>
          <img
            alt="Plus Button"
            src={
              plusButtonMenuState == PlusButtonMenuState.CLOSED ||
              plusButtonMenuState == PlusButtonMenuState.OPEN
                ? plusButtonSelected
                : plusButtonDeselected
            }
            height={isMobile ? 43 : 50}
            width={isMobile ? 43 : 50}
          />
        </motion.div>
      </div>
    );
  };

  const renderQuestionMarkButton = () => {
    const onClick = () => {
      if (plusButtonMenuState == PlusButtonMenuState.QUESTION_MARK_SELECTED) {
        setPlusButtonMenuState(PlusButtonMenuState.OPEN);
      } else if (plusButtonMenuState != PlusButtonMenuState.CLOSED) {
        setPlusButtonMenuState(PlusButtonMenuState.QUESTION_MARK_SELECTED);
      }
    };

    return (
      <>
        <motion.div
          animate={questionMarkButtonControls}
          className={
            (plusButtonMenuState == PlusButtonMenuState.CLOSED
              ? ""
              : "btn-shadow-dark ") +
            "fixed right-3 bottom-3 z-50 rounded-full sm:right-3.5 sm:bottom-3.5"
          }
          onClick={onClick}
        >
          <img
            alt="Question Mark"
            src={
              plusButtonMenuState == PlusButtonMenuState.QUESTION_MARK_SELECTED
                ? questionMarkButtonSelected
                : questionMarkButtonDeselected
            }
            height={isMobile ? 43 : 50}
            width={isMobile ? 43 : 50}
          />
        </motion.div>
        {plusButtonMenuState == PlusButtonMenuState.QUESTION_MARK_SELECTED && (
          <div className="btn-shadow-dark fixed inset-x-5 top-5 bottom-57 z-50 overflow-auto rounded-lg bg-white shadow-lg">
            <h5 className="px-2 py-1">About CMUMaps</h5>
          </div>
        )}
      </>
    );
  };

  const renderCoursesButton = () => {
    const onClick = () => {
      if (plusButtonMenuState == PlusButtonMenuState.COURSES_SELECTED) {
        setPlusButtonMenuState(PlusButtonMenuState.OPEN);
      } else if (plusButtonMenuState != PlusButtonMenuState.CLOSED) {
        setPlusButtonMenuState(PlusButtonMenuState.COURSES_SELECTED);
      }
    };

    return (
      <>
        <motion.div
          animate={coursesButtonControls}
          className={
            (plusButtonMenuState == PlusButtonMenuState.CLOSED
              ? ""
              : "btn-shadow-dark ") +
            "fixed right-3 bottom-3 z-50 rounded-full sm:right-3.5 sm:bottom-3.5"
          }
          onClick={onClick}
        >
          <img
            alt="Courses"
            src={
              plusButtonMenuState == PlusButtonMenuState.COURSES_SELECTED
                ? coursesButtonSelected
                : coursesButtonDeselected
            }
            height={isMobile ? 43 : 50}
            width={isMobile ? 43 : 50}
          />
        </motion.div>
        {plusButtonMenuState == PlusButtonMenuState.COURSES_SELECTED && (
          // Previously btn-shadow-dark fixed inset-x-[21px] bottom-[227px] top-[21px] bg-white rounded-lg shadow-lg overflow-auto z-50
          <div className="btn-shadow-dark fixed inset-x-5 top-5 bottom-57 z-50 overflow-auto rounded-lg bg-white shadow-lg">
            <h5 className="px-2 py-1">Schedule</h5>
          </div>
        )}
      </>
    );
  };

  const renderUserMenu = () => {
    const text = isLoaded
      ? isSignedIn
        ? `Signed in as ${user.firstName} ${user.lastName}`
        : "Not signed in"
      : "Loading user...";

    if (!isLoaded || !isSignedIn)
      return (
        <div className="btn-shadow-dark fixed inset-x-5 bottom-57 z-50 rounded-lg border border-gray-200 bg-white px-4 pt-4 pb-1 font-sans shadow-lg">
          <div className="mb-4 flex items-center gap-3">
            <div>
              <div className="text-center text-sm font-semibold text-gray-800">
                {text}
              </div>
            </div>
          </div>

          {isLoaded && (
            <>
              <hr className="-mx-4 my-1 border-gray-200" />
              <button
                className="flex w-full items-center gap-2 rounded-md bg-white px-3 py-2 text-sm text-gray-700 active:bg-gray-100"
                onClick={() => openSignIn()}
              >
                <img src={signInIcon} width={24} height={24} />
                <span>Sign In</span>
              </button>
            </>
          )}
        </div>
      );

    const avatarUrl = user.imageUrl;
    const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
    const email = user.primaryEmailAddress?.emailAddress;

    return (
      <div className="btn-shadow-dark fixed inset-x-5 bottom-57 z-50 rounded-lg border border-gray-200 bg-white px-4 pt-4 pb-1 font-sans shadow-lg">
        <div className="mb-4 flex items-center gap-3">
          <img
            src={avatarUrl}
            alt="User Avatar"
            className="h-12 w-12 rounded-full"
          />
          <div>
            <div className="text-sm font-semibold text-gray-800">
              {fullName || "No name"}
            </div>
            <div className="text-sm text-gray-500">{email || "No email"}</div>
          </div>
        </div>

        <hr className="-mx-4 my-1 border-gray-200" />

        <button
          className="flex w-full items-center gap-2 rounded-md bg-white px-3 py-2 text-sm text-gray-700 active:bg-gray-100"
          onClick={() => openUserProfile()}
        >
          <img src={settingsIcon} width={24} height={24} />
          <span>Manage Account</span>
        </button>

        <hr className="-mx-4 my-1 border-gray-200" />

        <button
          className="flex w-full items-center gap-2 rounded-md bg-white px-3 py-2 text-sm text-gray-700 focus:bg-gray-100"
          onClick={() => signOut()}
        >
          <img src={signOutIcon} width={24} height={24} />
          <span>Sign Out</span>
        </button>
      </div>
    );
  };

  const renderUserButton = () => {
    const handleClick = () => {
      if (plusButtonMenuState == PlusButtonMenuState.USER_SELECTED) {
        setPlusButtonMenuState(PlusButtonMenuState.OPEN);
      } else {
        setPlusButtonMenuState(PlusButtonMenuState.USER_SELECTED);
      }
    };

    return (
      <>
        <motion.div
          animate={userButtonControls}
          className={
            (plusButtonMenuState == PlusButtonMenuState.CLOSED
              ? ""
              : "btn-shadow-dark ") +
            "fixed right-3 bottom-3 z-50 flex rounded-full sm:right-3.5 sm:bottom-3.5"
          }
        >
          <div onClick={handleClick}>
            <img
              alt="Question Mark"
              src={
                plusButtonMenuState == PlusButtonMenuState.USER_SELECTED
                  ? userButtonSelected
                  : userButtonDeselected
              }
              height={isMobile ? 43 : 50}
              width={isMobile ? 43 : 50}
            />
          </div>
        </motion.div>
        {plusButtonMenuState == PlusButtonMenuState.USER_SELECTED &&
          renderUserMenu()}
      </>
    );
  };

  const renderClerkIcon = () => {
    if (isMobile) {
      return (
        <div className="fixed right-3 bottom-[7.5rem] flex items-center justify-center rounded-full bg-[#4b5563] p-2">
          <UserButton />
        </div>
      );
    } else {
      return (
        <div className="fixed top-14 right-6">
          <UserButton />
        </div>
      );
    }
  };

  const renderQuestionMarkIcon = () => {
    return (
      <div className="btn-shadow-dark fixed right-3 bottom-[4.5rem] rounded-full sm:right-3.5 sm:bottom-16">
        <a
          target="_blank"
          rel="noreferrer"
          href="https://docs.google.com/document/d/1jZeIij72ovf3K2J1J57rlD4pz3xnca3BfPedg9Ff1sc/edit"
        >
          <img
            alt="Question Mark"
            src={questionMarkIcon}
            height={isMobile ? 43 : 50}
            width={isMobile ? 43 : 50}
          />
        </a>
      </div>
    );
  };

  const onClickBackground = () => {
    if (plusButtonMenuState == PlusButtonMenuState.OPEN)
      setPlusButtonMenuState(PlusButtonMenuState.CLOSED);
    else setPlusButtonMenuState(PlusButtonMenuState.OPEN);
  };

  if (isMobile) {
    return (
      <>
        {plusButtonMenuState != PlusButtonMenuState.CLOSED && (
          <div
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-md"
            onClick={onClickBackground}
          ></div>
        )}
        {renderUserButton()}
        {renderQuestionMarkButton()}
        {renderCoursesButton()}
        {renderPlusButton()}
      </>
    );
  }

  return (
    <>
      {renderClerkIcon()}
      {renderQuestionMarkIcon()}
    </>
  );
};

export default IconsDisplay;
