import { Suspense } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import { RoutesWrapper } from "./components";
import Wrapper from "./wrapper";

function App() {
  return (
    <Suspense
    //  fallback={<Spinner />}
    >
      <Wrapper>
        <Router
          future={{
            v7_relativeSplatPath: true,
            v7_startTransition: true,
          }}
        >
          <RoutesWrapper />
        </Router>
      </Wrapper>
    </Suspense>
  );
}

export default App;
