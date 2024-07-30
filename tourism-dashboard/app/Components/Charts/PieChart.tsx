import React, { useMemo } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

// Register the components with Chart.js
Chart.register(ArcElement, Tooltip, Legend);

interface ReviewData {
    "": number;
    date_of_stay: string;
    review: string;
    trip_type: string;
    "Hotel URL": string;
    Sentiment: string;
    Platform: string;
}

interface PieChartProps {
    data: ReviewData[];
}

const PieChart: React.FC<PieChartProps> = ({ data }) => {
    const travelTypeCounts = useMemo(() => {
        const counts: { [key: string]: number } = data.reduce((acc, curr) => {
            const tripType = curr.trip_type;
            if (!acc[tripType]) {
                acc[tripType] = 0;
            }
            acc[tripType] += 1;
            return acc;
        }, {} as { [key: string]: number });

        return Object.entries(counts);
    }, [data]);

    const labels = travelTypeCounts.map(([label]) => label);
    const values = travelTypeCounts.map(([, value]) => value);

    const chartData = {
        labels: labels,
        datasets: [
            {
                label: 'Travel Types',
                data: values,
                backgroundColor: [
                    'rgba(241, 94, 140, 0.6)',
                    'rgba(62, 13, 182, 0.2)',
                    'rgba(116, 222, 226, 0.8)',
                    'rgba(125, 201, 91, 0.1)',
                    'rgba(115, 15, 36, 0.7)',
                    'rgba(58, 19, 200, 0.7)',
                    'rgba(48, 193, 5, 0.9)',
                    'rgba(115, 15, 36, 0.7)'
                ],
                borderWidth: 1,
            },
        ],
    };


    const chartOptions = {
        responsive: true
    };

    return (
        <Pie data={chartData} options={chartOptions} />
    );
};

export default PieChart;
