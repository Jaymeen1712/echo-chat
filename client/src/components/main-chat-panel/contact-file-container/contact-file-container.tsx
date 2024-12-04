import { IoCloseOutline } from "react-icons/io5";
import useContactFileContainerController from "./contact-file-container-controller";

const ContactFileContainer = () => {
  const { handleCloseButtonClick } = useContactFileContainerController();

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex items-center justify-between gap-x-3">
        <h4 className="text-xl font-medium">Images</h4>
        <IoCloseOutline
          size={28}
          className="cursor-pointer"
          onClick={handleCloseButtonClick}
        />
      </div>
    </div>
  );
};

export default ContactFileContainer;
