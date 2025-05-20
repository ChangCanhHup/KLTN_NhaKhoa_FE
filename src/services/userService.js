import axios from "../axios";

const handleLoginApi = (email, password) => {
  return axios.post("/api/login", { email, password });
};

const getAllUsers = (inputId) => {
  return axios.get(`/api/get-all-users?id=${inputId}`);
};

const createNewUserService = (data) => {
  return axios.post("/api/create-new-user", data);
};

const createUserForAdmin = (data) => {
  return axios.post("/api/create-user-admin", data);
};

const editUserForAdmin = (inputData) => {
  return axios.put("/api/edit-user-admin", inputData);
};

const deleteUserService = (userId) => {
  return axios.delete("/api/delete-user", {
    data: {
      id: userId,
    },
  });
};

const editUserService = (inputData) => {
  return axios.put("/api/edit-user", inputData);
};

const getAllCodeService = (inputType) => {
  return axios.get(`/api/allcode?type=${inputType}`);
};

const getTopDoctorHomeService = (data) => {
  return axios.post(`/api/top-doctor-home`, data);
};

const getAllDoctors = () => {
  return axios.get(`/api/get-all-doctors`);
};

const saveDetailDoctor = (data) => {
  return axios.post("/api/save-infor-doctors", data);
};

const getDetailInforDoctor = (inputId) => {
  return axios.get(`/api/get-detail-doctor-by-id?id=${inputId}`);
};

const saveBulkScheduleDoctor = (data) => {
  return axios.post("/api/bulk-create-schedule", data);
};

const getScheduleDoctorByDate = (doctorId, date) => {
  return axios.get(
    `/api/get-schedule-doctor-by-date?doctorId=${doctorId}&date=${date}`
  );
};

const getExtraInforDoctorById = (doctorId) => {
  return axios.get(`/api/get-extra-infor-doctor-by-id?doctorId=${doctorId}`);
};

const getProfileDoctorById = (doctorId) => {
  return axios.get(`/api/get-profile-doctor-by-id?doctorId=${doctorId}`);
};

const postPatientBookAppointment = (data) => {
  return axios.post("/api/patient-book-appointment", data);
};
const editBooking = (data) => {
  return axios.put("/api/edit-booking", data);
};

const postVerifyBookAppointment = (data) => {
  return axios.post("/api/verify-book-appointment", data);
};

const createNewSpecialty = (data) => {
  return axios.post("/api/create-new-specialty", data);
};

const getAllSpecialty = (data) => {
  return axios.post("/api/get-specialty", data);
};

const getAllSpecialtyById = (data) => {
  return axios.get(
    `/api/get-detail-specialty-by-id?id=${data.id}&location=${data.location}`
  );
};

const createNewClinic = (data) => {
  return axios.post("/api/create-new-clinic", data);
};

const getAllClinic = (data) => {
  return axios.post(`/api/get-clinic`, data);
};

const getAllDetailClinicById = (data) => {
  return axios.get(`/api/get-detail-clinic-by-id?id=${data.id}}`);
};

const getAllPatientForDoctor = (data) => {
  return axios.get(
    `/api/get-list-patient-for-doctor?doctorId=${data.doctorId}&date=${data.date}`
  );
};

const getAllBooking = () => {
  return axios.get(`/api/get-all-booking`);
};

const getCompletedAppointments = (startDate, endDate) => {
  let url = `/api/get-completed-appointments`;
  if (startDate && endDate) {
    // Sử dụng định dạng ngày tháng đơn giản YYYY-MM-DD
    url += `?startDate=${startDate}&endDate=${endDate}`;
    console.log(`Requesting completed appointments from ${startDate} to ${endDate}`);
  }
  return axios.get(url);
};

const getAllPatient = (searchKeyword) => {
  return axios.get(
    `/api/get-all-patient?searchKeyword=${encodeURIComponent(searchKeyword)}`
  );
};

const getAllPatientForUser = (data) => {
  return axios.get(`/api/get-all-patient-user?date=${data.date}`);
};
const changeStatusBookingById = (data) => {
  return axios.post(`/api/change-status-booking`, data);
};
const getBookingById = (bookingId) => {
  return axios.get(`/api/get-booking-by-id?bookingId=${bookingId}`);
};

const postSendRemedy = (data) => {
  return axios.post("/api/send-remedy", data);
};

const postCreateRemedy = (data) => {
  return axios.post("/api/create-remedy", data);
};

