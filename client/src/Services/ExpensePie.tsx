import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
  } from "recharts";

  
  interface PieData {
    category: string;
    amount: number;
  }
  
  interface ExpensePieProps {
    data: PieData[];
  }
  
  const COLORS = [
    "#F4D35E", // golden yellow
    "#EEB902", // mustard yellow
    "#A7C957", // light olive green
    "#6A994E", // medium green
    "#386641", // dark green
  ];
  
  export default function ExpensePie({ data }: ExpensePieProps) {
    return (
        <PieChart width={400} height={400}  style={{ outline: 'none' }} >
        <Pie
          style={{ outline: 'none' }}
          data={data}
          dataKey="amount"
          nameKey="category"
          outerRadius={120}
          label
        >
          {data.map((_, index) => (
            <Cell
              key={index}
              fill={COLORS[index % COLORS.length]}
              style={{ outline: 'none' }} 
            />
          ))}
        </Pie>
  
        <Tooltip />
        <Legend />
      </PieChart>  
    );
  }