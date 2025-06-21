import settingsIcon from "@/assets/icons/plus_button_menu/settings.svg";
import signInIcon from "@/assets/icons/plus_button_menu/sign-in.svg";
import signOutIcon from "@/assets/icons/plus_button_menu/sign-out.svg";
import type { LoadedClerk, UseUserReturn } from "@clerk/types";

interface UserMenuProps {
  userProps: UseUserReturn;
  clerkFunctions: LoadedClerk;
}

interface MenuButtonProps {
  icon: string;
  label: string;
  onClick: () => void;
}

const UserMenu = ({ userProps, clerkFunctions }: UserMenuProps) => {
  const { isLoaded, isSignedIn, user } = userProps;
  const { signOut, openUserProfile, openSignIn } = clerkFunctions;

  const UserProfile = () => {
    if (!isLoaded || !isSignedIn) {
      return (
        <div className="text-center font-semibold text-gray-800 text-sm">
          {isLoaded ? "Not signed in" : "Loading user..."}
        </div>
      );
    }

    const avatarUrl = user.imageUrl;
    const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
    const email = user.primaryEmailAddress?.emailAddress;

    return (
      <>
        <img
          src={avatarUrl}
          alt="User Avatar"
          className="h-12 w-12 rounded-full"
        />
        <div>
          <div className="font-semibold text-gray-800 text-sm">
            {fullName || "No name"}
          </div>
          <div className="text-gray-500 text-sm">{email || "No email"}</div>
        </div>
      </>
    );
  };

  const menuButtons: MenuButtonProps[] = isSignedIn
    ? [
        {
          icon: settingsIcon,
          label: "Manage Account",
          onClick: openUserProfile,
        },
        {
          icon: signOutIcon,
          label: "Sign Out",
          onClick: signOut,
        },
      ]
    : [
        {
          icon: signInIcon,
          label: "Sign In",
          onClick: openSignIn,
        },
      ];

  const renderMenuButton = ({ icon, label, onClick }: MenuButtonProps) => {
    return (
      <>
        <hr className="-mx-4 my-1 border-gray-200" />
        <button
          type="button"
          className="flex w-full items-center gap-2 rounded-md bg-white px-3 py-2 text-gray-700 text-sm active:bg-gray-100"
          onClick={onClick}
        >
          <img src={icon} alt="User Settings Button" width={24} height={24} />
          <span>{label}</span>
        </button>
      </>
    );
  };

  return (
    <div className="btn-shadow-dark fixed inset-x-5 bottom-74 z-50 rounded-lg border border-gray-200 bg-white px-4 pt-4 pb-1 font-sans shadow-lg">
      <div className="mb-4 flex items-center gap-3">
        <UserProfile />
      </div>
      {menuButtons.map(renderMenuButton)}
    </div>
  );
};

export default UserMenu;
