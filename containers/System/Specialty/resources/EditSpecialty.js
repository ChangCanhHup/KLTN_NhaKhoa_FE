import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "../ManageSpecialty.scss";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import {
  getDetailSpecialtyById,
  udateSpecialtyData,
} from "../../../../services/specialtyService";
import { toast } from "react-toastify";
import { withRouter } from "../../../../utils/withRouter";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";

const mdParser = new MarkdownIt();

class EditSpecialty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      imageBase64: "",
      descriptionHTML: "",
      descriptionMarkdown: "",
      price: "",
      isDental: false,
      previewImgURL: "",
      isOpen: false,
    };
  }

  async componentDidMount() {
    await this.getSpecialtyDetail();
  }

  getSpecialtyDetail = async () => {
    const { specialtyId } = this.props.params;
    const res = await getDetailSpecialtyById({ id: specialtyId });

    if (res && res.errCode === 0 && res.data) {
      const objectUrl = new Buffer(res.data.image, "base64").toString("binary");

      this.setState({
        name: res.data.name,
        imageBase64: res.data.image,
        descriptionHTML: res.data.descriptionHTML,
        descriptionMarkdown: res.data.descriptionMarkdown,
        price: res.data.price || "",
        isDental: res.data.isDental || false,
        previewImgURL: objectUrl,
      });
    }
  };

  openPreviewImage = () => {
    if (!this.state.previewImgURL) return;
    this.setState({
      isOpen: true,
    });
  };

  handleOnChangeInput = (event, id) => {
    this.setState({
      [id]: event.target.value,
    });
  };

  handleEditorChange = ({ html, text }) => {
    this.setState({
      descriptionHTML: html,
      descriptionMarkdown: text,
    });
  };

  handleOnChangeImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.setState({
          imageBase64: e.target.result,
          previewImgURL: URL.createObjectURL(file),
        });
      };
      reader.readAsDataURL(file);
    }
  };
  convertBufferToBase64 = (bufferArray) => {
    if (!bufferArray || bufferArray.length === 0) {
      console.warn("Invalid buffer array:", bufferArray);
      return ""; // Trả về chuỗi rỗng nếu buffer không hợp lệ
    }
    const imageBase64 = new Buffer(bufferArray, "base64").toString("binary");
    return imageBase64;
  };
  handleSaveNewSpecialty = async () => {
    const { specialtyId } = this.props.params;
    const { language } = this.props;

    // Kiểm tra nếu ảnh là một file object mới
    let imageToUpload = this.state.imageBase64;
    if (typeof imageToUpload !== "string") {
      imageToUpload = this.convertBufferToBase64(imageToUpload);
    }

    // Chuẩn bị dữ liệu gửi
    const updatedData = {
      id: specialtyId,
      name: this.state.name,
      image: imageToUpload, // Gán lại ảnh sau khi kiểm tra
      descriptionHTML: this.state.descriptionHTML,
      descriptionMarkdown: this.state.descriptionMarkdown,
      price: this.state.price,
      isDental: this.state.isDental,
    };

    // Gửi yêu cầu cập nhật
    const res = await udateSpecialtyData(updatedData);

    // Xử lý kết quả
    if (res && res.errCode === 0) {
      const successMessage =
        language === "en"
          ? "Update specialty succeed!"
          : "Cập nhật chuyên khoa thành công!";
      toast.success(successMessage);
      await this.getSpecialtyDetail();
    } else {
      const errorMessage = language === "en" ? "Something went wrong!" : "Lỗi!";
      toast.error(errorMessage);
    }
  };

  handleCheckboxChange = (e) => {
    this.setState({
      isDental: e.target.checked,
    });
  };

  render() {
    const { language } = this.props;

    return (
      <div className="manage-specialty-container">
        <div className="ms-title">
          <FormattedMessage id="admin.manage-specialty.title-edit" />
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
            <div
              className="preview-image"
              style={{
                backgroundImage: `url(${this.state.previewImgURL})`,
                width: "100px",
                height: "100px",
                backgroundSize: "cover",
              }}
              onClick={this.openPreviewImage}
            ></div>
            <input
              className="form-control-file"
              type="file"
              onChange={this.handleOnChangeImage}
            />
          </div>

          {/* Is Dental */}
          <div className="col-6 form-group">
            <label>Điều trị răng</label>
            <div>
              <input
                type="checkbox"
                checked={this.state.isDental}
                onChange={this.handleCheckboxChange}
              />
              <span style={{ marginLeft: "10px" }}>
                {this.state.isDental
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
              {language === "en" ? "Update" : "Cập nhật"}
            </button>
          </div>
        </div>

        {this.state.isOpen && (
          <Lightbox
            mainSrc={this.state.previewImgURL}
            onCloseRequest={() => this.setState({ isOpen: false })}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { language: state.app.language };
};

export default withRouter(connect(mapStateToProps)(EditSpecialty));
