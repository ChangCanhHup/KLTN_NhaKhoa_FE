import React, { Component } from "react";
import { connect } from "react-redux";
import "./ManageSchedule.scss";
import { FormattedMessage } from "react-intl";
import Select from "react-select";
import * as actions from "../../../store/actions";
import { CRUD_ACTIONS, LANGUAGES, dateFormat } from "../../../utils";
import DatePicker from "../../../components/Input/DatePicker";
import moment from "moment";
import { toast } from "react-toastify";
import _ from "lodash";
import { saveBulkScheduleDoctor } from "../../../services/userService";

class ManageSchedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listDoctors: [],
      selectedDoctor: {},
      currentDate: "",
      rangeTime: [],
      isAdminBooking: false,
      patientInfo: {
        patientName: "",
        phoneNumber: "",
        email: "",
        address: "",
        reason: "",
      },
    };
  }

  componentDidMount() {
    this.props.fetchAllDoctors();
    this.props.fetchAllScheduleTime();
  }

  buildDataInputSelect = (inputData) => {
    let result = [];
    let { language } = this.props;
    if (inputData && inputData.length > 0) {
      inputData.map((item, index) => {
        let object = {};
        let labelVi = `${item.lastName} ${item.firstName}`;
        let labelEn = `${item.firstName} ${item.lastName}`;
        object.label = language === LANGUAGES.VI ? labelVi : labelEn;
        object.value = item.id;
        result.push(object);
      });
    }
    return result;
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.allDoctors !== this.props.allDoctors) {
      let dataSelect = this.buildDataInputSelect(this.props.allDoctors);
      this.setState({
        listDoctors: dataSelect,
      });
    }

    if (prevProps.allScheduleTime !== this.props.allScheduleTime) {
      let data = this.props.allScheduleTime;
      if (data && data.length > 0) {
        data = data.map((item) => ({ ...item, isSelected: false }));
      }
      this.setState({
        rangeTime: data,
      });
    }
    // if (prevProps.language !== this.props.language) {
    //   let dataSelect = this.buildDataInputSelect(this.props.allDoctors);
    //   this.setState({
    //     listDoctors: dataSelect,
    //   });
    // }
  }

  handleChangeSelect = async (selectedOption) => {
    this.setState({ selectedDoctor: selectedOption });
  };

  handleOnChangeDatePicker = (date) => {
    console.log("handleOnChangeDatePicker")
    this.setState({
      currentDate: date[0],
    });

    let todayDate = moment(moment()._d).format("YYYY/MM/DD");

    console.log("todayDate",todayDate)
    console.log("moment(date[0]).format(YYYY/MM/DD)",moment(date[0]).format("YYYY/MM/DD"))

    let rangTimeCopy;
    if(todayDate==moment(date[0]).format("YYYY/MM/DD")){
      //today
        rangTimeCopy = [...this.state.rangeTime];

        let currentHour = moment().format("HH");

        rangTimeCopy = rangTimeCopy.filter((time)=>+time.value>+currentHour)

        this.setState({
          rangeTime: rangTimeCopy,
        });
    }else{
        let data = this.props.allScheduleTime;
        if (data && data.length > 0) {
          data = data.map((item) => ({ ...item, isSelected: false }));
        }
        this.setState({
          rangeTime: data,
        });
    }

  };

  handleClickBtnTime = (time) => {
    let { rangeTime } = this.state;
    if (rangeTime && rangeTime.length > 0) {
      rangeTime = rangeTime.map((item) => {
        if (item.id === time.id) item.isSelected = !item.isSelected;

        return item;
      });
      this.setState({
        rangeTime: rangeTime,
      });
    }
  };

  // Xử lý thay đổi thông tin bệnh nhân
  handlePatientInfoChange = (event, field) => {
    let { patientInfo } = this.state;
    patientInfo[field] = event.target.value;
    this.setState({ patientInfo });
  };

  // Xử lý thay đổi checkbox đặt lịch cho bệnh nhân
  handleAdminBookingChange = (event) => {
    this.setState({ isAdminBooking: event.target.checked });
  };

  handleSaveSchedule = async () => {
    let { rangeTime, selectedDoctor, currentDate, isAdminBooking, patientInfo } = this.state;
    let result = [];
    let { language } = this.props;

    if (!currentDate) {
      if(language === "en"){
        toast.error("Invalid date!");
      }else{
        toast.error("Ngày không hợp lệ!");
      }
      return;
    }

    if (selectedDoctor && _.isEmpty(selectedDoctor)) {
      if(language === "en"){
        toast.error("Invalid selected doctor!");
      }else{
        toast.error("Nha sĩ chọn không hợp lệ!");
      }
      return;
    }

    // Kiểm tra thông tin bệnh nhân nếu đặt lịch cho bệnh nhân
    if (isAdminBooking) {
      if (!patientInfo.patientName || !patientInfo.phoneNumber) {
        if(language === "en"){
          toast.error("Please enter patient name and phone number!");
        }else{
          toast.error("Vui lòng nhập tên và số điện thoại bệnh nhân!");
        }
        return;
      }
    }

    let formatedDate = new Date(currentDate).getTime();

    if (rangeTime && rangeTime.length > 0) {
      let selectedTime = rangeTime.filter((item) => item.isSelected === true);
      if (selectedTime && selectedTime.length > 0) {
        selectedTime.map((schedule) => {
          let object = {};
          object.doctorId = selectedDoctor.value;
          object.date = formatedDate;
          object.timeType = schedule.keyMap;
          result.push(object);
        });
      } else {
        if(language === "en"){
          toast.error("Invalid selected time!");
        }else{
          toast.error("Thời gian chọn không hợp lệ!");
        }
        return;
      }
    }

    // Tạo dữ liệu gửi đi
    let requestData = {
      arrSchedule: result,
      doctorId: selectedDoctor.value,
      date: formatedDate,
    };

    // Nếu đặt lịch cho bệnh nhân, thêm thông tin bệnh nhân
    if (isAdminBooking) {
      requestData.isAdminBooking = true;
      requestData.patientInfo = patientInfo;
    }

    let res = await saveBulkScheduleDoctor(requestData);

    if (res && res.errCode === 0) {
      if(language === "en"){
        toast.success("Save information succeed!");
      }else{
        toast.success("Lưu thông tin thành công!");
      }

      // Reset form sau khi lưu thành công
      this.setState({
        rangeTime: this.state.rangeTime.map(item => ({...item, isSelected: false})),
        patientInfo: {
          patientName: "",
          phoneNumber: "",
          email: "",
          address: "",
          reason: "",
        }
      });

    } else if (res && res.errCode === 2) {
      if(language === "en"){
        toast.error("There are conflicting appointments at the selected time!");
      }else{
        toast.error("Đã có lịch hẹn trùng với thời gian bạn chọn!");
      }
    } else {
      if(language === "en"){
        toast.error("Error: " + (res?.errMessage || "Unknown error"));
      }else{
        toast.error("Lỗi: " + (res?.errMessage || "Lỗi không xác định"));
      }
    }
  };
  render() {
    let { rangeTime, isAdminBooking, patientInfo } = this.state;
    let { language } = this.props;
    let yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
    return (
      <div className="manage-schedule-container">
        <div className="m-s-title">
          <FormattedMessage id="manage-schedule.title" />
        </div>
        <div className="container">
          <div className="row">
            <div className="col-6 form-group">
              <label>
                <FormattedMessage id="manage-schedule.choose-doctor" />
              </label>
              <Select
                value={this.state.selectedDoctor}
                onChange={this.handleChangeSelect}
                options={this.state.listDoctors}
              />
            </div>
            <div className="col-6 form-group">
              <label>
                <FormattedMessage id="manage-schedule.choose-date" />
              </label>
              <DatePicker
                onChange={this.handleOnChangeDatePicker}
                className="form-control"
                value={this.state.currentDate}
                minDate={yesterday}
              />
            </div>
            <div className="col-12 pick-hour-container">
              {rangeTime &&
                rangeTime.length > 0 &&
                rangeTime.map((item, index) => {
                  return (
                    <button
                      className={
                        item.isSelected === true
                          ? "btn btn-schedule active"
                          : "btn btn-schedule"
                      }
                      key={index}
                      onClick={() => this.handleClickBtnTime(item)}
                    >
                      {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                    </button>
                  );
                })}
            </div>

            {/* Checkbox đặt lịch cho bệnh nhân */}
            <div className="col-12 mt-3">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="adminBookingCheck"
                  checked={isAdminBooking}
                  onChange={this.handleAdminBookingChange}
                />
                <label className="form-check-label" htmlFor="adminBookingCheck">
                  {language === LANGUAGES.VI
                    ? "Đặt lịch cho bệnh nhân"
                    : "Book appointment for patient"}
                </label>
              </div>
            </div>

            {/* Form thông tin bệnh nhân - chỉ hiển thị khi checkbox được chọn */}
            {isAdminBooking && (
              <div className="col-12 mt-3 patient-info-container">
                <div className="row">
                  <div className="col-12">
                    <h5>
                      {language === LANGUAGES.VI
                        ? "Thông tin bệnh nhân"
                        : "Patient Information"}
                    </h5>
                  </div>
                  <div className="col-6 form-group">
                    <label>
                      {language === LANGUAGES.VI ? "Họ tên bệnh nhân" : "Patient Name"}
                      <span className="text-danger"> *</span>
                    </label>
                    <input
                      className="form-control"
                      value={patientInfo.patientName}
                      onChange={(e) => this.handlePatientInfoChange(e, "patientName")}
                    />
                  </div>
                  <div className="col-6 form-group">
                    <label>
                      {language === LANGUAGES.VI ? "Số điện thoại" : "Phone Number"}
                      <span className="text-danger"> *</span>
                    </label>
                    <input
                      className="form-control"
                      value={patientInfo.phoneNumber}
                      onChange={(e) => this.handlePatientInfoChange(e, "phoneNumber")}
                    />
                  </div>
                  <div className="col-6 form-group">
                    <label>
                      {language === LANGUAGES.VI ? "Email" : "Email"}
                    </label>
                    <input
                      className="form-control"
                      value={patientInfo.email}
                      onChange={(e) => this.handlePatientInfoChange(e, "email")}
                    />
                  </div>
                  <div className="col-6 form-group">
                    <label>
                      {language === LANGUAGES.VI ? "Địa chỉ" : "Address"}
                    </label>
                    <input
                      className="form-control"
                      value={patientInfo.address}
                      onChange={(e) => this.handlePatientInfoChange(e, "address")}
                    />
                  </div>
                  <div className="col-12 form-group">
                    <label>
                      {language === LANGUAGES.VI ? "Lý do khám" : "Reason"}
                    </label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={patientInfo.reason}
                      onChange={(e) => this.handlePatientInfoChange(e, "reason")}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="col-12 mt-3">
              <button
                className="btn btn-primary btn-save-schedule"
                onClick={() => this.handleSaveSchedule()}
              >
                <FormattedMessage id="manage-schedule.save" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    language: state.app.language,
    allDoctors: state.admin.allDoctors,
    allScheduleTime: state.admin.allScheduleTime,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
    fetchAllScheduleTime: () => dispatch(actions.fetchAllScheduleTime()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule);
