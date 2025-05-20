import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import Header from "../containers/Header/Header";
import ManageBooking from "../containers/System/Admin/Receptionist/ManageBooking";
import ManagePatient from "../containers/System/Admin/Receptionist/ManagePatient";
import CreateBooking from "../containers/System/Admin/Receptionist/CreateBooking";
import ManageBill from "../containers/System/Admin/Receptionist/ManageBill";

class Receptionist extends Component {
  render() {
    const { isLoggedIn } = this.props;

    return (
      <React.Fragment>
        {isLoggedIn && <Header />}
        <div className="system-container">
          <div className="system-list">
            <Switch>
              <Route path="/receptionist/create-booking" component={ManagePatient} />
              <Route path="/receptionist/manage-booking" component={CreateBooking} />
              <Route path="/receptionist/manage-patient" component={ManagePatient} />
              <Route path="/receptionist/manage-bills" component={ManageBill} />
            </Switch>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Receptionist);
