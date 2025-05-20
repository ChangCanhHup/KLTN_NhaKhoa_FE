import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./ManagePatient.scss";
import DatePicker from "../../../../components/Input/DatePicker";
import { getAllPatient } from "../../../../services/userService";
import moment from "moment";
import { LANGUAGES } from "../../../../utils";
import { toast } from "react-toastify";
import LoadingOverlay from "react-loading-overlay";
import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader";
import { withRouter } from "../../../../utils/withRouter";
import CreatePatientModal from "./CreatePatientModal";
import UpdatePatientModal from "./UpdatePatientModal";
import { Avatar } from "@material-ui/core";
import BookingModal from "./BookingModal";

class ManagePatient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentDate: moment(new Date()).startOf("day").valueOf(),
      dataPatient: [],
      searchKeyword: "",
      isShowLoading: false,
      isCreateModalOpen: false,
      isUpdateModalOpen: false,
      selectedPatient: null,
      isBookingModalOpen: false,
      selectedPatient: null,
    };
  }

  // Hàm convert buffer sang base64
  convertBufferToBase64 = (bufferArray) => {
    if (!bufferArray || bufferArray.length === 0) {
      console.warn("Invalid buffer array:", bufferArray);
      return ""; // Trả về chuỗi rỗng nếu buffer không hợp lệ
    }
    const imageBase64 = new Buffer(bufferArray, "base64").toString("binary");
    return imageBase64;
  };

  async componentDidMount() {
    await this.getDataPatient();
  }

  getDataPatient = async () => {
    let { user } = this.props;
    let { searchKeyword } = this.state;
    if (user && user.id) {
      this.setState({ isShowLoading: true });
      try {
        let res = await getAllPatient(searchKeyword);
        if (res && res.errCode === 0) {
          this.setState({ dataPatient: res.data });
        }
      } catch (error) {
        toast.error("Failed to load patients!");
      } finally {
        this.setState({ isShowLoading: false });
      }
    }
  };

  handleSearchChange = (e) => {
    this.setState({ searchKeyword: e.target.value });
  };

  handleSearchSubmit = async () => {
    await this.getDataPatient();
  };

  handleAddNewPatient = () => {
    this.setState({ isCreateModalOpen: true });
  };

  handleUpdatePatient = (patient) => {
    this.setState({ isUpdateModalOpen: true, selectedPatient: patient });
  };
  toggleBookingModal = (patient) => {
    this.setState({ isBookingModalOpen: true, selectedPatient: patient });
  };
  render() {
    let { dataPatient, searchKeyword, isModalOpen, selectedPatient } =
      this.state;
    let { language } = this.props;
    console.log(selectedPatient);
    return (
      <>
        <LoadingOverlay
          active={this.state.isShowLoading}
          spinner={<ClimbingBoxLoader color={"#86e7d4"} size={15} />}
        >
          <div className="manage-patient-container">
            <div className="m-p-title font-weight-bold">
              <FormattedMessage id={"manage-patient.title"} />
            </div>

            {/* Thanh tìm kiếm và nút thêm mới */}
            <div className="search-add-container">
              <input
                type="text"
                className="search-input"
                placeholder="Tìm kiếm bệnh nhân..."
                value={searchKeyword}
                onChange={this.handleSearchChange}
              />
              <button
                className="btn btn-primary search-btn"
                onClick={this.handleSearchSubmit}
              >
                <FormattedMessage id={"manage-patient.search"} />
              </button>
              <button
                className="btn btn-success add-btn"
                onClick={this.handleAddNewPatient}
              >
                <FormattedMessage id={"manage-patient.add-new"} />
              </button>
            </div>

            <div className="manage-patient-body row">
              <div className="col-12 table-manage-patient">
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Ảnh</th>
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
                      <th>Email</th>
                      <th>
                        <FormattedMessage id={"manage-patient.actions"} />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataPatient && dataPatient.length > 0 ? (
                      dataPatient.map((item, index) => {
                        let gender =
                          language === LANGUAGES.VI
                            ? item.gender === "M"
                              ? "Nam"
                              : "Nữ"
                            : item.gender === "M"
                            ? "Male"
                            : "Female";

                        let imageSrc =
                          item.image &&
                          `${this.convertBufferToBase64(item.image)}`;

                        return (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>
                              {imageSrc ? (
                                <Avatar
                                  src={imageSrc}
                                  alt={item.firstName}
                                  sx={{
                                    width: 50,
                                    height: 50,
                                    border: "1px solid #ddd",
                                  }}
                                />
                              ) : (
                                <span>Chưa cập nhật</span>
                              )}
                            </td>
                            <td>{`${item.lastName} ${item.firstName}`}</td>
                            <td>{item.address}</td>
                            <td>{item.phonenumber}</td>
                            <td>{gender}</td>
                            <td>{item.email}</td>
                            <td>
                              <button
                                className="btn btn-warning"
                                onClick={() => this.handleUpdatePatient(item)}
                              >
                                <FormattedMessage
                                  id={"manage-patient.update"}
                                />
                              </button>
                              {this.props.user.roleId !== "R2" && (
                                <button
                                  className="btn btn-primary"
                                  onClick={() => this.toggleBookingModal(item)}
                                >
                                  Đặt lịch
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="8" style={{ textAlign: "center" }}>
                          {language === LANGUAGES.VI
                            ? "Không có bệnh nhân"
                            : "No patients"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </LoadingOverlay>

        {/* Hiển thị PatientModal */}
        <CreatePatientModal
          isOpen={this.state.isCreateModalOpen}
          toggle={() => this.setState({ isCreateModalOpen: false })}
          onSaveSuccess={() => this.getDataPatient()}
        />

        {this.state.selectedPatient && (
          <UpdatePatientModal
            key={this.state.selectedPatient.id}
            isOpen={this.state.isUpdateModalOpen}
            toggle={() => this.setState({ isUpdateModalOpen: false })}
            data={this.state.selectedPatient}
            onSaveSuccess={() => this.getDataPatient()} // Gọi lại API lấy danh sách bệnh nhân
          />
        )}
        {this.state.isBookingModalOpen && (
          <BookingModal
            key={this.state.selectedPatient.id}
            isOpenModal={this.state.isBookingModalOpen}
            toggleModal={() => this.setState({ isBookingModalOpen: false })}
            patientData={this.state.selectedPatient} // Truyền thông tin bệnh nhân
          />
        )}
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
  connect(mapStateToProps, mapDispatchToProps)(ManagePatient)
);
