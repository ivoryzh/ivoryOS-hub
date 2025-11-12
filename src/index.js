import React from "react";
import ReactDOM from "react-dom/client";
import IvoryOSHub from "./App"; // note: no .jsx needed, React resolves it
import './index.css';


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<IvoryOSHub />);