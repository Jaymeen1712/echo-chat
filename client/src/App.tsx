import { Suspense } from "react";
import "./App.css";
import { RoutesWrapper } from "./components";
import Wrapper from "./wrapper";

function App() {
  return (
    <Suspense
    //  fallback={<Spinner />}
    >
      <Wrapper>
        <RoutesWrapper />
      </Wrapper>
    </Suspense>
  );
}

export default App;
