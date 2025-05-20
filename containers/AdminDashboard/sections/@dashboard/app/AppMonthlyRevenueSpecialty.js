import { merge } from "lodash";
import ReactApexChart from "react-apexcharts";
// material
import { Box, Card, CardHeader } from "@mui/material";
// utils
//
import { BaseOptionChart } from "../../../components/charts";

import React, { useState, useEffect } from "react";
import { getMonthlyRevenueSpecialty } from "../../../../../services/userService";
import { FormattedMessage } from "react-intl";

// ----------------------------------------------------------------------

export default function AppMonthlyRevenueSpecialty() {
  const [dataMonthRevenueSpecialty, setDataMonthRevenueSpecialty] = useState(
    []
  );
  const [chartData, setChartData] = useState([]);
  const [chartOptionsState, setChartOptionsState] = useState({});

  const chartOptions = merge(BaseOptionChart(), {
    tooltip: {
      marker: { show: false },
      y: {
        formatter: (value) =>
          new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(value), // Format as VND
        title: {
          formatter: (seriesName) => `${seriesName}`,
        },
      },
    },
    plotOptions: {
      bar: { horizontal: true, barHeight: "28%", borderRadius: 2 },
    },
    xaxis: {
      categories: [],
    },
  });

  useEffect(() => {
    const fetchMonthlyRevenueSpecialty = async () => {
      let res = await getMonthlyRevenueSpecialty();
      if (res && res.errCode === 0) {
        if (res.data) {
          setDataMonthRevenueSpecialty(res.data);
        }
      }
    };
    fetchMonthlyRevenueSpecialty();
  }, []);

  useEffect(() => {
    const CHART_DATA = [];
    const data = [];
    const categories = [];
    const obj = {};

    dataMonthRevenueSpecialty.forEach((item) => {
      data.push(parseInt(item.totalRevenueMonth));
      categories.push(item.name);
    });

    if (data.length > 0) {
      obj.data = data;
      CHART_DATA.push(obj);
    }

    if (CHART_DATA.length > 0) {
      setChartData(CHART_DATA);
    }

    if (categories.length > 0) {
      chartOptions.xaxis.categories = categories;
      setChartOptionsState(chartOptions);
    }
  }, [dataMonthRevenueSpecialty]);

  const month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const d = new Date();
  const currentMonth = month[d.getMonth()];

  return (
    <Card>
      <CardHeader
        title={
          <FormattedMessage
            id={"admin-dashboard.dashboard.monthly-revenue-specialty"}
          />
        }
        subheader={currentMonth}
      />
      <Box sx={{ mx: 3 }} dir="ltr">
        <ReactApexChart
          type="bar"
          series={chartData}
          options={chartOptionsState}
          height={364}
        />
      </Box>
    </Card>
  );
}
