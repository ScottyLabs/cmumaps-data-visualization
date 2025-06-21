import questionMarkIcon from "@/assets/icons/question-mark.png";
import { UserButton } from "@clerk/clerk-react";

const IconsDisplay = () => {
  const renderClerkIcon = () => {
    return (
      <div className="fixed top-14 right-6">
        <UserButton />
      </div>
    );
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
            height={50}
            width={50}
          />
        </a>
      </div>
    );
  };

  return (
    <>
      {renderClerkIcon()}
      {renderQuestionMarkIcon()}
    </>
  );
};

export default IconsDisplay;
