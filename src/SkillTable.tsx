import React, { useEffect, useState } from "react";
import Papa from "papaparse";

interface DataItem {
  Course: string;
  "Skill Set": string;
}

const SkillSetCountTable: React.FC = () => {
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

  const skillSetCounts: { [key: string]: Set<string> } = {};

  data.forEach(({ Course, "Skill Set": skill }) => {
    if (!skillSetCounts[skill]) {
      skillSetCounts[skill] = new Set();
    }
    skillSetCounts[skill].add(Course);
  });

  const sortedSkillSets = Object.keys(skillSetCounts).sort(
    (a, b) => skillSetCounts[b].size - skillSetCounts[a].size
  );

  const totalCourses = sortedSkillSets.reduce(
    (sum, skill) => sum + skillSetCounts[skill].size,
    0
  );

  return (
    <div style={{ maxWidth: 800, margin: "2rem auto", textAlign: "center" }}>
      <h3>สรุปจำนวนรายวิชาในแต่ละกลุ่มทักษะ</h3>
      <table
        style={{
          borderCollapse: "collapse",
          width: "100%",
          fontSize: "13px",
        }}
      >
        <thead>
          <tr>
            <th style={{ border: "1px solid #ccc", padding: "6px" }}>Skill Set</th>
            <th style={{ border: "1px solid #ccc", padding: "6px" }}>จำนวนรายวิชา</th>
          </tr>
        </thead>
        <tbody>
          {sortedSkillSets.map((skill) => (
            <tr key={skill}>
              <td style={{ border: "1px solid #ccc", padding: "6px", textAlign: "left" }}>{skill}</td>
              <td style={{ border: "1px solid #ccc", padding: "6px", textAlign: "center" }}>
                {skillSetCounts[skill].size}
              </td>
            </tr>
          ))}
          <tr style={{ fontWeight: "bold", backgroundColor: "#f0f0f0" }}>
            <td style={{ border: "1px solid #ccc", padding: "6px" }}>รวม</td>
            <td style={{ border: "1px solid #ccc", padding: "6px", textAlign: "center" }}>{totalCourses}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default SkillSetCountTable;