const cancelBooking = (data) => {
  return axios.post("/api/cancel-booking", data);
};

const postUserForgotPassword = (data) => {
  return axios.post("/api/user-forgot-password", data);
};

const postVerifyRetrievePassword = (data) => {
  return axios.post("/api/verify-retrieve-password", data);
};

//admin
const getWeeklyRevenue = () => {
  return axios.get(`/api/get-weekly-revenue`);
};

const getWeeklyRevenueDetails = () => {
  return axios.get(`/api/get-weekly-revenue-details`);
};

const getTotalNewUserDay = () => {
  return axios.get(`/api/get-total-new-user-day`);
};

const getTotalHealthAppointmentDone = () => {
  return axios.get(`/api/get-total-health-appointment-done`);
};

const getTotalDoctors = () => {
  return axios.get(`/api/get-total-doctor`);
};

const getTopThreeDoctorOfTheYear = () => {
  return axios.get(`/api/get-top-three-doctors-of-the-year`);
};
const getRevenueByDateRange = (startDate, endDate) => {
  return axios.get(`/api/get-revenue-by-date-range`, {
    params: { startDate, endDate }, // Truyền tham số query
  });
};

const getDoctorRevenueByDateRange = (doctorId, startDate, endDate) => {
  return axios.get(`/api/get-doctor-revenue-by-date-range`, {
    params: { doctorId, startDate, endDate }, // Truyền tham số query
  });
};
const getTopFourVipPatient = () => {
  return axios.get(`/api/get-top-four-vip-patient`);
};

const getMonthlyRevenueSpecialty = () => {
  return axios.get(`/api/get-monthly-revenue-specialty`);
};

const getHandleLoginGoogle = (data) => {
  return axios.post(`/api/login-google`, data);
};

const filterHistoriesPatient = (data) => {
  return axios.post(`/api/filter-history`, data);
};
const getAllHistory = () => {
  return axios.post(`/api/get-all-history`);
};
const filterUsers = (data) => {
  return axios.post(`/api/filter-users`, data);
};

const editPassword = (data) => {
  return axios.post(`/api/edit-password-user`, data);
};

const filterRestoreUsers = (data) => {
  return axios.post(`/api/filter-restore-users`, data);
};

const handleRestoreUser = (data) => {
  return axios.post(`/api/handle-restore-user`, data);
};

const deleteRestoreUser = (data) => {
  return axios.post(`/api/delete-restore-user`, data);
};
const filterBookingsByPatientId = (data) => {
  return axios.post("/api/filter-bookings-by-patient-id", data);
};

// API hủy đặt lịch theo bookingId
const cancelBookingUser = (data) => {
  return axios.delete("/api/cancel-booking", {
    data: {
      bookingId: data.bookingId,
    },
  });
};
export {
  getMonthlyRevenueSpecialty,
  getTopFourVipPatient,
  getTotalDoctors,
  handleLoginApi,
  getAllUsers,
  createNewUserService,
  deleteUserService,
  editUserService,
  getAllCodeService,
  getTopDoctorHomeService,
  getAllDoctors,
  saveDetailDoctor,
  getDetailInforDoctor,
  saveBulkScheduleDoctor,
  getScheduleDoctorByDate,
  getExtraInforDoctorById,
  getProfileDoctorById,
  postPatientBookAppointment,
  postVerifyBookAppointment,
  createNewSpecialty,
  getAllSpecialty,
  getAllSpecialtyById,
  createNewClinic,
  getAllClinic,
  getAllDetailClinicById,
  getAllPatientForDoctor,
  postSendRemedy,
  postUserForgotPassword,
  postVerifyRetrievePassword,
  cancelBooking,
  postCreateRemedy,
  getWeeklyRevenue,
  getWeeklyRevenueDetails,
  getTotalNewUserDay,
  getTotalHealthAppointmentDone,
  getTopThreeDoctorOfTheYear,
  getHandleLoginGoogle,
  getBookingById,
  filterHistoriesPatient,
  filterUsers,
  editPassword,
  filterRestoreUsers,
  handleRestoreUser,
  deleteRestoreUser,
  filterBookingsByPatientId,
  cancelBookingUser,
  getAllBooking,
  getCompletedAppointments,
  changeStatusBookingById,
  getAllPatientForUser,
  getAllPatient,
  editUserForAdmin,
  createUserForAdmin,
  editBooking,
  getAllHistory,
  getRevenueByDateRange,
  getDoctorRevenueByDateRange,
};
