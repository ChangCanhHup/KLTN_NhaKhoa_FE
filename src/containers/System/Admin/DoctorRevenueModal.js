import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Stack, TextField } from '@mui/material';
import { getDoctorRevenueByDateRange } from '../../../services/userService';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';
import ReactApexChart from 'react-apexcharts';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 900,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  maxHeight: '90vh',
  overflow: 'auto'
};

export default function DoctorRevenueModal({ isOpen, onClose, doctorId, doctorName }) {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState(['', '']);
  const [revenueData, setRevenueData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [doctorInfo, setDoctorInfo] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [labels, setLabels] = useState([]);

  useEffect(() => {
    if (isOpen && doctorId) {
      fetchDoctorRevenue();
    }
  }, [isOpen, doctorId]);

  const fetchDoctorRevenue = async () => {
    try {
      setLoading(true);

      // Lấy startDate và endDate từ state
      let startDate = dateRange[0] || moment().subtract(30, 'days').format('YYYY-MM-DD');
      let endDate = dateRange[1] || moment().format('YYYY-MM-DD');

      console.log(`Fetching revenue for doctor ${doctorId} from ${startDate} to ${endDate}`);

      // Gọi API để lấy doanh thu của bác sĩ
      const response = await getDoctorRevenueByDateRange(doctorId, startDate, endDate);
      console.log('Response from getDoctorRevenueByDateRange:', response);

      if (response && response.errCode === 0) {
        const { doctor, revenueData, totalRevenue } = response.data;

        setDoctorInfo(doctor);
        setRevenueData(revenueData);
        setTotalRevenue(totalRevenue);

        // Chuẩn bị dữ liệu cho biểu đồ
        if (revenueData && revenueData.length > 0) {
          const chartRevenue = revenueData.map(item => item.revenue);
          const dateLabels = revenueData.map(item => moment(item.date).format('DD/MM/YYYY'));

          console.log('Chart data:', chartRevenue);
          console.log('Chart labels:', dateLabels);

          setChartData([{ name: 'Doanh thu', data: chartRevenue }]);
          setLabels(dateLabels);
        } else {
          console.log('No revenue data available');
          setChartData([]);
          setLabels([]);
        }
      } else {
        console.error('Error in API response:', response);
      }
    } catch (error) {
      console.error('Error fetching doctor revenue:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartDateChange = (event) => {
    const startDate = event.target.value;
    setDateRange([startDate, dateRange[1]]);
  };

  const handleEndDateChange = (event) => {
    const endDate = event.target.value;
    setDateRange([dateRange[0], endDate]);
  };

  const handleApplyDateFilter = () => {
    if (dateRange[0] && dateRange[1]) {
      fetchDoctorRevenue();
    }
  };

  // Cấu hình biểu đồ
  const chartOptions = {
    chart: {
      height: 350,
      type: 'bar',
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded'
      },
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: labels,
    },
    yaxis: {
      title: {
        text: 'VND'
      }
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' VND';
        }
      }
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
          Doanh thu của bác sĩ {doctorName || (doctorInfo ? `${doctorInfo.lastName} ${doctorInfo.firstName}` : '')}
        </Typography>

        <Stack direction="row" spacing={2} sx={{ mb: 3 }} alignItems="center">
          <TextField
            label="Từ ngày"
            type="date"
            value={dateRange[0]}
            onChange={handleStartDateChange}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ width: 150 }}
          />
          <TextField
            label="Đến ngày"
            type="date"
            value={dateRange[1]}
            onChange={handleEndDateChange}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ width: 150 }}
          />
          <Button
            variant="contained"
            onClick={handleApplyDateFilter}
            disabled={!dateRange[0] || !dateRange[1]}
          >
            Áp dụng
          </Button>
        </Stack>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
            <Typography>Đang tải dữ liệu...</Typography>
          </Box>
        ) : (
          <>
            {chartData.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <ReactApexChart
                  options={chartOptions}
                  series={chartData}
                  type="bar"
                  height={350}
                />
              </Box>
            )}

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Ngày</TableCell>
                    <TableCell align="right">Doanh thu (VND)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {revenueData.length > 0 ? (
                    revenueData.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{moment(item.date).format('DD/MM/YYYY')}</TableCell>
                        <TableCell align="right">{item.revenue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={2} align="center">
                        Không có dữ liệu doanh thu trong khoảng thời gian này
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <Typography variant="h6" sx={{ mt: 2, textAlign: 'right' }}>
              Tổng doanh thu: {totalRevenue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} VND
            </Typography>
          </>
        )}
      </Box>
    </Modal>
  );
}
