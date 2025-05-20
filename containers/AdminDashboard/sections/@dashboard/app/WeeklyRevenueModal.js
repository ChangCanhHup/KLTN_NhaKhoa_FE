import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { getWeeklyRevenue, getWeeklyRevenueDetails } from '../../../../../services/userService';
import moment from 'moment';
import { formatCurrency } from '../../../../../utils/formatCurrency';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 1000,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  maxHeight: '90vh',
  overflow: 'auto',
};

export default function WeeklyRevenueModal({ isOpen, onClose }) {
  const [weeklyRevenue, setWeeklyRevenue] = useState(0);
  const [revenueDetails, setRevenueDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchWeeklyRevenueData();
    }
  }, [isOpen]);

  const fetchWeeklyRevenueData = async () => {
    try {
      setLoading(true);

      // Lấy tổng doanh thu trong tuần từ API (giống như trong label)
      const revenueResponse = await getWeeklyRevenue();
      if (revenueResponse && revenueResponse.errCode === 0) {
        // Lấy tổng doanh thu từ API
        const totalWeeklyRevenue = revenueResponse.data.totalWeeklyRevenue;
        console.log('Total weekly revenue from API:', totalWeeklyRevenue);

        // Cập nhật state với tổng doanh thu từ API
        setWeeklyRevenue(totalWeeklyRevenue);

        // Lấy thông tin về khoảng thời gian tuần hiện tại
        const startOfWeek = revenueResponse.data.startOfWeek;
        const endOfWeek = revenueResponse.data.endOfWeek;

        console.log(`Fetching revenue details from ${startOfWeek} to ${endOfWeek}`);

        // Lấy chi tiết doanh thu từ API mới
        const detailsResponse = await getWeeklyRevenueDetails();
        console.log('Weekly revenue details response:', detailsResponse);

        if (detailsResponse && detailsResponse.errCode === 0 && detailsResponse.data.histories) {
          // Lấy danh sách chi tiết từ API
          const histories = detailsResponse.data.histories;
          console.log(`Found ${histories.length} history records`);

          // Chuyển đổi dữ liệu history thành định dạng phù hợp để hiển thị
          const formattedHistories = histories.map(history => ({
            id: history.id,
            patientData: history.patientData,
            doctorData: history.doctorDataHistory,
            date: history.bookingData ? history.bookingData.date : null,
            specialtyData: history.specialtyDataHistory,
            historyData: {
              id: history.id,
              totalFee: history.totalFee,
              paymentStatus: history.paymentStatus,
              examinationFee: history.examinationFee,
              additionalFee: history.additionalFee,
              totalDiscount: history.totalDiscount,
              paymentMethod: history.paymentMethod
            }
          }));

          // Sắp xếp theo thời gian tạo giảm dần
          formattedHistories.sort((a, b) => {
            if (!a.date || !b.date) return 0;
            return new Date(b.date) - new Date(a.date);
          });

          console.log('Formatted histories:', formattedHistories);

          // Cập nhật danh sách chi tiết
          setRevenueDetails(formattedHistories);
        }
      }
    } catch (error) {
      console.error('Error fetching weekly revenue data:', error);
    } finally {
      setLoading(false);
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
          Chi tiết doanh thu tuần này (Thứ 2 - Chủ nhật)
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          Tổng doanh thu (đã thanh toán): {formatCurrency(weeklyRevenue)}
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
          {revenueDetails.length > 0
            ? `Hiển thị ${revenueDetails.length} ca khám đã hoàn thành`
            : weeklyRevenue > 0
              ? 'Đang tải danh sách ca khám...'
              : 'Không có ca khám nào trong tuần này'}
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tên bệnh nhân</TableCell>
                <TableCell>Tên bác sĩ</TableCell>
                <TableCell>Ngày khám</TableCell>
                <TableCell>Dịch vụ</TableCell>
                <TableCell>Chi tiết phí</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Đang tải dữ liệu...
                  </TableCell>
                </TableRow>
              ) : revenueDetails.length > 0 ? (
                revenueDetails.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>{`${booking.patientData?.lastName || ''} ${booking.patientData?.firstName || ''}`}</TableCell>
                    <TableCell>{`${booking.doctorData?.lastName || ''} ${booking.doctorData?.firstName || ''}`}</TableCell>
                    <TableCell>{moment(booking.date).format('DD/MM/YYYY')}</TableCell>
                    <TableCell>{booking.specialtyData?.name || 'N/A'}</TableCell>
                    <TableCell>
                      {booking.historyData ? (
                        <div>
                          <div><strong>Tổng phí:</strong> {formatCurrency(booking.historyData.totalFee || 0)}</div>
                          {booking.historyData.examinationFee > 0 && (
                            <div><small>Phí khám: {formatCurrency(booking.historyData.examinationFee)}</small></div>
                          )}
                          {booking.historyData.additionalFee > 0 && (
                            <div><small>Phí phát sinh: {formatCurrency(booking.historyData.additionalFee)}</small></div>
                          )}
                          {booking.historyData.totalDiscount > 0 && (
                            <div><small>Giảm giá: {formatCurrency(booking.historyData.totalDiscount)}</small></div>
                          )}
                          <div style={{ marginTop: '5px' }}>
                            {booking.historyData.paymentStatus ?
                              <small style={{ color: 'green', fontWeight: 'bold' }}>Đã thanh toán</small> :
                              <small style={{ color: 'red', fontWeight: 'bold' }}>Chưa thanh toán</small>
                            }
                          </div>
                        </div>
                      ) : 'Chưa có hóa đơn'}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    {weeklyRevenue > 0
                      ? 'Đang tải chi tiết ca khám...'
                      : 'Không có dữ liệu ca khám đã hoàn thành trong tuần này'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Modal>
  );
}
