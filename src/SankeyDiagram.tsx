import React from "react";
import Plot from "react-plotly.js";

const SankeyDiagram: React.FC = () => {
  const data = {
    labels: [
      "math",
      "data visualization",
      "introduction to data science",
      "introduction to business",
      "finanace",
      "data privacy",
      "presentation",
      "data science",
      "machine learning",
      "Data analyst",
      "Data science"
    ],
    source: [0, 1, 2, 2, 3, 3, 4, 5, 1, 1, 6, 6, 6, 6, 7, 8],
    target: [1, 1, 6, 6, 6, 6, 7, 8, 9, 9, 9, 10, 9, 10, 10, 10],
    value: [1, 1, 1, 2, 2, 1, 1, 2, 1, 2, 2]
  };

  return (
    <Plot
      data={[
        {
          type: "sankey",
          orientation: "h",
          node: {
            pad: 15,
            thickness: 20,
            line: { color: "black", width: 0.5 },
            label: data.labels,
            color: "lightblue",
          },
          link: {
            source: data.source,
            target: data.target,
            value: data.value,
          },
        },
      ]}
      layout={{ title: "Career Path Sankey Diagram", height: 500, width: 800 }}
    />
  );
};

export default SankeyDiagram;
