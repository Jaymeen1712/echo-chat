import SubSidebar from "@/components/sub-sidebar";
import { useUser } from "@/lib/hooks";
import { MessageArea } from "../../components";

const MainPage = () => {
  useUser();

  return (
    <div className="flex h-full w-full gap-x-8 rounded-3xl bg-white-primary px-4 py-6">
      <SubSidebar />
      <div className="flex-1">
        <MessageArea />
      </div>
    </div>
  );
};

export default MainPage;
