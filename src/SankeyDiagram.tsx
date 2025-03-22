import { useEffect, useState } from "react";
import Plot from "react-plotly.js";

const SankeyDiagram = () => {
  const [data, setData] = useState<{
    nodes: string[];
    sourceNodes: number[];
    targetNodes: number[];
    values: number[];
    linkColors: string[];
    nodeColors: string[];
  } | null>(null);

  const [highlightedNode, setHighlightedNode] = useState<number | null>(null);
  

  useEffect(() => {
    fetch("/dsbi-mapping/merged_data.csv")
      .then((response) => response.text())
      .then((csvText) => {
        const rows = csvText.split("\n").slice(1);
        let nodes = new Set<string>();
        let links: { source: string; target: string }[] = [];

        rows.forEach((row) => {
          const cols = row.split(",");
          if (cols.length >= 5) {
            let [plo, subPlo, course, skillSet, career] = cols;
            nodes.add(plo);
            nodes.add(subPlo);
            nodes.add(course);
            nodes.add(skillSet);
            nodes.add(career);

            links.push({ source: plo, target: subPlo });
            links.push({ source: subPlo, target: course });
            links.push({ source: course, target: skillSet });
            links.push({ source: skillSet, target: career });
          }
        });

        let nodesArray = Array.from(nodes);
        let nodeIndices: Record<string, number> = Object.fromEntries(
          nodesArray.map((node, index) => [node, index])
        );

        let sourceNodes = links.map((link) => nodeIndices[link.source]);
        let targetNodes = links.map((link) => nodeIndices[link.target]);
        let values = new Array(links.length).fill(1);

        // ฟังก์ชันกำหนดสีของโหนดตามประเภท และทำให้สีอ่อนลงอีก
        const getNodeColor = (node: string): string => {
          if (node.includes("PLO") || node.includes("sub-PLO")) return "#D8D8D8"; // สีเทาเข้มขึ้น
          if (/data|science|analytics|deep|program|computer|analysis/i.test(node))
            return [
              "#FFE08C", "#FFCC99", "#FFB3B3", "#FFAAAA",
              "#FDB897", "#FFDFC2", "#F7BABA", "#FFD1B3"
            ][Math.floor(Math.random() * 8)]; // โทนร้อนเข้มขึ้นเล็กน้อย
          if (node.includes("Business"))
            return ["#C5E0F7", "#B5D3F2", "#C1E3E0", "#C2E9DA", "#C2E5E3", "#C5E0F7"][
              Math.floor(Math.random() * 6)
            ]; // โทนเย็นเข้มขึ้นเล็กน้อย
          if (node.includes("Innovation")) return ["#E0E0E0", "#C8C8C8"][Math.floor(Math.random() * 2)]; // โทนเทาเข้มขึ้น
          return "#E5C2FF"; // สีพาสเทลเข้มขึ้นเล็กน้อย          
        };

        const nodeColors = nodesArray.map(getNodeColor);
        const linkColors = sourceNodes.map((sourceIndex) => nodeColors[sourceIndex]);

        setData({
          nodes: nodesArray,
          sourceNodes,
          targetNodes,
          values,
          linkColors,
          nodeColors,
        });
      });
  }, []);

  const handleNodeClick = (event: any) => {
    if (event.points && event.points.length > 0) {
      const nodeIndex = event.points[0].pointNumber;
      setHighlightedNode(nodeIndex);
    }
  };

  return (
    <div>
      <h2></h2>
      <h3 style={{ fontSize: "22px", marginBottom: "20px" }}><center>
      การเชื่อมโยงผลลัพธ์การเรียนรู้ของหลักสูตร (PLOs) กับรายวิชา, ทักษะที่จำเป็น, และเส้นทางอาชีพ
      </center>
      </h3>
      {data && (
        <Plot
          data={[
            {
              type: "sankey",
              orientation: "h",
              node: {
                pad: 15,
                thickness: 20,
                label: data?.nodes || [],
                color: data?.nodes.map((_, i) =>
                  i === highlightedNode ? "rgba(0, 0, 0, 0.8)" : data.nodeColors[i]
                ),
              },
              link: {
                source: data?.sourceNodes || [],
                target: data?.targetNodes || [],
                value: data?.values || [],
                color: data?.sourceNodes.map((sourceIndex, i) =>
                  highlightedNode !== null &&
                  (sourceIndex === highlightedNode || data.targetNodes[i] === highlightedNode)
                    ? "rgba(0, 0, 0, 0.75)"
                    : data.linkColors[i]
                ),
              },
            },
          ]}
          layout={{
                       
            font: { size: 12 },
            width: 1800,
            height: 1400,
          }}
          onClick={handleNodeClick}
        />
      )}
    </div>
  );
};

export default SankeyDiagram;
