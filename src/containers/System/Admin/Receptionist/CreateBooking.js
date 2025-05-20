import React, { Component } from "react";
import { connect } from "react-redux";
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

class CreateBooking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      patientName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      address: "",
      reason: "",
      selectedDate: "",
      selectedTime: "",
      selectedDoctor: "",
      selectedService: "",
      selectedGender: "",
      isShowLoading: false,
      doctors: [],
      services: [],
      times: [],
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
    this.loadDoctorsAndServices();

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
    try {
      const [doctorsRes, specialtiesRes] = await Promise.all([
        getAllDoctors(),
        getAllSpecialty(),
      ]);
      if (doctorsRes?.errCode === 0 && specialtiesRes?.errCode === 0) {
        const doctors = doctorsRes.data.map((doc) => ({
          value: doc.id,
          label: `${doc.lastName} ${doc.firstName}`,
          image: this.convertBufferToBase64(doc.image),
        }));
        const services = specialtiesRes.data.map((specialty) => ({
          value: specialty.id,
          label: specialty.name,
          image: specialty.image,
        }));
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
      address,
      selectedGender,
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
      const formattedDate = new Date(selectedDate).getTime();
      const payload = {
        patientName: `${lastName} ${patientName}`,
        firstName: `${patientName}`,
        lastName: `${lastName}`,
        phoneNumber,
        email,
        address,
        reason,
        date: formattedDate,
        doctorId: selectedDoctor.value,
        specialtyId: selectedService.value,
        timeType: selectedTime.value,
        language: "vi",
        statusId: "S2",
      };

      const response = await postPatientBookAppointment(payload);
      if (response && response.errCode === 0) {
        toast.success("Tạo lịch khám răng thành công!");
      } else {
        toast.error("Tạo lịch khám răng thất bại, vui lòng thử lại!");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau!");
    } finally {
      this.setState({ isShowLoading: false });
    }
  };

  render() {
    const {
      isShowLoading,
      patientName,
      lastName,
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
        <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
          <h5 style={{ textAlign: "center", marginBottom: "20px" }}>
            Tạo Lịch Hẹn
          </h5>
          <form
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "15px",
              justifyContent: "space-between",
            }}
          >
            <div style={{ flex: "1 1 calc(50% - 15px)" }}>
              <label>Chọn Dịch Vụ</label>
              <Select
                value={selectedService}
                onChange={(option) =>
                  this.handleOnChangeSelect(option, "selectedService")
                }
                options={services}
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
                options={doctors}
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
                style={{ padding: "10px", borderRadius: "5px", width: "100%" }}
              />
            </div>
            <div style={{ flex: "1 1 calc(50% - 15px)" }}>
              <label>Tên</label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => this.handleOnChangeInput(e, "patientName")}
                style={{ padding: "10px", borderRadius: "5px", width: "100%" }}
              />
            </div>
            <div style={{ flex: "1 1 calc(50% - 15px)" }}>
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => this.handleOnChangeInput(e, "email")}
                style={{ padding: "10px", borderRadius: "5px", width: "100%" }}
              />
            </div>
            <div style={{ flex: "1 1 calc(50% - 15px)" }}>
              <label>Số Điện Thoại</label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => this.handleOnChangeInput(e, "phoneNumber")}
                style={{ padding: "10px", borderRadius: "5px", width: "100%" }}
              />
            </div>
            <div style={{ flex: "1 1 calc(50% - 15px)" }}>
              <label>Ngày Đặt Lịch</label>
              <DatePicker
                value={selectedDate}
                onChange={this.handleOnChangeDate}
                className="form-control"
              />
            </div>
            <div style={{ flex: "1 1 calc(50% - 15px)" }}>
              <label>Giờ Đặt Lịch</label>
              <Select
                value={selectedTime}
                onChange={(option) =>
                  this.handleOnChangeSelect(option, "selectedTime")
                }
                options={times}
                placeholder="Chọn giờ..."
              />
            </div>
            <div style={{ flex: "1 1 calc(50% - 15px)" }}>
              <label>Địa Chỉ</label>
              <input
                type="text"
                value={address}
                onChange={(e) => this.handleOnChangeInput(e, "address")}
                style={{ padding: "10px", borderRadius: "5px", width: "100%" }}
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
                style={{
                  padding: "10px",
                  borderRadius: "5px",
                  width: "100%",
                  resize: "none",
                }}
              ></textarea>
            </div>
          </form>
          <div style={{ marginTop: "20px", textAlign: "right" }}>
            <button
              onClick={this.handleConfirmBooking}
              style={{
                padding: "10px 20px",
                borderRadius: "5px",
                backgroundColor: "#007bff",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                marginRight: "10px",
              }}
            >
              Xác Nhận
            </button>
            <button
              style={{
                padding: "10px 20px",
                borderRadius: "5px",
                backgroundColor: "#ccc",
                color: "#000",
                border: "none",
                cursor: "pointer",
              }}
            >
              Hủy Bỏ
            </button>
          </div>
        </div>
      </LoadingOverlay>
    );
  }
}

const mapStateToProps = (state) => ({
  language: state.app.language,
});

export default connect(mapStateToProps)(CreateBooking);
