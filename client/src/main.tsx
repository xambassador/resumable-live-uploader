import ReactDOM from "react-dom/client";

// ------------------------------------------------------------------------------------------
import App from "./App";

// ------------------------------------------------------------------------------------------
import { UploadProvider } from "./context";

// ------------------------------------------------------------------------------------------
import "./index.css";

// ------------------------------------------------------------------------------------------

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <UploadProvider>
    <App />
  </UploadProvider>
);
