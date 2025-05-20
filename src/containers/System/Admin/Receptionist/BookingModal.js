import React, { Component } from "react";
import { connect } from "react-redux";
import { Modal } from "reactstrap";
import Select from "react-select";
import { toast } from "react-toastify";
import LoadingOverlay from "react-loading-overlay";
import { BounceLoader } from "react-spinners";
import DatePicker from "../../../../components/Input/DatePicker";
import {
  getAllDoctors,
  getAllSpecialty,
  postPatientBookAppointment,
} from "../../../../services/userService";
import "./BookingModal.scss";

class BookingModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      patientName: props.patientData?.firstName || "", // Gộp họ và tên
      lastName: props.patientData?.lastName || "",
      phoneNumber: props.patientData?.phonenumber || "",
      email: props.patientData?.email || "",
      address: props.patientData?.address || "",
      reason: props.patientData?.reason || "", // Nếu có lý do từ patientData
      selectedDate: "",
      selectedTime: "",
      selectedDoctor: "",
      selectedService: "",
      selectedGender: props.patientData?.gender
        ? {
            value: props.patientData.gender,
            label: props.patientData.gender === "M" ? "Nam" : "Nữ",
          }
        : "",
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
    });
  };

  handleOnChangeSelect = (selectedOption, field) => {
    this.setState({
      [field]: selectedOption,
    });
  };
  componentDidMount() {
    console.log("componentDidMount called");
    this.loadDoctorsAndServices();

    // Danh sách giờ với định dạng 24 giờ
    const times = [
      { time_vi: "08:00 - 09:00", value: "T1" },
      { time_vi: "09:00 - 10:00", value: "T2" },
      { time_vi: "10:00 - 11:00", value: "T3" },
      { time_vi: "11:00 - 12:00", value: "T4" },
      { time_vi: "13:00 - 14:00", value: "T5" },
      { time_vi: "14:00 - 15:00", value: "T6" },
      { time_vi: "15:00 - 16:00", value: "T7" },
      { time_vi: "16:00 - 17:00", value: "T8" },
    ].map((time) => ({
      value: time.value,
      label: time.time_vi,
    }));

    this.setState({ times });
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
        statusId: "S2",
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
                placeholder="Chọn giờ..."
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
