import { JSX } from "react";

import { DayReviewTable } from "./features/day-review-table";
import { MainLayout } from "./layout/MainLayout";
import { RosterProvider } from "./store/RosterContext";

function App(): JSX.Element {
  return (
    <RosterProvider>
      <MainLayout>
        <DayReviewTable />
      </MainLayout>
    </RosterProvider>
  );
}

export default App;
