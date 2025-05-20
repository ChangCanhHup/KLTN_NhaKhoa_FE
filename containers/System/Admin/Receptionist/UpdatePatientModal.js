import React, { Component } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import "./PatientModal.scss";
import {
  filterHistoriesPatient,
  editUserForAdmin,
} from "../../../../services/userService";
import { toast } from "react-toastify";
import moment from "moment";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import { formatCurrency } from "../../../../utils/formatCurrency";

class UpdatePatientModal extends Component {
  constructor(props) {
    super(props);
    this.mdParser = new MarkdownIt(); // Khởi tạo MarkdownIt parser
    this.state = {
      patientData: this.props.data || {
        firstName: "",
        lastName: "",
        email: "",
        phonenumber: "",
        address: "",
        gender: "M",
        image: null,
        medicalHistoryMarkdown: "",
        medicalHistoryHTML: "",
      },
      patientHistory: [], // Lịch sử bệnh án
      units: [
        { key: "pill", valueVi: "Viên", valueEn: "Pill" },
        { key: "package", valueVi: "Gói", valueEn: "Package" },
        { key: "bottle", valueVi: "Chai", valueEn: "Bottle" },
        { key: "tube", valueVi: "Ống", valueEn: "Tube" },
        { key: "set", valueVi: "Bộ", valueEn: "Set" },
      ],
    };
  }

  componentDidMount() {
    if (this.props.data && this.props.data.id) {
      this.loadPatientHistory();
    }
  }

  handleInputChange = (e, field) => {
    let updatedData = { ...this.state.patientData };
    updatedData[field] = e.target.value;
    this.setState({ patientData: updatedData });
  };

  handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        let updatedData = { ...this.state.patientData };
        updatedData.image = event.target.result;
        this.setState({ patientData: updatedData });
      };
      reader.readAsDataURL(file);
    }
  };

  handleMarkdownChange = ({ text }) => {
    let updatedData = { ...this.state.patientData };
    updatedData.medicalHistoryMarkdown = text;
    updatedData.medicalHistoryHTML = this.mdParser.render(text); // Chuyển đổi sang HTML
    this.setState({ patientData: updatedData });
  };

  validateInputs = () => {
    const { patientData } = this.state;

    if (!patientData.firstName || !patientData.firstName.trim()) {
      toast.error("Vui lòng nhập họ của bệnh nhân.");
      return false;
    }
    if (!patientData.lastName || !patientData.lastName.trim()) {
      toast.error("Vui lòng nhập tên của bệnh nhân.");
      return false;
    }
    if (
      !patientData.email ||
      !patientData.email.trim() ||
      !/\S+@\S+\.\S+/.test(patientData.email)
    ) {
      toast.error("Vui lòng nhập email hợp lệ.");
      return false;
    }
    if (
      !patientData.phonenumber ||
      !patientData.phonenumber.trim() ||
      !/^\d+$/.test(patientData.phonenumber)
    ) {
      toast.error("Vui lòng nhập số điện thoại hợp lệ.");
      return false;
    }
    if (!patientData.address || !patientData.address.trim()) {
      toast.error("Vui lòng nhập địa chỉ.");
      return false;
    }

    return true;
  };

  handleSave = async () => {
    if (!this.validateInputs()) return; // Kiểm tra validate

    try {
      const { patientData } = this.state;

      // Kiểm tra nếu ảnh là một file object mới
      let imageToUpload = patientData.image;
      if (typeof patientData.image !== "string") {
        imageToUpload = this.convertBufferToBase64(patientData.image);
      }

      // Chuẩn bị dữ liệu gửi
      const updatedData = {
        ...patientData,
        image: imageToUpload, // Gán lại ảnh sau khi kiểm tra
      };

      const response = await editUserForAdmin(updatedData);

      if (response && response.errCode === 0) {
        toast.success("Cập nhật thông tin bệnh nhân thành công!");
        this.props.onSaveSuccess(); // Gọi callback từ parent để lấy lại danh sách bệnh nhân
        this.props.toggle(); // Đóng modal
      } else {
        toast.error(response.errMessage || "Có lỗi xảy ra!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Đã xảy ra lỗi trong quá trình cập nhật!");
    }
  };

  loadPatientHistory = async () => {
    const { patientData } = this.state;
    if (!patientData.id) {
      toast.error("Không tìm thấy bệnh nhân!");
      return;
    }

    try {
      const payload = {
        patientId: patientData.id,
      };
      const response = await filterHistoriesPatient(payload); // Gọi API để lấy lịch sử bệnh án
      if (response && response.errCode === 0) {
        this.setState({ patientHistory: response.data });
      } else {
        toast.error("Không thể tải lịch sử bệnh án!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Đã xảy ra lỗi khi tải lịch sử bệnh án!");
    }
  };

  getUnitDisplay = (unitKey) => {
    const { units } = this.state;
    const unit = units.find((item) => item.key === unitKey);
    if (unit) {
      return unit.valueVi;
    }
    return unitKey; // Trả về key nếu không tìm thấy
  };
  convertBufferToBase64 = (bufferArray) => {
    if (!bufferArray || bufferArray.length === 0) {
      console.warn("Invalid buffer array:", bufferArray);
      return ""; // Trả về chuỗi rỗng nếu buffer không hợp lệ
    }
    const imageBase64 = new Buffer(bufferArray, "base64").toString("binary");
    return imageBase64;
  };
  render() {
    let { isOpen, toggle } = this.props;
    let { patientData, patientHistory } = this.state;

    return (
      <Modal
        isOpen={isOpen}
        toggle={toggle}
        className="patient-modal"
        size="xl"
      >
        <ModalHeader toggle={toggle}>
          {patientData.id
            ? "Cập nhật thông tin bệnh nhân"
            : "Thêm mới bệnh nhân"}
        </ModalHeader>
        <ModalBody>
          <h5>Thông tin bệnh nhân</h5>
          <form>
            <div className="row">
              <div className="col-md-6 form-group">
                <label>Họ</label>
                <input
                  type="text"
                  className="form-control"
                  value={patientData.lastName}
                  onChange={(e) => this.handleInputChange(e, "lastName")}
                  placeholder="Nhập họ"
                />
              </div>
              <div className="col-md-6 form-group">
                <label>Tên</label>
                <input
                  type="text"
                  className="form-control"
                  value={patientData.firstName}
                  onChange={(e) => this.handleInputChange(e, "firstName")}
                  placeholder="Nhập tên"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 form-group">
                <label>Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={patientData.email}
                  onChange={(e) => this.handleInputChange(e, "email")}
                  placeholder="Nhập email"
                />
              </div>
              <div className="col-md-6 form-group">
                <label>Số điện thoại</label>
                <input
                  type="text"
                  className="form-control"
                  value={patientData.phonenumber}
                  onChange={(e) => this.handleInputChange(e, "phonenumber")}
                  placeholder="Nhập số điện thoại"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 form-group">
                <label>Địa chỉ</label>
                <input
                  type="text"
                  className="form-control"
                  value={patientData.address}
                  onChange={(e) => this.handleInputChange(e, "address")}
                  placeholder="Nhập địa chỉ"
                />
              </div>
              <div className="col-md-6 form-group">
                <label>Giới tính</label>
                <select
                  className="form-control"
                  value={patientData.gender}
                  onChange={(e) => this.handleInputChange(e, "gender")}
                >
                  <option value="M">Nam</option>
                  <option value="F">Nữ</option>
                </select>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 form-group">
                <label>Ảnh bệnh nhân (Nếu có)</label>
                {patientData.image ? (
                  <img
                    src={
                      typeof patientData.image === "string"
                        ? patientData.image // Nếu là base64 hoặc DataURL
                        : this.convertBufferToBase64(patientData.image) // Nếu là buffer
                    }
                    alt="Avatar"
                    style={{
                      width: "150px",
                      height: "150px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      display: "block",
                      marginBottom: "10px",
                    }}
                  />
                ) : (
                  <p>Chưa có ảnh bệnh nhân</p>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={this.handleImageChange}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-12 form-group">
                <label>Tiền sử bệnh án</label>
                <MdEditor
                  style={{ height: "300px" }}
                  renderHTML={(text) => this.mdParser.render(text)}
                  onChange={this.handleMarkdownChange}
                  value={patientData.medicalHistoryMarkdown}
                />
              </div>
            </div>
          </form>

          <div className="patient-history mt-4">
            <h5>Lịch sử điều trị</h5>
            {patientHistory && patientHistory.length > 0 ? (
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Ngày khám</th>
                    <th>Lý do</th>
                    <th>Nha sĩ khám</th>
                    <th>Răng khám</th>
                    <th>Đơn thuốc</th>
                    <th>Lời dặn</th>
                    <th>Hóa đơn khám bệnh</th>
                  </tr>
                </thead>
                <tbody>
                  {patientHistory.map((history, index) => {
                    const drugs = JSON.parse(history.drugs || "[]");
                    const teethExamined = JSON.parse(
                      history.teethExamined || "[]"
                    );
                    return (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>
                          {moment(history.createdAt).format("DD/MM/YYYY")}
                        </td>
                        <td>{history.reason}</td>
                        <td>
                          {history.doctorDataHistory?.lastName}{" "}
                          {history.doctorDataHistory?.firstName}
                        </td>
                        <td>
                          {teethExamined && teethExamined.length > 0 ? (
                            <ul>
                              {teethExamined.map((tooth, i) => (
                                <p key={i}>
                                  {tooth.code} - {tooth.serviceName} -{" "}
                                  {formatCurrency(tooth.servicePrice)}
                                </p>
                              ))}
                            </ul>
                          ) : (
                            <p>Không có</p>
                          )}
                        </td>

                        <td>
                          <ul>
                            {drugs.map((drug, i) => (
                              <p key={i}>
                                {drug.name} | {drug.amount}{" "}
                                {this.getUnitDisplay(drug.unit)} |{" "}
                                {drug.description_usage}
                              </p>
                            ))}
                          </ul>
                        </td>
                        <td>{history.description}</td>
                        <td>
                          {history.files ? (
                            <a
                              href={history.files}
                              download="hoa-don.png"
                              style={{ display: "block" }}
                            >
                              <img
                                src={history.files}
                                alt="Hóa đơn"
                                style={{
                                  width: "150px",
                                  height: "150px",
                                  objectFit: "cover",
                                  cursor: "pointer",
                                }}
                              />
                            </a>
                          ) : (
                            "Không có"
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <p>Không có lịch điều trị.</p>
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.handleSave}>
            Lưu
          </Button>
          <Button color="secondary" onClick={toggle}>
            Hủy
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default UpdatePatientModal;
