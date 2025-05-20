import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./ManagePatient.scss";
import DatePicker from "../../../../components/Input/DatePicker";
import {
  cancelBooking,
  getAllBooking,
  postSendRemedy,
  postCreateRemedy,
  changeStatusBookingById,
  getAllPatientForUser,
} from "../../../../services/userService";
import moment from "moment";
import { LANGUAGES } from "../../../../utils";
import { toast } from "react-toastify";
import LoadingOverlay from "react-loading-overlay";
import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader";
import { withRouter } from "../../../../utils/withRouter"; //navigate
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css"; // This only needs to be imported once in your app
import UpdateBookingModal from "./UpdateBookingModal";

class ManageBooking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentDate: null,
      dataPatient: [],
      isOpenRemedyModal: false,
      isOpenCreateImageRemedyModal: false,
      dataModal: {},
      dataModalCreateRemedy: {},
      isShowLoading: false,
      previewImgURL: "",
    };
  }

  async componentDidMount() {
    await this.getDataPatient();
  }

  getDataPatient = async () => {
    let { user } = this.props;
    let { currentDate } = this.state;

    if (user && user.id) {
      let res;
      if (currentDate && !isNaN(new Date(currentDate).getTime())) {
        // Nếu có date hợp lệ, gọi API getAllPatientForUser
        let formatedDate = new Date(currentDate).getTime();
        res = await getAllPatientForUser({ date: formatedDate });
      } else {
        // Nếu date là NaN hoặc không có, gọi API getAllBooking
        res = await getAllBooking({});
      }

      if (res && res.errCode === 0) {
        // Sắp xếp data: S1 lên trước
        let sortedData = res.data.sort((a, b) => {
          if (a.statusId === "S1" && b.statusId !== "S1") return -1; // S1 lên đầu
          if (a.statusId !== "S1" && b.statusId === "S1") return 1; // Không phải S1 xuống sau
          return 0; // Giữ nguyên thứ tự nếu cùng statusId
        });

        this.setState({
          dataPatient: sortedData,
        });
      }
    }
  };

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
    }
    if (this.props.user !== prevProps.user) {
      await this.getDataPatient();
    }
  }

  handleBtnConfirm = async (item) => {
    this.setState({ isShowLoading: true });
    try {
      let res = await changeStatusBookingById({
        id: item.id,
        statusId: "S2", // Cập nhật trạng thái thành S2 (Confirm)
      });

      if (res && res.errCode === 0) {
        toast.success(
          this.props.language === LANGUAGES.VI
            ? "Xác nhận lịch hẹn thành công!"
            : "Appointment confirmed successfully!"
        );
        await this.getDataPatient(); // Tải lại danh sách
      } else {
        toast.error(
          this.props.language === LANGUAGES.VI
            ? "Xác nhận lịch hẹn thất bại!"
            : "Failed to confirm appointment!"
        );
      }
    } catch (error) {
      toast.error(
        this.props.language === LANGUAGES.VI
          ? "Có lỗi xảy ra!"
          : "An error occurred!"
      );
      console.error("Error confirming appointment:", error);
    } finally {
      this.setState({ isShowLoading: false });
    }
  };
  handleOnChangeDatePicker = (date) => {
    this.setState(
      {
        currentDate: date[0],
      },
      async () => {
        await this.getDataPatient();
      }
    );
  };
  handleUpdateBooking = (item) => {
    this.setState({
      isOpenRemedyModal: true, // Mở modal (hoặc set flag khác nếu bạn dùng form)
      dataModal: item, // Lưu thông tin lịch hẹn để cập nhật
    });
  };

  handleBtnCancel = async (item) => {
    const confirmCancel = window.confirm(
      this.props.language === LANGUAGES.VI
        ? "Bạn có chắc chắn muốn hủy lịch hẹn này không?"
        : "Are you sure you want to cancel this appointment?"
    );

    if (!confirmCancel) {
      return; // Nếu người dùng không xác nhận, thoát hàm
    }

    this.setState({ isShowLoading: true });
    try {
      let res = await changeStatusBookingById({
        id: item.id,
        statusId: "S4", // Cập nhật trạng thái thành S4 (Cancel)
      });

      if (res && res.errCode === 0) {
        toast.success(
          this.props.language === LANGUAGES.VI
            ? "Hủy lịch hẹn thành công!"
            : "Appointment cancelled successfully!"
        );
        await this.getDataPatient(); // Tải lại danh sách
      } else {
        toast.error(
          this.props.language === LANGUAGES.VI
            ? "Hủy lịch hẹn thất bại!"
            : "Failed to cancel appointment!"
        );
      }
    } catch (error) {
      toast.error(
        this.props.language === LANGUAGES.VI
          ? "Có lỗi xảy ra!"
          : "An error occurred!"
      );
      console.error("Error cancelling appointment:", error);
    } finally {
      this.setState({ isShowLoading: false });
    }
  };

  render() {
    let { dataPatient } = this.state;
    let { language } = this.props;

    return (
      <>
        <LoadingOverlay
          active={this.state.isShowLoading}
          spinner={<ClimbingBoxLoader color={"#86e7d4"} size={15} />}
        >
          <div className="manage-patient-container">
            <div className="m-p-title font-weight-bold">
              <FormattedMessage id={"manage-patient-user.title"} />
            </div>
            <div className="manage-patient-body row">
              <div className="col-4 form-group">
                <label>
                  <FormattedMessage id={"manage-patient.choose-date"} />
                </label>
                <DatePicker
                  onChange={this.handleOnChangeDatePicker}
                  className="form-control"
                  value={this.state.currentDate}
                />
              </div>
              <div className="col-12 table-manage-patient">
                <table>
                  <tbody>
                    <tr>
                      <th>#</th>
                      <th>
                        <FormattedMessage
                          id={"manage-patient.examination-time"}
                        />
                      </th>
                      <th>
                        <FormattedMessage id={"manage-patient.patient-name"} />
                      </th>
                      <th>
                        <FormattedMessage id={"manage-patient.address"} />
                      </th>
                      <th>
                        <FormattedMessage id={"manage-patient.phone-number"} />
                      </th>
                      <th>
                        <FormattedMessage id={"manage-patient.gender"} />
                      </th>
                      <th>
                        <FormattedMessage id={"manage-patient.doctor"} />
                      </th>
                      <th>
                        <FormattedMessage id={"manage-patient.reason"} />
                      </th>
                      <th>
                        <FormattedMessage id={"manage-patient.status"} />
                      </th>
                      <th>
                        <FormattedMessage id={"manage-patient.actions"} />
                      </th>
                    </tr>
                    {dataPatient && dataPatient.length > 0 ? (
                      dataPatient.map((item, index) => {
                        let time =
                          language === LANGUAGES.VI
                            ? item.timeTypeDataPatient.valueVi +
                              " - " +
                              moment(+item.date).format("DD-MM-YYYY")
                            : item.timeTypeDataPatient.valueEn +
                              " - " +
                              moment(+item.date).format("DD-MM-YYYY");
                        let gender =
                          language === LANGUAGES.VI
                            ? item.patientGender === "M"
                              ? "Nam"
                              : "Nữ"
                            : item.patientGender === "M"
                            ? "Male"
                            : "Female";
                        let status =
                          item.statusId === "S1"
                            ? language === LANGUAGES.VI
                              ? "Chưa xác nhận"
                              : "Unconfirmed"
                            : language === LANGUAGES.VI
                            ? "Đang chờ khám"
                            : "Waiting for review";

                        return (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{time}</td>
                            <td>{item?.patientName}</td>
                            <td>{item?.patientAddress}</td>
                            <td>
                              {item?.patientPhoneNumber
                                ? item?.patientPhoneNumber
                                : ""}
                            </td>
                            <td>{gender}</td>
                            <td>
                              {item?.doctorData?.lastName}{" "}
                              {item?.doctorData?.firstName}
                            </td>
                            <td>{item.patientReason}</td>
                            <td>{status}</td>
                            <td>
                              {item.statusId === "S1" ? (
                                <>
                                  <button
                                    className="btn btn-primary mx-1"
                                    onClick={() => this.handleBtnConfirm(item)}
                                  >
                                    <FormattedMessage
                                      id={"manage-patient-user.confirm"}
                                    />
                                  </button>
                                  <button
                                    className="btn btn-danger mx-1"
                                    onClick={() => this.handleBtnCancel(item)}
                                  >
                                    <FormattedMessage
                                      id={"manage-patient-user.cancel"}
                                    />
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    className="btn btn-warning mx-1"
                                    onClick={() =>
                                      this.handleUpdateBooking(item)
                                    }
                                    style={{
                                      whiteSpace: "nowrap",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                    }}
                                  >
                                    <FormattedMessage
                                      id={"manage-patient-user.update"}
                                    />
                                  </button>
                                </>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="9" style={{ textAlign: "center" }}>
                          {language === LANGUAGES.VI
                            ? "Không có bệnh nhân đặt lịch vào ngày này"
                            : "No patients booked for this date"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {this.state.isOpenRemedyModal && (
            <UpdateBookingModal
              isOpen={this.state.isOpenRemedyModal}
              toggleModal={() => this.setState({ isOpenRemedyModal: false })}
              bookingData={this.state.dataModal} // Truyền bookingData
              times={this.times} // Truyền times
              services={this.state.services} // Truyền danh sách dịch vụ
              doctors={this.state.doctors} // Truyền danh sách bác sĩ
              onUpdateSuccess={this.getDataPatient}
            />
          )}
        </LoadingOverlay>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return { language: state.app.language, user: state.user.userInfo };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ManageBooking)
);
