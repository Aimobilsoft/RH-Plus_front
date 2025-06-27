
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";



// Datos de ejemplo para el gráfico
const mockData = [
  { month: "Ene", pacientes: 65, ordenes: 28 },
  { month: "Feb", pacientes: 59, ordenes: 48 },
  { month: "Mar", pacientes: 80, ordenes: 40 },
  { month: "Abr", pacientes: 81, ordenes: 27 },
  { month: "May", pacientes: 56, ordenes: 33 },
  { month: "Jun", pacientes: 55, ordenes: 30 },
  { month: "Jul", pacientes: 40, ordenes: 20 },
];

interface StatCardProps {
  title: string;
  value: string;
  description: string;
}

const StatCard = ({ title, value, description }: StatCardProps) => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const [chartPeriod, setChartPeriod] = useState<"day" | "month" | "year">("month");

  // Simular una consulta a la API
  // En un entorno real, reemplazaríamos esto con llamadas reales
  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      try {
        // Simular datos mientras la API no esté disponible
        return {
          totalEmpresas: 125,
          totalPacientes: 1543,
          citasHoy: 32,
          ordenesHoy: 15
        };
        // Descomentar para usar la API real cuando esté disponible
        // return await api.get<any>("/dashboard/stats");
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        throw error;
      }
    },
    // Desactivar la petición real por ahora
    enabled: false,
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button 
              size="sm" 
              variant={chartPeriod === "day" ? "default" : "outline"}
              onClick={() => setChartPeriod("day")}
            >
              Día
            </Button>
            <Button 
              size="sm" 
              variant={chartPeriod === "month" ? "default" : "outline"}
              onClick={() => setChartPeriod("month")}
            >
              Mes
            </Button>
            <Button 
              size="sm" 
              variant={chartPeriod === "year" ? "default" : "outline"}
              onClick={() => setChartPeriod("year")}
            >
              Año
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Empresas Afiliadas"
          value={isLoading ? "..." : `${stats?.totalEmpresas || 125}`}
          description="Total de empresas registradas"
        />
        <StatCard
          title="Pacientes"
          value={isLoading ? "..." : `${stats?.totalPacientes || 1543}`}
          description="Pacientes activos en el sistema"
        />
        <StatCard
          title="Citas Hoy"
          value={isLoading ? "..." : `${stats?.citasHoy || 32}`}
          description="Programadas para hoy"
        />
        <StatCard
          title="Órdenes"
          value={isLoading ? "..." : `${stats?.ordenesHoy || 15}`}
          description="Emitidas hoy"
        />
      </div>

      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Actividad</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={mockData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="pacientes"
                  stroke="#1e40af"
                  activeDot={{ r: 8 }}
                />
                <Line type="monotone" dataKey="ordenes" stroke="#059669" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
