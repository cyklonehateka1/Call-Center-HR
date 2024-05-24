import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import App from "../App";
import ApplicationFormBasic from "./ApplicationFormBasic";
import ApplicationFormTest from "./ApplicationFormTest";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/">
        <Route index element={<App />} />
        <Route path="application/basic" element={<ApplicationFormBasic />} />
        <Route path="application/test" element={<ApplicationFormTest />} />
      </Route>
    </>
  )
);

export default router;
