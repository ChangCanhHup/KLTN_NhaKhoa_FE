import React, { Component } from "react";
import { Modal } from "reactstrap";
import Select from "react-select";
import { toast } from "react-toastify";
import LoadingOverlay from "react-loading-overlay";
import { BounceLoader } from "react-spinners";
import DatePicker from "../../../../components/Input/DatePicker";
import {
  editBooking,
  getAllDoctors,
  getAllSpecialty,
} from "../../../../services/userService";

class UpdateBookingModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookingId: "",
      patientName: "",
      phoneNumber: "",
      email: "",
      address: "",
      reason: "",
      selectedDate: "",
      selectedTime: "",
      selectedDoctor: "",
      selectedService: "",
      selectedGender: "",
      times: [],
      services: [],
      doctors: [],
      isShowLoading: false,
    };
  }

  async componentDidMount() {
    const { bookingData } = this.props;

    try {
      const times = [
        { label: "08:00 - 09:00", value: "T1" },
        { label: "09:00 - 10:00", value: "T2" },
        { label: "10:00 - 11:00", value: "T3" },
        { label: "11:00 - 12:00", value: "T4" },
        { label: "13:00 - 14:00", value: "T5" },
        { label: "14:00 - 15:00", value: "T6" },
        { label: "15:00 - 16:00", value: "T7" },
        { label: "16:00 - 17:00", value: "T8" },
      ];

      const [doctorsRes, servicesRes] = await Promise.all([
        getAllDoctors(),
        getAllSpecialty(),
      ]);

      if (doctorsRes?.errCode === 0 && servicesRes?.errCode === 0) {
        const doctors = doctorsRes.data.map((doc) => ({
          value: doc.id,
          label: `${doc.lastName} ${doc.firstName}`,
        }));
        const services = servicesRes.data.map((spec) => ({
          value: spec.id,
          label: spec.name,
        }));

        this.setState({ times, doctors, services });

        if (bookingData) {
          const timeOption =
            times.find((time) => time.value === bookingData.timeType) || null;
          const serviceOption =
            services.find(
              (service) => service.value === bookingData.specialtyId
            ) || null;
          const doctorOption =
            doctors.find((doctor) => doctor.value === bookingData.doctorId) ||
            null;

          this.setState({
            bookingId: bookingData.id,
            patientName: bookingData.patientName || "",
            phoneNumber: bookingData.patientPhoneNumber || "",
            email: bookingData.email || "",
            address: bookingData.patientAddress || "",
            reason: bookingData.patientReason || "",
            selectedDate: new Date(bookingData.date),
            selectedTime: timeOption,
            selectedService: serviceOption,
            selectedDoctor: doctorOption,
            selectedGender: {
              value: bookingData.patientGender,
              label: bookingData.patientGender === "M" ? "Nam" : "Nữ",
            },
          });
        }
      } else {
        toast.error("Không thể tải dữ liệu danh sách!");
      }
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Có lỗi xảy ra khi tải dữ liệu!");
    }
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

  handleUpdateBooking = async () => {
    const {
      bookingId,
      patientName,
      phoneNumber,
      reason,
      address,
      selectedGender,
      selectedDate,
      selectedTime,
      selectedDoctor,
      selectedService,
    } = this.state;

    if (
      !bookingId ||
      !patientName ||
      !phoneNumber ||
      !selectedTime ||
      !selectedService ||
      !selectedDoctor ||
      !address ||
      !selectedGender
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    this.setState({ isShowLoading: true });

    try {
      const formattedDate = new Date(selectedDate).getTime();
      const payload = {
        id: bookingId,
        patientName,
        patientPhoneNumber: phoneNumber,
        patientAddress: address,
        patientReason: reason,
        timeType: selectedTime.value,
        doctorId: selectedDoctor.value,
        specialtyId: selectedService.value,
        patientGender: selectedGender.value,
      };

      const response = await editBooking(payload);

      if (response && response.errCode === 0) {
        toast.success("Cập nhật lịch hẹn thành công!");
        this.props.toggleModal();
        if (this.props.onUpdateSuccess) {
          this.props.onUpdateSuccess();
        }
      } else {
        toast.error("Cập nhật thất bại, vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Error updating booking:", error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau!");
    } finally {
      this.setState({ isShowLoading: false });
    }
  };

  render() {
    const { isOpen, toggleModal } = this.props;
    const {
      isShowLoading,
      patientName,
      phoneNumber,
      email,
      address,
      reason,
      selectedDate,
      selectedTime,
      selectedDoctor,
      selectedService,
      selectedGender,
      times,
      doctors,
      services,
    } = this.state;

    return (
      <LoadingOverlay
        active={isShowLoading}
        spinner={<BounceLoader color={"#86e7d4"} size={60} />}
      >
        <Modal isOpen={isOpen} toggle={toggleModal} centered size="lg">
          <div
            style={{
              backgroundColor: "#007bff",
              color: "#fff",
              textAlign: "center",
              padding: "1rem",
              fontSize: "1.5rem",
              fontWeight: "bold",
            }}
          >
            Cập Nhật Lịch Hẹn
          </div>
          <form style={{ padding: "1rem" }}>
            {/* Row 1 */}
            <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
              <div style={{ flex: 1 }}>
                <label>Tên Bệnh Nhân</label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => this.handleOnChangeInput(e, "patientName")}
                  style={inputStyle}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label>Số Điện Thoại</label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => this.handleOnChangeInput(e, "phoneNumber")}
                  style={inputStyle}
                />
              </div>
            </div>
            {/* Row 2 */}

            {/* Row 3 */}
            <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
              <div style={{ flex: 1 }}>
                <label>Chọn Dịch Vụ</label>
                <Select
                  value={selectedService}
                  onChange={(option) =>
                    this.handleOnChangeSelect(option, "selectedService")
                  }
                  options={services}
                  placeholder="Chọn dịch vụ"
                />
              </div>
              <div style={{ flex: 1 }}>
                <label>Chọn Bác Sĩ</label>
                <Select
                  value={selectedDoctor}
                  onChange={(option) =>
                    this.handleOnChangeSelect(option, "selectedDoctor")
                  }
                  options={doctors}
                  placeholder="Chọn bác sĩ"
                />
              </div>
            </div>
            {/* Row 4 */}
            <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
              <div style={{ flex: 1 }}>
                <label>Giờ Đặt Lịch</label>
                <Select
                  value={selectedTime}
                  onChange={(option) =>
                    this.handleOnChangeSelect(option, "selectedTime")
                  }
                  options={times}
                  placeholder="Chọn giờ"
                />
              </div>
              <div style={{ flex: 1 }}>
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
                  placeholder="Chọn giới tính"
                />
              </div>
            </div>
            {/* Row 5 */}
            <div style={{ marginBottom: "1rem" }}>
              <label>Địa Chỉ</label>
              <input
                type="text"
                value={address}
                onChange={(e) => this.handleOnChangeInput(e, "address")}
                style={inputStyle}
              />
            </div>
            {/* Row 6 */}
            <div style={{ marginBottom: "1rem" }}>
              <label>Lý Do</label>
              <textarea
                value={reason}
                onChange={(e) => this.handleOnChangeInput(e, "reason")}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  fontSize: "1rem",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  minHeight: "100px",
                }}
              />
            </div>
          </form>
          <div style={{ textAlign: "right", padding: "1rem" }}>
            <button
              type="button"
              onClick={this.handleUpdateBooking}
              style={buttonStyle}
            >
              Xác Nhận
            </button>
            <button
              type="button"
              onClick={toggleModal}
              style={{ ...buttonStyle, backgroundColor: "#6c757d" }}
            >
              Hủy Bỏ
            </button>
          </div>
        </Modal>
      </LoadingOverlay>
    );
  }
}

const inputStyle = {
  width: "100%",
  padding: "0.75rem",
  fontSize: "1rem",
  borderRadius: "5px",
  border: "1px solid #ccc",
};

const buttonStyle = {
  padding: "0.5rem 1.5rem",
  fontSize: "1rem",
  borderRadius: "5px",
  backgroundColor: "#007bff",
  color: "#fff",
  border: "none",
  cursor: "pointer",
  marginRight: "1rem",
};

export default UpdateBookingModal;
