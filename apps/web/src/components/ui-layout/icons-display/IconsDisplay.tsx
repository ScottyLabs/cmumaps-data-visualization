import useIsMobile from "@/hooks/useIsMobile";
import IconsDisplayDesktop from "./IconsDisplayDesktop";
import IconsDisplayMobile from "./IconsDisplayMobile";

const IconsDisplay = () => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <IconsDisplayMobile />;
  }
  return <IconsDisplayDesktop />;
};

export default IconsDisplay;
