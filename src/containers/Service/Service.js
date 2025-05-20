import React, { Component } from "react";
import { connect } from "react-redux";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import HomeHeader from "../HomePage/HomeHeader";
import HomeFooter from "../HomePage/HomeFooter";
import { getAllSpecialty } from "../../services/userService";
import { formatCurrency } from "../../utils/formatCurrency";
import { FaCalendarAlt } from "react-icons/fa"; // Thêm biểu tượng lịch
import BookingModal from "../Patient/Specialty/BookingModal";

class Service extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dataSpecialty: [],
      isBookingModalOpen: false, // Trạng thái mở modal
      selectedSpecialtyId: null, // ID của dịch vụ
    };
  }

  async componentDidMount() {
    let res = await getAllSpecialty({ limit: 1200 });
    if (res && res.errCode === 0) {
      this.setState({
        dataSpecialty: res.data ? res.data : [],
      });
    }
  }

  toggleBookingModal = (specialtyId) => {
    if (!specialtyId) {
      console.error("Specialty ID is undefined");
      return;
    }
    this.setState(
      (prevState) => ({
        isBookingModalOpen: !prevState.isBookingModalOpen,
        selectedSpecialtyId: specialtyId,
      }),
      () => {
        console.log("Selected Specialty ID:", this.state.selectedSpecialtyId);
      }
    );
  };

  handleViewDetailSpecialty = (item) => {
    if (this.props.history) {
      this.props.history.push(`/detail-specialty/${item.id}`);
    }
  };

  render() {
    let { dataSpecialty } = this.state;

    return (
      <div>
        <HomeHeader isShowBanner={false} />

        <div style={styles.titleContainer}>
          <h2 style={styles.title}>Dịch vụ của chúng tôi</h2>
        </div>

        <div style={styles.serviceList}>
          {dataSpecialty.map((service) => (
            <div
              key={service.id}
              style={styles.serviceCard}
              onClick={() => this.handleViewDetailSpecialty(service)} // Click card to navigate to detail
            >
              <img
                src={service.image}
                alt={service.name}
                style={styles.serviceImage}
              />
              <div style={styles.serviceDetails}>
                <h3>{service.name}</h3>
                <p style={styles.price}>{formatCurrency(service.price)}</p>
                <button
                  style={styles.btnBookNow}
                  onClick={(e) => {
                    e.stopPropagation(); // Ngăn chặn sự kiện click lan tỏa ra ngoài
                    this.toggleBookingModal(service.id);
                  }}
                >
                  <FaCalendarAlt style={styles.icon} /> Đặt lịch
                </button>
              </div>
            </div>
          ))}
        </div>

        {this.state.isBookingModalOpen && (
          <BookingModal
            isOpenModal={this.state.isBookingModalOpen}
            toggleModal={this.toggleBookingModal}
            selectedSpecialtyId={this.state.selectedSpecialtyId}
          />
        )}
        <HomeFooter />
      </div>
    );
  }
}

const styles = {
  titleContainer: {
    textAlign: "center",
    margin: "40px 0",
  },
  title: {
    fontSize: "30px",
    fontWeight: "bold",
    color: "#333",
  },
  serviceList: {
    display: "grid",
    gridTemplateColumns: "repeat(6, 1fr)",
    gap: "20px",
    marginTop: "20px",
    padding: "0 40px",
  },
  serviceCard: {
    backgroundColor: "#f4f4f4",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    transition:
      "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out, background-color 0.3s ease-in-out",
    cursor: "pointer",
    ":hover": {
      transform: "translateY(-10px)",
      boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
      backgroundColor: "#e2f3f8", // Thêm màu nền khi hover
    },
  },
  serviceImage: {
    width: "100%",
    height: "250px",
    objectFit: "cover",
    transition: "transform 0.3s ease",
    ":hover": {
      transform: "scale(1.05)",
    },
  },
  serviceDetails: {
    padding: "15px",
    textAlign: "center",
  },
  price: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#333",
    margin: "10px 0",
  },
  btnBookNow: {
    marginTop: "15px",
    backgroundColor: "#007bff",
    color: "white",
    padding: "12px 20px",
    border: "none",
    borderRadius: "4px",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    ":hover": {
      backgroundColor: "#0056b3",
    },
  },
  icon: {
    marginRight: "8px",
  },
};

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    userInfo: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Service);
