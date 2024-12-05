import {
  ContactFileContainer,
  ContactInfoContainer,
  MessageArea,
} from "@/components/main-chat-panel";
import SubSidebar from "@/components/sub-sidebar";
import { useUser } from "@/lib/hooks";
import useMainPageController from "./main-page-controller";

const MainPage = () => {
  useUser();

  const { isContactInfoContainerOpen, isContactFileContainerOpen } =
    useMainPageController();

  return (
    <div className="flex h-full w-full gap-x-3">
      <div className="flex flex-1 gap-x-8 rounded-3xl bg-white-primary px-4 py-6">
        <SubSidebar />
        <div className="flex-1">
          <MessageArea />
        </div>
      </div>
      {isContactInfoContainerOpen || isContactFileContainerOpen ? (
        <div className="flex w-[416px] flex-col gap-y-3">
          {isContactInfoContainerOpen ? (
            <div className="flex-1 rounded-3xl bg-white-primary p-6">
              <div className="relative h-full w-full">
                <div className="absolute h-full w-full">
                  <ContactInfoContainer />
                </div>
              </div>
            </div>
          ) : null}
          {isContactFileContainerOpen ? (
            <div className="flex-1 rounded-3xl bg-white-primary p-6">
              <div className="relative h-full w-full">
                <div className="absolute h-full w-full">
                  <ContactFileContainer />
                </div>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default MainPage;
