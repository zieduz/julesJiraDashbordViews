import { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

const API_BASE_URL = 'http://localhost:8000/api';

// --- Components ---

const Card = ({ title, value, children }) => (
  <div className="bg-white shadow-lg rounded-lg p-6">
    <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
    <p className="text-3xl font-bold text-gray-900">{value}</p>
    {children}
  </div>
);

const Section = ({ title, children }) => (
  <section className="mb-8">
    <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {children}
    </div>
  </section>
);

const ChartContainer = ({ title, children }) => (
    <div className="bg-white shadow-lg rounded-lg p-6 mt-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
        <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
                {children}
            </ResponsiveContainer>
        </div>
    </div>
);


// --- Main App ---

function App() {
  const [tickets, setTickets] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [forecast, setForecast] = useState(null);

  useEffect(() => {
    // Fetch tickets
    axios.get(`${API_BASE_URL}/tickets`)
      .then(response => setTickets(response.data))
      .catch(error => console.error('Error fetching tickets:', error));

    // Fetch metrics
    axios.get(`${API_BASE_URL}/metrics`)
      .then(response => {
        const data = response.data;
        // Format date strings for charts
        data.created_per_day.forEach(d => d.created_at = new Date(d.created_at).toLocaleDateString());
        data.resolved_per_day.forEach(d => d.resolved_at = new Date(d.resolved_at).toLocaleDateString());
        setMetrics(data);
      })
      .catch(error => console.error('Error fetching metrics:', error));

    // Fetch forecast
    axios.get(`${API_BASE_URL}/forecast`)
      .then(response => setForecast(response.data))
      .catch(error => console.error('Error fetching forecast:', error));
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Jira Performance Dashboard</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* KPI Cards */}
        <Section title="Overview">
          <Card title="Total Tickets" value={metrics?.total_tickets || '...'} />
          <Card title="Resolved Tickets" value={metrics?.resolved_per_day.reduce((sum, d) => sum + d.count, 0) || '...'} />
          <Card title="Forecasted Velocity (Next 4 weeks)" value={forecast?.next_4_weeks_velocity_forecast.join(', ') || '...'} />
        </Section>

        {/* Charts */}
        {metrics && (
            <ChartContainer title="Tickets Created vs. Resolved per Day">
                <BarChart data={metrics.created_per_day} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="created_at" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8884d8" name="Created" />
                    {/* You might want to merge created and resolved data for a combined chart */}
                </BarChart>
            </ChartContainer>
        )}

        {forecast && (
            <ChartContainer title="Historical and Forecasted Weekly Throughput">
                <LineChart data={forecast.historical_weekly_throughput}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="resolved_at" tickFormatter={(tick) => new Date(tick).toLocaleDateString()} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="count" stroke="#82ca9d" name="Resolved Tickets" />
                </LineChart>
            </ChartContainer>
        )}

      </main>
    </div>
  );
}

export default App;
