import React from "react";
import SankeyDiagram from "./SankeyDiagram";  // ต้องมีไฟล์ SankeyDiagram.tsx

const App: React.FC = () => {
  return (
    <div>
      <h1>Interactive Sankey Diagram</h1>
      <SankeyDiagram />
    </div>
  );
};

export default App;
