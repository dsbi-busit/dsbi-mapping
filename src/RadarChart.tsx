import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";

// 🔹 ฟังก์ชันกำหนดสีแบบพาสเทล (เปลี่ยนสีเขียวเป็น #92CA68)
const pastelColors = [
  "#FFB6B9", "#BBDED6", "#8AC6D1", "#E2AF90", "#EB6E44",
  "#F6D55C", "#FF9967", "#FCCF55", "#92CA68", "#B5EAD7",
  "#C5E1A5", "#D4EFDF", "#A2D9CE", "#66B2FF", "#99CCFF"
];

// 🔹 ฟังก์ชันเลือกสีที่ไม่ซ้ำกัน
const getPastelColor = (index: number) => pastelColors[index % pastelColors.length];

const RadarChart: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
//   const [skillSets, setSkillSets] = useState<string[]>([]);
  const [_, setSkillSets] = useState<string[]>([]);
  const [careers, setCareers] = useState<string[]>([]);
  const [selectedCareer, setSelectedCareer] = useState<string>("All"); // ค่าเริ่มต้นคือ "All"
  const csvPath = "/dsbi-mapping/merged_data.csv"; // ใช้ path ที่ถูกต้อง

  useEffect(() => {
    const loadData = async () => {
      const response = await fetch(csvPath);
      if (!response.ok) throw new Error("Failed to fetch CSV file");
      const csvData = await response.text();
      if (!csvData) return;

      const rows = csvData.split("\n").map(row => row.split(","));
      if (rows.length < 2) return;

      const headers = rows[0].map(h => h.trim());
      const skillSetIndex = headers.indexOf("Skill Set");
      const careerIndex = headers.indexOf("Career");

      if (skillSetIndex === -1 || careerIndex === -1) return;

      const skillCareerMap: { [key: string]: { [key: string]: number } } = {};

      rows.slice(1).forEach(row => {
        if (row.length < headers.length) return;

        const skill = row[skillSetIndex]?.trim();
        const career = row[careerIndex]?.trim();
        if (!skill || !career) return;

        if (!skillCareerMap[skill]) skillCareerMap[skill] = {};
        skillCareerMap[skill][career] = (skillCareerMap[skill][career] || 0) + 1;
      });

      const skillSetList = Object.keys(skillCareerMap);
      const careerList = [...new Set(rows.slice(1).map(row => row[careerIndex]?.trim()))].filter(Boolean);

      setSkillSets(skillSetList);
      setCareers(["All", ...careerList]);

      // ✅ **ใช้สีใหม่ และเพิ่มความโปร่งแสง (`fillcolor + "80"`)**
      const radarData = careerList.map((career, index) => ({
        type: "scatterpolar",
        r: skillSetList.map(skill => skillCareerMap[skill]?.[career] ? Math.max(1, skillCareerMap[skill][career]) : 1),
        theta: skillSetList,
        fill: "toself",
        name: career,
        line: { color: getPastelColor(index), width: 3 },
        fillcolor: getPastelColor(index) + "80", // ✅ ปรับโปร่งแสง 50%
      }));

      setData(radarData);
    };

    loadData();
  }, []);

  const handleCareerChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCareer(event.target.value);
  };

  const filteredData = selectedCareer === "All" ? data : data.filter(d => d.name === selectedCareer);

  return (
    <div style={{ textAlign: "center", fontFamily: "Arial, sans-serif" }}>
      <h3 style={{ fontSize: "20px", marginBottom: "20px" }}>
        การกระจายทักษะที่จำเป็นในแต่ละสายอาชีพ
      </h3>

      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="career-select" style={{ fontSize: "20px", marginRight: "10px" }}>
          เลือกสายอาชีพ:
        </label>
        <select
          id="career-select"
          value={selectedCareer}
          onChange={handleCareerChange}
          style={{
            fontSize: "18px",
            padding: "8px 12px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            cursor: "pointer"
          }}
        >
          {careers.map(career => (
            <option key={career} value={career}>{career}</option>
          ))}
        </select>
      </div>

      {/* แสดง Radar Chart */}
      <Plot
        data={filteredData}
        layout={{
          title: selectedCareer === "All" ? "Skill Set Distribution Across Careers" : `Skill Set for ${selectedCareer}`,
          polar: {
            domain: { x: [0.15, 0.85], y: [0.15, 0.85] },
            radialaxis: { visible: true, range: [0, 10] }, // ✅ แกน 0-10
            angularaxis: {
              tickfont: { size: 14, color: "#000" },
              rotation: 45,
              direction: "clockwise",
            },
          },
          width: 1300,
          height: 800,
          margin: { l: 200, r: 150, t: 0, b: 0 },
          showlegend: true,
          legend: {
            x: 1.1,
            y: 1,
            font: { size: 12 },
          },
          font: { size: 14 },
        }}
      />
    </div>
  );
};

export default RadarChart;
