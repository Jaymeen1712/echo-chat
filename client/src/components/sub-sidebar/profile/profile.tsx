import { DEFAULT_SUB_SIDEBAR_WIDTH } from "@/enums";
import { handleGetAvatarAlternativeURL } from "@/utils";
import { FaCamera } from "react-icons/fa";
import useProfileSubSidebarController from "./profile-controller";

const ProfileSubSidebar = () => {
  const { currentUserData, handleProfilePhotoInputOnChange } =
    useProfileSubSidebarController();

  return (
    <div
      style={{
        width: DEFAULT_SUB_SIDEBAR_WIDTH,
      }}
      className="flex flex-col px-2"
    >
      <h1 className="text-xl">Profile</h1>

      <div className="flex flex-col gap-y-2">
        <div className="my-16 flex w-full justify-center">
          <div
            className="group relative h-[220px] w-[220px] cursor-pointer rounded-full transition"
            onClick={() => {
              document.getElementById("attach-image")?.click();
            }}
          >
            <img
              src={
                currentUserData?.image ||
                handleGetAvatarAlternativeURL(currentUserData?.name)
              }
              alt="avatarImg"
              className="z-20 h-full w-full rounded-full bg-black-primary object-cover transition group-hover:brightness-50"
            />
            <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 group-hover:block">
              <div className="flex flex-col items-center justify-center gap-y-4 transition">
                <FaCamera size={22} className="text-white-primary" />
                <span className="flex flex-col items-center text-sm uppercase text-white-primary">
                  <span>{!currentUserData?.image ? "Add" : "Change"}</span>
                  <span>profile photo</span>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-y-8">
          <div className="flex flex-col gap-y-4">
            <h6 className="text-sm">Your name</h6>
            <span className="text-xl font-semibold">
              {currentUserData?.name}
            </span>
          </div>
          <div className="flex flex-col gap-y-4">
            <h6 className="text-sm">Your email</h6>
            <span className="text-xl font-semibold">
              {currentUserData?.email}
            </span>
          </div>
        </div>
      </div>

      <input
        type="file"
        accept="image/*"
        id="attach-image"
        className="hidden"
        onChange={handleProfilePhotoInputOnChange}
      />
    </div>
  );
};

export default ProfileSubSidebar;
