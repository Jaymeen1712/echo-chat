import { DEFAULT_SUB_SIDEBAR_WIDTH } from "@/enums";

const SettingsSubSidebar = () => {
  return (
    <div
      style={{
        width: DEFAULT_SUB_SIDEBAR_WIDTH,
      }}
      className="flex flex-col px-2"
    >
      <h1 className="text-xl">Settings</h1>

      <div className="flex flex-1 items-center justify-center text-2xl">
        <img
          src={"/coming-soon.png"}
          className="h-[180px] w-[180px]"
          alt="coming-soon"
        />
      </div>
    </div>
  );
};

export default SettingsSubSidebar;
