"use client"

import { useState, useEffect } from "react";
import Papa from "papaparse";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ActivityIcon, PercentIcon, TrendingUpIcon, UsersIcon } from "@/components/ui/icons"; // Adjust path
import StatCardItem from "./Components/Stats"
import SentimentTrendsChart from './Components/Charts/LineChart';
import PieChart from './Components/Charts/PieChart';

interface ReviewData {
  "": number; // Assuming this empty key is not actually used
  date_of_stay: string;
  review: string;
  trip_type: string;
  "Hotel URL": string;
  Sentiment: string;
  Platform: string;
}

export default function Home() {
  const [stats, setStats] = useState({
    TotalReviews: 0,
    NewReviews: 0,
    PositivePercentage: 0,
    NegativePercentage: 0,
    Data: [] as ReviewData[],
  });

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('/Data/full_stack_data.csv');
      const text = await response.text();

      Papa.parse<ReviewData>(text, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        complete: (results) => {
          const data = results.data;
          let totalReviews = 0;
          let newReviews = 0;
          let positiveReviews = 0;
          let negativeReviews = 0;

          newReviews = data.filter((row) => {
            const reviewDate = new Date(row.date_of_stay);
            return reviewDate > new Date("01-07-2023");
          }).length;

          //get last row
          let lastRow = data[data.length - 1];
          totalReviews = lastRow[""];

          //filter data by date, anything before 2023-5-1 is considered new
          positiveReviews = data.filter((review) => review.Sentiment === "Positive").length;
          negativeReviews = data.filter((review) => review.Sentiment === "Negative").length;

          const positivePercent = (positiveReviews / totalReviews) * 100;
          const negativePercent = (negativeReviews / totalReviews) * 100;

          setStats({
            TotalReviews: totalReviews,
            NewReviews: newReviews,
            PositivePercentage: positivePercent,
            NegativePercentage: negativePercent,
            Data: data,
          });
        },
      });
    }

    fetchData();
  }, []);

  return (
    <div className="p-4 w-full">
      <Card>
        <CardHeader className="pb-1">
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
            <StatCardItem icon={<UsersIcon />} title="Total Reviews" value={stats.TotalReviews} />
            <StatCardItem icon={<ActivityIcon />} title="New Reviews" value={stats.NewReviews} />
            <StatCardItem icon={<PercentIcon />} title="Positive Reviews" value={`${stats.PositivePercentage.toFixed(2)}%`} />
            <StatCardItem icon={<TrendingUpIcon />} title="Negative Reviews" value={`${stats.NegativePercentage.toFixed(2)}%`} />
          </div>
        </CardContent>
      </Card>

      <div className="min-h-[20vh]">
        <SentimentTrendsChart data={stats.Data} />
      </div>

      <div className="row">
        <div className="col-6">
          <Card className="pt-4">
            <CardHeader className="pb-1">
            </CardHeader>
            <CardContent>
              <PieChart data={stats.Data} />
            </CardContent>
          </Card>
        </div>
        <div className="col-6">
          <Card className="pt-4">
            <CardHeader className="pb-1">
            </CardHeader>
            <CardContent>
              <p>reviews</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}