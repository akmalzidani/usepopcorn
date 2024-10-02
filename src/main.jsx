import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import App from './App.jsx'
// import './index.css'
import StarRating from "./StarRating";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* <App /> */}
    <StarRating
      maxRating={5}
      messages={["Jelek aja belum", "Jelek", "Cukup", "Oke", "GG"]}
      defaultRating={3}
    />
  </StrictMode>
);
