import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Avatar } from '@mui/material';
import { getAllUsers, getTotalNewUserDay } from '../../../../../services/userService';
import { Buffer } from 'buffer';
import moment from 'moment';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

export default function NewUsersModal({ isOpen, onClose }) {
  const [newUsers, setNewUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchNewUsers();
    }
  }, [isOpen]);

  const fetchNewUsers = async () => {
    try {
      setLoading(true);

      // Lấy tổng số người dùng mới trong ngày
      const totalNewUserResponse = await getTotalNewUserDay();
      let totalNewUsers = 0;

      if (totalNewUserResponse && totalNewUserResponse.errCode === 0) {
        totalNewUsers = totalNewUserResponse.data.totalNewUserDay;
      }

      // Lấy tất cả người dùng
      const response = await getAllUsers('ALL');
      if (response && response.errCode === 0) {
        // Lọc người dùng được tạo trong ngày hiện tại
        const currentDate = moment().format('YYYY-MM-DD');

        const todayUsers = response.users.filter(user => {
          const userCreatedDate = moment(user.createdAt).format('YYYY-MM-DD');
          return userCreatedDate === currentDate;
        });

        // Sắp xếp người dùng theo thời gian tạo mới nhất
        const sortedUsers = todayUsers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setNewUsers(sortedUsers);
      }
    } catch (error) {
      console.error('Error fetching new users:', error);
    } finally {
      setLoading(false);
    }
  };

  const convertBufferToBase64 = (buffer) => {
    if (!buffer) return '';
    try {
      return new Buffer(buffer, 'base64').toString('binary');
    } catch (error) {
      console.error('Error converting buffer to base64:', error);
      return '';
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
          Người dùng mới trong ngày
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Ảnh</TableCell>
                <TableCell>Họ và tên</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Số điện thoại</TableCell>
                <TableCell>Ngày tạo</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Đang tải dữ liệu...
                  </TableCell>
                </TableRow>
              ) : newUsers.length > 0 ? (
                newUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Avatar
                        src={user.image ? convertBufferToBase64(user.image) : ''}
                        alt={`${user.lastName} ${user.firstName}`}
                        sx={{ width: 40, height: 40 }}
                      />
                    </TableCell>
                    <TableCell>{`${user.lastName} ${user.firstName}`}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phonenumber}</TableCell>
                    <TableCell>{moment(user.createdAt).format('DD/MM/YYYY')}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Không có dữ liệu người dùng mới
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
