import { useUpdateUserMutation } from "@/queries";
import { useAppStore } from "@/store";
import { convertFileToBase64 } from "@/utils";
import imageCompression from "browser-image-compression";
import { useEffect } from "react";
import { toast } from "react-toastify";

const useProfileSubSidebarController = () => {
  const { currentUserData, setCurrentUserData } = useAppStore();

  const updateUserMutation = useUpdateUserMutation();

  const {
    mutate: updateUserMutate,
    data: updateUserData,
    isSuccess: isUpdateUserSuccess,
    isLoading: isUpdateUserLoading,
    isError: isUpdateUserError,
  } = updateUserMutation;

  const handleProfilePhotoInputOnChange: React.ChangeEventHandler<
    HTMLInputElement
  > = async (e) => {
    const imageFile = e.target.files?.[0];

    if (!imageFile) {
      toast.error("Something went wrong, please try again.");
      return;
    }

    const options = {
      maxSizeMB: 0.2,
      maxWidthOrHeight: 800,
      useWebWorker: true,
    };

    const compressedFile = await imageCompression(imageFile, options);
    const base64URL = await convertFileToBase64(compressedFile);

    updateUserMutate({
      image: base64URL,
    });
  };

  useEffect(() => {
    if (isUpdateUserSuccess && updateUserData) {
      const { user } = updateUserData.data.data;

      toast.success(`Profile photo updated successfully`);
      setCurrentUserData(user);
    }

    if (isUpdateUserError) {
      toast.error("Profile photo upload failed, please try again.");
    }
  }, [isUpdateUserSuccess, isUpdateUserError, updateUserData]);

  return {
    currentUserData,
    handleProfilePhotoInputOnChange,
    isUpdateUserLoading,
  };
};

export default useProfileSubSidebarController;
