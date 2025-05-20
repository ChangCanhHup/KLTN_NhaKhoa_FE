import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "../ManageSpecialty.scss";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import { createNewSpecialty } from "../../../../services/userService";
import { toast } from "react-toastify";

const mdParser = new MarkdownIt();

class CreateSpecialty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      imageBase64: "",
      descriptionHTML: "",
      descriptionMarkdown: "",
      price: "",
      isDental: false,
    };
  }

  handleOnChangeInput = (event, id) => {
    this.setState({ [id]: event.target.value });
  };

  handleEditorChange = ({ html, text }) => {
    this.setState({
      descriptionHTML: html,
      descriptionMarkdown: text,
    });
  };

  handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        this.setState({ imageBase64: event.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  checkValidateInput = () => {
    const { language } = this.props;
    const fields = [
      "name",
      "imageBase64",
      "descriptionHTML",
      "descriptionMarkdown",
      "price",
    ];
    for (const field of fields) {
      if (!this.state[field]) {
        const message =
          language === "en"
            ? "Missing required parameters!"
            : "Thiếu thông tin chuyên khoa!";
        toast.error(message);
        return false;
      }
    }
    return true;
  };

  handleSaveNewSpecialty = async () => {
    const isValid = this.checkValidateInput();
    if (!isValid) return;

    const {
      name,
      imageBase64,
      descriptionHTML,
      descriptionMarkdown,
      price,
      isDental,
    } = this.state;
    const { language } = this.props;

    const res = await createNewSpecialty({
      name,
      imageBase64,
      descriptionHTML,
      descriptionMarkdown,
      price,
      isDental,
    });

    if (res && res.errCode === 0) {
      const successMessage =
        language === "en"
          ? "Add new specialty successfully!"
          : "Thêm chuyên khoa thành công!";
      toast.success(successMessage);

      this.setState({
        name: "",
        imageBase64: "",
        descriptionHTML: "",
        descriptionMarkdown: "",
        price: "",
        isDental: false,
      });

      setTimeout(() => {
        window.location.href = "/admin-dashboard/manage-specialty";
      }, 1000);
    } else {
      const errorMessage = language === "en" ? "Something went wrong!" : "Lỗi!";
      toast.error(errorMessage);
    }
  };

  handleCheckboxChange = (e) => {
    this.setState({ isDental: e.target.checked });
  };

  render() {
    const { language } = this.props;
    const { imageBase64, isDental } = this.state;

    return (
      <div className="manage-specialty-container">
        <div className="ms-title">
          <FormattedMessage id="admin.manage-specialty.title-create" />
        </div>

        <div className="add-new-specialty row">
          {/* Specialty Name */}
          <div className="col-6 form-group">
            <label>
              <FormattedMessage id="admin.manage-specialty.specialty-name" />
            </label>
            <input
              className="form-control"
              type="text"
              value={this.state.name}
              onChange={(e) => this.handleOnChangeInput(e, "name")}
            />
          </div>

          {/* Specialty Price */}
          <div className="col-6 form-group">
            <label>Giá dịch vụ</label>
            <input
              className="form-control"
              type="number"
              value={this.state.price}
              onChange={(e) => this.handleOnChangeInput(e, "price")}
            />
          </div>

          {/* Specialty Image */}
          <div className="col-6 form-group">
            <label>Ảnh dịch vụ</label>
            {imageBase64 ? (
              <img
                src={imageBase64}
                alt="Specialty"
                style={{
                  width: "150px",
                  height: "150px",
                  borderRadius: "10px",
                  objectFit: "cover",
                  display: "block",
                  marginBottom: "10px",
                }}
              />
            ) : (
              <p>Không có ảnh được chọn</p>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={this.handleImageChange}
            />
          </div>

          {/* Is Dental */}
          <div className="col-6 form-group">
            <label>Điều trị răng</label>
            <div>
              <input
                type="checkbox"
                checked={isDental}
                onChange={this.handleCheckboxChange}
              />
              <span style={{ marginLeft: "10px" }}>
                {isDental
                  ? language === "en"
                    ? "Dental Related"
                    : "Có liên quan điều trị răng"
                  : language === "en"
                  ? "Not Dental Related"
                  : "Không liên quan điều trị răng"}
              </span>
            </div>
          </div>

          {/* Markdown Editor */}
          <div className="col-12">
            <MdEditor
              style={{ height: "300px" }}
              renderHTML={(text) => mdParser.render(text)}
              onChange={this.handleEditorChange}
              value={this.state.descriptionMarkdown}
            />
          </div>

          {/* Save Button */}
          <div className="col-12">
            <button
              className="btn btn-primary mt-10"
              onClick={this.handleSaveNewSpecialty}
            >
              {language === "en" ? "Create" : "Thêm"}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { language: state.app.language };
};

export default connect(mapStateToProps)(CreateSpecialty);
