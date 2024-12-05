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
    </div>
  );
};

export default SettingsSubSidebar;
