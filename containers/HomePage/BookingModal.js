import React, { Component } from "react";
import { connect } from "react-redux";
import { Modal } from "reactstrap";
import Select from "react-select";
import { toast } from "react-toastify";
import LoadingOverlay from "react-loading-overlay";
import { BounceLoader } from "react-spinners";
import DatePicker from "../../components/Input/DatePicker";
import {
  getAllDoctors,
  getAllSpecialty,
  postPatientBookAppointment,
  getScheduleDoctorByDate,
} from "../../services/userService";
import "./BookingModal.scss";

class BookingModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      patientName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      address: "", // Khởi tạo địa chỉ
      reason: "",
      selectedDate: "",
      selectedTime: "",
      selectedDoctor: "",
      selectedService: "",
      selectedGender: "", // Khởi tạo giới tính
      isShowLoading: false,
    };
  }

  handleOnChangeInput = (event, field) => {
    this.setState({
      [field]: event.target.value,
    });
  };

  handleOnChangeDate = (date) => {
    this.setState({
      selectedDate: date[0],
    }, () => {
      // Nếu đã chọn bác sĩ, cập nhật danh sách khung giờ khả dụng
      if (this.state.selectedDoctor && this.state.selectedDate) {
        this.loadAvailableTimeSlots();
      }
    });
  };

  handleOnChangeSelect = (selectedOption, field) => {
    this.setState({
      [field]: selectedOption,
    }, () => {
      // Nếu field là selectedDoctor và đã chọn ngày, cập nhật danh sách khung giờ khả dụng
      if (field === 'selectedDoctor' && this.state.selectedDate) {
        this.loadAvailableTimeSlots();
      }
    });
  };

  // Hàm lấy các khung giờ khả dụng dựa trên bác sĩ và ngày đã chọn
  loadAvailableTimeSlots = async () => {
    const { selectedDoctor, selectedDate } = this.state;

    if (!selectedDoctor || !selectedDate) {
      return;
    }

    try {
      // Chuyển đổi selectedDate thành timestamp
      const timestamp = new Date(selectedDate).getTime();

      // Gọi API để lấy lịch của bác sĩ
      const response = await getScheduleDoctorByDate(selectedDoctor.value, timestamp);

      if (response && response.errCode === 0) {
        // Lọc các khung giờ khả dụng (isAvailable = true)
        const availableTimeSlots = response.data
          .filter(slot => slot.isAvailable)
          .map(slot => ({
            value: slot.timeType,
            label: slot.valueVi,
          }));

        this.setState({ times: availableTimeSlots });

        // Nếu không có khung giờ khả dụng, hiển thị thông báo
        if (availableTimeSlots.length === 0) {
          toast.info("Không có khung giờ khả dụng cho bác sĩ này vào ngày đã chọn");
        }
      } else {
        toast.error("Không thể tải khung giờ khả dụng");
      }
    } catch (error) {
      console.error("Error loading available time slots:", error);
      toast.error("Có lỗi xảy ra khi tải khung giờ khả dụng");
    }
  };
  componentDidMount() {
    console.log("componentDidMount called");
    this.loadDoctorsAndServices();

    // Khởi tạo state times với mảng rỗng, sẽ được cập nhật khi chọn bác sĩ và ngày
    this.setState({ times: [] });
  }

  convertBufferToBase64 = (bufferArray) => {
    if (!bufferArray || bufferArray.length === 0) {
      console.warn("Invalid buffer array:", bufferArray);
      return ""; // Trả về chuỗi rỗng nếu buffer không hợp lệ
    }
    const imageBase64 = new Buffer(bufferArray, "base64").toString("binary");
    return imageBase64;
  };

  loadDoctorsAndServices = async () => {
    console.log("loadDoctorsAndServices called");
    try {
      const [doctorsRes, specialtiesRes] = await Promise.all([
        getAllDoctors(),
        getAllSpecialty(),
      ]);
      console.log("API responses:", doctorsRes, specialtiesRes);
      if (doctorsRes?.errCode === 0 && specialtiesRes?.errCode === 0) {
        const doctors = doctorsRes.data.map((doc) => ({
          value: doc.id,
          label: `${doc.lastName} ${doc.firstName}`,
          image: this.convertBufferToBase64(doc.image),
        }));
        const services = specialtiesRes.data.map((specialty) => ({
          value: specialty.id,
          label: specialty.name,
          image: specialty.image, // Thêm hình ảnh
        }));

        console.log("Doctors:", doctors); // Kiểm tra dữ liệu bác sĩ
        this.setState({ doctors, services });
      } else {
        toast.error("Không thể tải dữ liệu!");
      }
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Có lỗi xảy ra khi tải dữ liệu!");
    }
  };

  handleConfirmBooking = async () => {
    const {
      patientName,
      lastName,
      phoneNumber,
      email,
      reason,
      address, // Đảm bảo lấy đúng từ state
      selectedGender, // Đảm bảo lấy đúng từ state
      selectedDate,
      selectedTime,
      selectedDoctor,
      selectedService,
    } = this.state;

    if (
      !patientName ||
      !lastName ||
      !phoneNumber ||
      !email ||
      !selectedDate ||
      !selectedTime ||
      !selectedService ||
      !selectedDoctor ||
      !address || // Kiểm tra address
      !selectedGender // Kiểm tra selectedGender
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    this.setState({ isShowLoading: true });

    try {
      // Format ngày và thời gian
      const formattedDate = new Date(selectedDate).getTime(); // Convert date to timestamp
      const timeString = `${selectedTime.label} - ${new Date(
        selectedDate
      ).toLocaleDateString("vi-VN", {
        weekday: "long",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })}`; // Format thời gian dạng "13:00 - 14:00 - thứ năm - 21/11/2024"

      const payload = {
        patientName: `${lastName} ${patientName}`,
        firstName: `${patientName}`,
        lastName: `${lastName}`,
        phoneNumber,
        email,
        address, // Lấy từ state
        reason,
        date: formattedDate,
        birthday: formattedDate,
        selectedGender: selectedGender.value, // Lấy từ state
        doctorId: selectedDoctor.value,
        specialtyId: selectedService.value,
        timeType: selectedTime.value,
        language: "vi",
        timeString: timeString,
        doctorName: `${selectedDoctor.label}`,
      };

      console.log("Payload:", payload);

      const response = await postPatientBookAppointment(payload);

      if (response && response.errCode === 0) {
        toast.success("Đặt lịch thành công!");
        this.props.toggleModal();
      } else {
        toast.error("Đặt lịch thất bại, vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau!");
    } finally {
      this.setState({ isShowLoading: false });
    }
  };

  render() {
    const { isOpenModal, toggleModal } = this.props;
    const {
      isShowLoading,
      patientName,
      lastName,
      phoneNumber,
      email,
      address, // Thêm địa chỉ
      reason,
      selectedDate,
      selectedTime,
      selectedDoctor,
      selectedService,
      selectedGender, // Thêm giới tính
    } = this.state;

    const customSingleValue = ({ data }) => (
      <div style={{ display: "flex", alignItems: "center" }}>
        <img
          src={data.image}
          alt={data.label}
          style={{
            width: 30,
            height: 30,
            borderRadius: "50%",
            marginRight: 10,
          }}
        />
        {data.label}
      </div>
    );

    const customOption = (props) => {
      const { data, innerRef, innerProps } = props;
      return (
        <div
          ref={innerRef}
          {...innerProps}
          style={{
            display: "flex",
            alignItems: "center",
            padding: 10,
            cursor: "pointer",
          }}
        >
          <img
            src={data.image}
            alt={data.label}
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              marginRight: 10,
            }}
          />
          {data.label}
        </div>
      );
    };
    return (
      <LoadingOverlay
        active={isShowLoading}
        spinner={<BounceLoader color={"#86e7d4"} size={60} />}
      >
        <Modal
          isOpen={isOpenModal}
          toggle={toggleModal}
          centered
          size="lg"
          className="booking-modal"
        >
          <div className="modal-header">
            <h5>Đặt Lịch Hẹn</h5>
            <button className="close-btn" onClick={toggleModal}>
              ✕
            </button>
          </div>
          <form className="form-container">
            <div style={{ flex: "1 1 calc(50% - 15px)" }}>
              <label>Chọn Dịch Vụ</label>
              <Select
                value={selectedService}
                onChange={(option) =>
                  this.handleOnChangeSelect(option, "selectedService")
                }
                options={this.state.services}
                placeholder="Chọn dịch vụ..."
                components={{
                  SingleValue: customSingleValue,
                  Option: customOption,
                }}
              />
            </div>
            <div style={{ flex: "1 1 calc(50% - 15px)" }}>
              <label>Chọn Bác Sĩ</label>
              <Select
                value={selectedDoctor}
                onChange={(option) =>
                  this.handleOnChangeSelect(option, "selectedDoctor")
                }
                options={this.state.doctors}
                placeholder="Chọn bác sĩ..."
                components={{
                  SingleValue: customSingleValue,
                  Option: customOption,
                }}
              />
            </div>
            <div style={{ flex: "1 1 calc(50% - 15px)" }}>
              <label>Họ</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => this.handleOnChangeInput(e, "lastName")}
              />
            </div>
            <div style={{ flex: "1 1 calc(50% - 15px)" }}>
              <label>Tên</label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => this.handleOnChangeInput(e, "patientName")}
              />
            </div>
            <div style={{ flex: "1 1 calc(50% - 15px)" }}>
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => this.handleOnChangeInput(e, "email")}
              />
            </div>
            <div style={{ flex: "1 1 calc(50% - 15px)" }}>
              <label>Số Điện Thoại</label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => this.handleOnChangeInput(e, "phoneNumber")}
              />
            </div>
            <div style={{ flex: "1 1 calc(50% - 15px)" }}>
              <label>Ngày Đặt Lịch</label>
              <DatePicker
                value={selectedDate}
                onChange={this.handleOnChangeDate}
              />
            </div>
            <div style={{ flex: "1 1 calc(50% - 15px)" }}>
              <label>Giờ Đặt Lịch</label>
              <Select
                value={selectedTime}
                onChange={(option) =>
                  this.handleOnChangeSelect(option, "selectedTime")
                }
                options={this.state.times}
                placeholder={
                  !selectedDoctor || !selectedDate
                    ? "Vui lòng chọn bác sĩ và ngày trước"
                    : this.state.times.length === 0
                    ? "Không có khung giờ khả dụng"
                    : "Chọn giờ..."
                }
                isDisabled={!selectedDoctor || !selectedDate || this.state.times.length === 0}
              />
            </div>
            <div style={{ flex: "1 1 calc(50% - 15px)" }}>
              <label>Địa Chỉ</label>
              <input
                type="text"
                value={address}
                onChange={(e) => this.handleOnChangeInput(e, "address")}
              />
            </div>
            <div style={{ flex: "1 1 calc(50% - 15px)" }}>
              <label>Giới Tính</label>
              <Select
                value={selectedGender}
                onChange={(option) =>
                  this.handleOnChangeSelect(option, "selectedGender")
                }
                options={[
                  { value: "M", label: "Nam" },
                  { value: "F", label: "Nữ" },
                ]}
                placeholder="Chọn giới tính..."
              />
            </div>
            <div style={{ flex: "1 1 100%" }}>
              <label>Lý Do</label>
              <textarea
                rows="3"
                value={reason}
                onChange={(e) => this.handleOnChangeInput(e, "reason")}
              ></textarea>
            </div>
          </form>
          <div className="button-group">
            <button onClick={this.handleConfirmBooking}>Xác Nhận</button>
            <button onClick={toggleModal}>Hủy Bỏ</button>
          </div>
        </Modal>
      </LoadingOverlay>
    );
  }
}

const mapStateToProps = (state) => ({
  language: state.app.language,
});

export default connect(mapStateToProps)(BookingModal);
