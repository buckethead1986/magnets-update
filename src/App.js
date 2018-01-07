import React, { Component } from "react";
import { withRouter, Route } from "react-router-dom";
import "./App.css";
import Main from "./components/Main";
import Signup from "./components/signup/Signup";
import Login from "./components/login/Login";

const url = "http://localhost:3001/api/v1";
const headers = {
  Accept: "application/json",
  "Content-Type": "application/json"
};

class App extends Component {
  state = {
    users: [],
    currUser: {}
  };

  componentDidMount() {
    const token = localStorage.getItem("token");
    if (token) {
      this.fetchUserInformation();
    } else {
      if (!window.location.href.includes("signup")) {
        this.props.history.push("/login");
      }
    }
  }

  logout = () => {
    localStorage.removeItem("token");
    this.setState({ users: [] });
    this.props.history.push("/login");
  };

  signup = () => {
    this.props.history.push("/signup");
  };

  login = () => {
    this.props.history.push("/login");
  };

  fetchUserInformation = () => {
    console.log("fetching user information");
    fetch(`${url}/users`)
      .then(res => res.json())
      .then(json =>
        this.setState({
          users: json
        })
      )
      .then(() => this.fetchCurrentUser());
  };

  fetchCurrentUser = () => {
    console.log("fetchCurrentUser");
    fetch(`${url}/current_user`, {
      headers: {
        "content-type": "application/json",
        accept: "application/json",
        Authorization: localStorage.getItem("token")
      }
    })
      .then(res => res.json())
      .then(json =>
        this.setState(
          {
            currUser: json
          },
          () => console.log(json, this.state.currUser)
        )
      );
  };

  render() {
    return (
      <div className="App">
        <Route
          exact
          path="/signup"
          render={props => (
            <Signup
              url={url}
              fetchUsers={this.fetchUserInformation}
              headers={headers}
              login={this.login}
              {...props}
            />
          )}
        />
        <Route
          exact
          path="/login"
          render={props => (
            <Login
              url={url}
              fetchUsers={this.fetchUserInformation}
              headers={headers}
              signup={this.signup}
              {...props}
            />
          )}
        />
        <Route
          exact
          path="/"
          render={() => {
            if (this.state.currUser.length !== 0) {
              return (
                <div>
                  <Main url={url} users={this.state.users} />
                </div>
              );
            } else {
              return "";
            }
          }}
        />
      </div>
    );
  }
}

export default withRouter(App);
