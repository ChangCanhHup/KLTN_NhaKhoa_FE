import React, { Component } from "react";
import { connect } from "react-redux";
import {
  getAllHistory,
  postSendRemedy,
} from "../../../../services/userService";
import { toast } from "react-toastify";
import LoadingOverlay from "react-loading-overlay";
import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader";
import PaymentModal from "./PaymentModal";
import { formatCurrency } from "../../../../utils/formatCurrency";

class ManageBill extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataHistories: [],
      filteredHistories: [], // Danh sách đã lọc
      isShowLoading: false,
      isPaymentModalOpen: false,
      selectedHistory: null,
      searchKeyword: "", // Từ khóa tìm kiếm
    };
  }
  handleSearch = () => {
    const { dataHistories, searchKeyword } = this.state;

    if (!searchKeyword.trim()) {
      this.setState({ filteredHistories: dataHistories });
      return;
    }

    const keyword = searchKeyword.toLowerCase();

    const filteredHistories = dataHistories.filter((item) => {
      const patientName = `${
        item.bookingData?.patientName || ""
      }`.toLowerCase();
      const phoneNumber = `${
        item.bookingData?.patientPhoneNumber || ""
      }`.toLowerCase();
      return patientName.includes(keyword) || phoneNumber.includes(keyword);
    });

    this.setState({ filteredHistories });
  };
  async componentDidMount() {
    await this.getAllHistories();
    const { dataHistories, searchKeyword } = this.state;
    this.setState({ filteredHistories: dataHistories });
  }

  getAllHistories = async () => {
    this.setState({ isShowLoading: true });
    try {
      let res = await getAllHistory();
      if (res && res.errCode === 0) {
        // Đồng bộ dataHistories và filteredHistories
        this.setState({
          dataHistories: res.data,
          filteredHistories: res.data, // Đặt lại filteredHistories
        });
      } else {
        toast.error("Không thể tải dữ liệu hóa đơn!");
      }
    } catch (error) {
      console.error("Error fetching histories:", error);
      toast.error("Lỗi khi tải dữ liệu!");
    } finally {
      this.setState({ isShowLoading: false });
    }
  };

  handlePayment = (history) => {
    this.setState({ isPaymentModalOpen: true, selectedHistory: history });
  };
  convertBufferToBase64 = (bufferArray) => {
    if (!bufferArray || bufferArray.length === 0) {
      console.warn("Invalid buffer array:", bufferArray);
      return ""; // Trả về chuỗi rỗng nếu buffer không hợp lệ
    }
    const imageBase64 = new Buffer(bufferArray, "base64").toString("binary");
    return imageBase64;
  };
  handleConfirmPayment = async (paymentMethod) => {
    const { selectedHistory } = this.state;
    if (!selectedHistory) return;

    const requestData = {
      email: selectedHistory.patientData?.email,
      doctorId: selectedHistory.doctorId,
      patientId: selectedHistory.patientId,
      bookingId: selectedHistory.bookingId,
      timeType: selectedHistory.timeType,
      language: this.props.language,
      patientName: `${selectedHistory.patientData?.firstName} ${selectedHistory.patientData?.lastName}`,
      specialtyId: selectedHistory.specialtyId,
      imgBase64: this.convertBufferToBase64(selectedHistory.files),
      totalCost: selectedHistory.totalFee,
      paymentMethod, // Gửi hình thức thanh toán
      historyId: selectedHistory.id, // ID của lịch sử để cập nhật trạng thái
    };

    try {
      let res = await postSendRemedy(requestData);

      if (res && res.errCode === 0) {
        toast.success("Thanh toán thành công!");
        this.setState((prevState) => ({
          dataHistories: prevState.dataHistories.map((item) =>
            item.id === selectedHistory.id
              ? { ...item, paymentStatus: true, paymentMethod }
              : item
          ),
          isPaymentModalOpen: false,
          selectedHistory: null,
        }));
      } else {
        toast.error("Thanh toán thất bại!");
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
      toast.error("Lỗi khi thanh toán!");
    }
  };
  handlePrintBill = (history) => {
    if (!history.files) {
      toast.info("Bác sĩ chưa tạo đơn điều trị cho bệnh nhân này!");
      return;
    }

    // Chuyển đổi files từ buffer sang base64
    const imageBase64 = this.convertBufferToBase64(history.files);

    // Tạo một thẻ <a> để tải hình ảnh xuống
    const link = document.createElement("a");
    link.href = imageBase64;
    link.download = `HoaDon_${history.patientData?.lastName || ""}_${
      history.patientData?.firstName || ""
    }.jpg`; // Đặt tên tệp
    link.click(); // Kích hoạt hành động tải xuống
  };

  render() {
    const { filteredHistories, isShowLoading, isPaymentModalOpen } = this.state;

    return (
      <LoadingOverlay
        active={isShowLoading}
        spinner={<ClimbingBoxLoader color={"#86e7d4"} size={15} />}
      >
        <div
          style={{
            padding: "20px",
            backgroundColor: "#f9f9f9",
            borderRadius: "10px",
          }}
        >
          <h3 style={{ textAlign: "center", marginBottom: "20px" }}>
            Quản lý hóa đơn
          </h3>
          <div style={{ marginBottom: "20px" }}>
            <input
              type="text"
              style={{
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "5px",
                width: "300px",
                marginRight: "10px",
              }}
              placeholder="Tìm kiếm theo tên hoặc số điện thoại..."
              value={this.state.searchKeyword}
              onChange={(e) => this.setState({ searchKeyword: e.target.value })}
            />
            <button
              style={{
                padding: "10px 20px",
                backgroundColor: "#007bff",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              onClick={this.handleSearch}
            >
              Tìm kiếm
            </button>
          </div>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: "20px",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f2f2f2", textAlign: "left" }}>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>#</th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Bệnh nhân
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Số điện thoại
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Email
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Bác sĩ
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Dịch vụ
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Tổng phí
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Thanh toán
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredHistories.map((item, index) => (
                <tr key={index}>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {index + 1}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {item.bookingData?.patientName || "N/A"}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {item.bookingData?.patientPhoneNumber || "N/A"}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {item.patientData?.email || "N/A"}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {item.doctorDataHistory?.firstName || "N/A"}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {item.specialtyDataHistory?.name || "N/A"}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {formatCurrency(item.totalFee) || "0đ"}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {item.paymentStatus ? (
                      <span style={{ color: "green", fontWeight: "bold" }}>
                        Đã thanh toán
                      </span>
                    ) : (
                      <button
                        style={{
                          backgroundColor: "#ff9800",
                          color: "#fff",
                          padding: "5px 10px",
                          border: "none",
                          borderRadius: "5px",
                        }}
                        onClick={() => this.handlePayment(item)}
                      >
                        Thanh toán
                      </button>
                    )}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    <button
                      style={{
                        backgroundColor: "#007bff",
                        color: "#fff",
                        padding: "5px 10px",
                        border: "none",
                        borderRadius: "5px",
                      }}
                      onClick={() => this.handlePrintBill(item)}
                    >
                      In hóa đơn
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <PaymentModal
            isOpen={isPaymentModalOpen}
            toggle={() => this.setState({ isPaymentModalOpen: false })}
            onConfirm={this.handleConfirmPayment}
          />
        </div>
      </LoadingOverlay>
    );
  }
}

export default connect()(ManageBill);
