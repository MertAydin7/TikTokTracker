import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Box, CircularProgress, Typography } from '@mui/material';

const EngagementChart = ({ data, loading }) => {
  // If no data or empty data array, show placeholder
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Typography variant="body1" color="text.secondary">
          No engagement data available
        </Typography>
      </Box>
    );
  }

  // Sample data format if real data is not available
  const sampleData = data.length > 0 ? data : [
    { date: '2025-03-22', likes: 5, views: 12, fypAppearances: 3 },
    { date: '2025-03-23', likes: 8, views: 15, fypAppearances: 4 },
    { date: '2025-03-24', likes: 3, views: 10, fypAppearances: 2 },
    { date: '2025-03-25', likes: 7, views: 18, fypAppearances: 5 },
    { date: '2025-03-26', likes: 10, views: 22, fypAppearances: 7 },
    { date: '2025-03-27', likes: 6, views: 14, fypAppearances: 4 },
    { date: '2025-03-28', likes: 12, views: 25, fypAppearances: 8 },
    { date: '2025-03-29', likes: 9, views: 20, fypAppearances: 6 },
    { date: '2025-03-30', likes: 11, views: 23, fypAppearances: 7 },
    { date: '2025-03-31', likes: 15, views: 30, fypAppearances: 10 },
    { date: '2025-04-01', likes: 13, views: 28, fypAppearances: 9 },
    { date: '2025-04-02', likes: 18, views: 35, fypAppearances: 12 },
    { date: '2025-04-03', likes: 14, views: 29, fypAppearances: 8 },
    { date: '2025-04-04', likes: 16, views: 32, fypAppearances: 11 },
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={sampleData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="likes" stroke="#fe2c55" activeDot={{ r: 8 }} name="Likes" />
        <Line type="monotone" dataKey="views" stroke="#25f4ee" name="Views" />
        <Line type="monotone" dataKey="fypAppearances" stroke="#8884d8" name="FYP Appearances" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default EngagementChart;
