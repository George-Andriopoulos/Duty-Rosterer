import { JSX } from "react";

import { MainLayout } from "./layout/MainLayout";
import { RosterProvider } from "./store/RosterContext";

function App(): JSX.Element {
  return (
    <RosterProvider>
      <MainLayout>
        {/* Our Grid Component will go here */}
        <div className="border-border flex h-full items-center justify-center rounded-xl border-2 border-dashed p-8">
          <div className="text-center">
            <h3 className="text-main mb-2 text-lg font-semibold">
              Grid Workspace Empty
            </h3>
            <p className="text-muted text-sm">
              Ready to build the highly-optimized Roster Grid.
            </p>
          </div>
        </div>
      </MainLayout>
    </RosterProvider>
  );
}

export default App;
