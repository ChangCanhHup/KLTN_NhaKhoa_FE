import React, { useState, useEffect } from "react";
import { merge } from "lodash";
import ReactApexChart from "react-apexcharts";
// material
import { Card, CardHeader, Box } from "@mui/material";
// antd
import { DatePicker, message } from "antd";
import dayjs from "dayjs";
//
import { BaseOptionChart } from "../../../components/charts";
import { getRevenueByDateRange } from "../../../../../services/userService";
import { FormattedMessage } from "react-intl";

const { RangePicker } = DatePicker;

export default function AppRevenueByDateRange() {
  const [chartData, setChartData] = useState([]);
  const [labels, setLabels] = useState([]);
  const [selectedDateRange, setSelectedDateRange] = useState([
    dayjs().subtract(7, "days"),
    dayjs(),
  ]);

  // Fetch data based on date range
  const fetchRevenueData = async (startDate, endDate) => {
    try {
      const formattedStartDate = startDate.format("YYYY-MM-DD");
      const formattedEndDate = endDate.format("YYYY-MM-DD");

      const res = await getRevenueByDateRange(
        formattedStartDate,
        formattedEndDate
      );
      if (res && res.errCode === 0) {
        const data = res.data;

        // Process data for chart
        const revenueData = data.map((item) => item.revenue);
        const dateLabels = data.map((item) =>
          dayjs(item.date).format("DD/MM/YYYY")
        );
        if (revenueData.length === 1) {
          setChartData([{ name: "Doanh thu", data: revenueData, type: "line" }]); // Dùng line chart cho 1 giá trị
        } else {
          setChartData([{ name: "Doanh thu", data: revenueData, type: "bar" }]); // Dùng bar chart cho nhiều giá trị
        }
        setLabels(dateLabels);
      } else {
        message.error("Không có dữ liệu trong khoảng ngày này.");
        setChartData([]);
        setLabels([]);
      }
    } catch (error) {
      console.error("Error fetching revenue data:", error);
      message.error("Lỗi khi tải dữ liệu.");
    }
  };

  useEffect(() => {
    const [startDate, endDate] = selectedDateRange;
    fetchRevenueData(startDate, endDate);
  }, [selectedDateRange]);

  const chartOptions = merge(BaseOptionChart(), {
    chart: {
      type: "bar",
      zoom: { enabled: false },
    },
    stroke: { width: [2] },
    plotOptions: {
      bar: { columnWidth: "50%", borderRadius: 4 },
    },
    xaxis: {
      categories: labels,
    },
    yaxis: {
      labels: {
        formatter: (value) =>
          new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(value),
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (y) =>
          y
            ? new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(y)
            : y,
      },
    },
  });

  return (
    <Card>
      <CardHeader
        title={"Doanh thu theo khoảng thời gian"}
        subheader="Chọn khoảng ngày để xem doanh thu"
      />
      <Box sx={{ p: 3 }}>
        <RangePicker
          value={selectedDateRange}
          onChange={(dates) => {
            if (dates && dates[0] && dates[1]) {
              setSelectedDateRange(dates);
            } else {
              message.warning("Vui lòng chọn khoảng ngày hợp lệ.");
            }
          }}
          format="YYYY-MM-DD"
        />
      </Box>
      <Box sx={{ p: 3, pb: 1 }} dir="ltr">
        {chartData.length !== 0 && (
          <ReactApexChart
            type="bar"
            series={chartData}
            options={chartOptions}
            height={364}
          />
        )}
      </Box>
    </Card>
  );
}
