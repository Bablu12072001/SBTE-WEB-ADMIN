import React, { useState } from "react";
import Sidebar from "./components/Sidebar";

const AdminLayout = ({ children }) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="flex">
      {/* <Sidebar expanded={expanded} setExpanded={setExpanded} /> */}
      <main>{children}</main>
    </div>
  );
};

export default AdminLayout;
