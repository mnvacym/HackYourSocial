import React from 'react';
import { Link } from 'react-router-dom';
// import { AvForm, AvGroup, AvInput, AvFeedback } from 'availity-reactstrap-validation';
// import { Button, Label } from 'reactstrap';

export default class ChangePasswordPage extends React.Component {
  constructor(props) {
    super(props);

    // bound functions
    this.handleInputChange = this.handleInputChange.bind(this);
    // this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleValidSubmit = this.handleValidSubmit.bind(this);

    // component state
    this.state = {
      password: '',
      passwordCheck: '',
    };
  }

  // Handle input changes
  handleInputChange(e) {
    this.setState({ [e.currentTarget.id]: e.target.value });
  }

  // catch enter clicks
  handleKeyPress(target) {
    if (target.charCode === 13) {
      target.preventDefault();
      this.handleValidSubmit();
    }
  }

  // Handle submission once all form data is valid
  handleValidSubmit() {
    const formData = this.state;
    const { sendPasswordFunction } = this.props;
    sendPasswordFunction(formData.password);
  }

  render() {
    const { isPasswordChanged, isLoggedIn } = this.props.auth;

    // If they just changed a password and AREN'T logged in
    if (isPasswordChanged && !isLoggedIn) {
      return (
        <div className="row justify-content-center">
          <div className="col-10 col-sm-7 col-md-5 col-lg-4">
            <p>
              Your changes have been saved, and you can now <Link to="/login">log in</Link> with the
              new password.
            </p>
          </div>
        </div>
      );
    }

    // If they just changed a password and ARE logged in
    if (isPasswordChanged && isLoggedIn) {
      return (
        <div className="row justify-content-center">
          <div className="col-10 col-sm-7 col-md-5 col-lg-4">
            <p>Your new password has been saved.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="row justify-content-center">
        <div className="col-10 col-sm-7 col-md-5 col-lg-4">
          <p>
            Please enter and confirm a new password below to change the password associated with
            this email address.
          </p>

          <form onValidSubmit={this.handleValidSubmit}>
            <label for="password">Password</label>
            <input
              id="password"
              minLength="6"
              name="password"
              onChange={this.handleInputChange}
              // onKeyPress={this.handleKeyPress}
              placeholder="password"
              required
              type="password"
              value={this.state.password}
            />
            <p>Passwords must be at least six characters in length</p>

            <label for="password">Confirm Password</label>
            <input
              id="passwordCheck"
              minLength="6"
              name="passwordCheck"
              onChange={this.handleInputChange}
              // onKeyPress={this.handleKeyPress}
              placeholder="password again"
              required
              type="password"
              validate={{ match: { value: 'password' } }}
              value={this.state.passwordCheck}
            />
            <p>Passwords must match</p>

            <button type="submit" color="primary">
              Change Password
            </button>
          </form>
        </div>
      </div>
    );
  }
}
