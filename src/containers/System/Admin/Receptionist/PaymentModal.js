import React, { Component } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

class PaymentModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      paymentMethod: "",
    };
  }

  handleChange = (event) => {
    this.setState({ paymentMethod: event.target.value });
  };

  handleConfirm = () => {
    const { paymentMethod } = this.state;
    if (!paymentMethod) {
      alert("Vui lòng chọn hình thức thanh toán!");
      return;
    }
    this.props.onConfirm(paymentMethod);
  };

  render() {
    const { isOpen, toggle } = this.props;

    return (
      <Modal isOpen={isOpen} toggle={toggle}>
        <ModalHeader toggle={toggle}>Chọn hình thức thanh toán</ModalHeader>
        <ModalBody>
          <div>
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="Tiền mặt"
                onChange={this.handleChange}
              />
              Tiền mặt
            </label>
          </div>
          <div>
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="Chuyển khoản"
                onChange={this.handleChange}
              />
              Chuyển khoản
            </label>
          </div>
          <div>
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="Online"
                onChange={this.handleChange}
              />
              Thanh toán trực tuyến
            </label>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.handleConfirm}>
            Xác nhận
          </Button>
          <Button color="secondary" onClick={toggle}>
            Hủy
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default PaymentModal;
