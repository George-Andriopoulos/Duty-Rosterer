import { JSX } from "react";

import { DayReviewTable } from "./features/day-review-table";
import { MainLayout } from "./layout/MainLayout";
import { LocaleProvider } from "./store/LocaleContext";
import { RosterProvider } from "./store/RosterContext";

function App(): JSX.Element {
  return (
    <LocaleProvider>
      <RosterProvider>
        <MainLayout>
          <DayReviewTable />
        </MainLayout>
      </RosterProvider>
    </LocaleProvider>
  );
}

export default App;
