import React, { useEffect } from "react";
import SankeyDiagram from "./SankeyDiagram";
import RadarChart from "./RadarChart"; // เปลี่ยน path เป็น "./RadarChart"

const App: React.FC = () => {
  useEffect(() => {
    document.title = "DSBI : Data Science and Business Innovation @RMUTTO";
  }, []);

  return (
    <div>
      <h2><center>หลักสูตร วท.บ. วิทยาการข้อมูลและนวัตกรรมธุรกิจ (ปรับปรุง พ.ศ.2569) <br/> คณะบริหารธุรกิจและเทคโนโลยีสารสนเทศ มหาวิทยาลัยเทคโนโลยีราชมงคลตะวันออก</center></h2>
      <SankeyDiagram />
      <RadarChart /> {/* แสดง Radar Chart */}
    </div>
  );
};

export default App;



