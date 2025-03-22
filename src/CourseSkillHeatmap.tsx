import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import Papa from "papaparse";

interface DataItem {
  Course: string;
  "Skill Set": string;
}

const CourseSkillHeatmap: React.FC = () => {
  const [data, setData] = useState<DataItem[]>([]);

  useEffect(() => {
    Papa.parse("/dsbi-mapping/93_course_vs_skill_set.csv", {
      download: true,
      header: true,
      complete: (result) => {
        const parsed = result.data as DataItem[];
        setData(parsed);
      },
    });
  }, []);

  const courses = Array.from(new Set(data.map((d) => d.Course))).sort();
  const skillSets = Array.from(new Set(data.map((d) => d["Skill Set"]))).sort();

  const matrix = courses.map((course) =>
    skillSets.map((skill) =>
      data.some((d) => d.Course === course && d["Skill Set"] === skill) ? 1 : 0
    )
  );

  return (
    <div style={{ overflowX: "auto" }}>
      <h3
        style={{
          fontSize: "20px",
          marginBottom: "20px",
          color: "#000",
          backgroundColor: "#f0f0f0",
          padding: "10px",
          borderRadius: "5px",
        }}
      >
        <center>Heatmap: รายวิชากับกลุ่มทักษะ</center>
      </h3>

      <Plot
        data={[
          {
            z: matrix,
            x: skillSets,
            y: courses,
            type: "heatmap",
            colorscale: [
              [0, "rgba(204,229,255,0.1)"],
              [0.2, "rgba(173,216,230,0.3)"],
              [0.4, "rgba(135,206,250,0.5)"],
              [0.6, "rgba(100,149,237,0.6)"],
              [0.8, "rgba(70,130,180,0.7)"],
              [1, "rgba(131, 190, 218, 0.8)"]
            ],
            showscale: false,
            hovertemplate: "%{y}<extra></extra>",
          },
        ]}
        layout={{
          autosize: true,
          width: 1300,
          height: 1100,
          margin: { l: 350, r: 200, t: 300, b: 0 },
          font: { size: 12 },
          xaxis: { title: "Skill Set", tickangle: -50, side: "top" },
          yaxis: { title: "Course" },
        }}
        config={{ responsive: true }}
      />
    </div>
  );
};

export default CourseSkillHeatmap;
