import React, { Component } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import "./PatientModal.scss"; // Tạo file CSS riêng cho styling tùy chỉnh
import { createUserForAdmin } from "../../../../services/userService";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import { toast } from "react-toastify";

class CreatePatientModal extends Component {
  constructor(props) {
    super(props);
    this.mdParser = new MarkdownIt(); // Khởi tạo MarkdownIt parser
    this.state = {
      patientData: {
        firstName: "",
        lastName: "",
        email: "",
        phonenumber: "",
        address: "",
        gender: "M",
        medicalHistoryMarkdown: "",
        medicalHistoryHTML: "", // Thêm trường HTML
        image: null, // Avatar
      },
    };
  }

  handleInputChange = (e, field) => {
    let updatedData = { ...this.state.patientData };
    updatedData[field] = e.target.value;
    this.setState({ patientData: updatedData });
  };

  handleMarkdownChange = ({ html, text }) => {
    let updatedData = { ...this.state.patientData };
    updatedData.medicalHistoryMarkdown = text;
    updatedData.medicalHistoryHTML = html;
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

    const { patientData } = this.state;

    try {
      const response = await createUserForAdmin(patientData);
      if (response && response.errCode === 0) {
        toast.success("Tạo mới bệnh nhân thành công!");
        this.props.onSaveSuccess(); // Gọi callback từ parent để lấy lại danh sách bệnh nhân
        this.props.toggle(); // Đóng modal
      } else {
        toast.error(response.errMessage || "Đã xảy ra lỗi!");
      }
    } catch (error) {
      console.error("Error creating patient:", error);
      toast.error("Đã xảy ra lỗi khi tạo mới bệnh nhân!");
    }
  };

  render() {
    let { isOpen, toggle } = this.props;
    let { patientData } = this.state;

    return (
      <Modal
        isOpen={isOpen}
        toggle={toggle}
        className="patient-modal"
        size="lg"
      >
        <ModalHeader toggle={toggle}>Thêm mới bệnh nhân</ModalHeader>
        <ModalBody>
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
                    src={patientData.image}
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

export default CreatePatientModal;
