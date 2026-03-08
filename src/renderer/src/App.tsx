import { JSX } from "react";

import { RosterGrid } from "./features/roster-grid";
import { MainLayout } from "./layout/MainLayout";
import { RosterProvider } from "./store/RosterContext";

function App(): JSX.Element {
  return (
    <RosterProvider>
      <MainLayout>
        {/* We simply drop our high-performance grid right here */}
        <RosterGrid />
      </MainLayout>
    </RosterProvider>
  );
}

export default App;
