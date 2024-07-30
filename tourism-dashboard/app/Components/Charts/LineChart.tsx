import React, { useMemo, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import html2canvas from 'html2canvas';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface ReviewData {
    "": number; 
    date_of_stay: string;
    review: string;
    trip_type: string;
    "Hotel URL": string;
    Sentiment: string;
    Platform: string;
}

interface SentimentCounts {
    [key: string]: {
        Positive: number;
        Negative: number;
    };
}

interface SentimentTrendsChartProps {
    data: ReviewData[];
}

const SentimentTrendsChart: React.FC<SentimentTrendsChartProps> = ({ data }) => {
    const chartRef = useRef(null);

    const sentimentCounts = useMemo(() => {
        const counts: SentimentCounts = data.reduce((acc, curr) => {
            const date = new Date(curr.date_of_stay.split('-').reverse().join('-'));
            const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;

            if (!acc[monthYear]) {
                acc[monthYear] = { Positive: 0, Negative: 0 };
            }

            if (curr.Sentiment === 'Positive') {
                acc[monthYear].Positive += 1;
            } else if (curr.Sentiment === 'Negative') {
                acc[monthYear].Negative += 1;
            }

            return acc;
        }, {} as SentimentCounts);

        // Convert to sorted array
        return Object.entries(counts).sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime());
    }, [data]);

    const labels = sentimentCounts.map(([label]) => label);
    const positiveData = sentimentCounts.map(([, value]) => value.Positive);
    const negativeData = sentimentCounts.map(([, value]) => value.Negative);

    const chartData = {
        labels: labels,
        datasets: [
            {
                label: 'Positive Reviews',
                data: positiveData,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
            },
            {
                label: 'Negative Reviews',
                data: negativeData,
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                fill: true,
            },
        ],
    };
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                display: true,
                title: {
                    display: true,
                    text: 'Month-Year'
                }
            },
            y: {
                display: true,
                title: {
                    display: true,
                    text: 'Number of Reviews'
                }
            }
        }
    };

    const handleDownload = async () => {
        if (chartRef.current) {
            const canvas = await html2canvas(chartRef.current);
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = 'sentiment_trends.png';
            link.click();
        }
    };

    return (
        <div className="pt-4" style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 5, cursor: 'pointer', backgroundColor: 'white', borderRadius: '5%', padding: '10px' }} onClick={handleDownload}>
                <FontAwesomeIcon icon={faDownload} />
            </div>
            <div ref={chartRef} style={{ width: '100%', height: '100%' }}>
                <Line data={chartData} options={chartOptions} />
            </div>
        </div>
    );
};

export default SentimentTrendsChart;
