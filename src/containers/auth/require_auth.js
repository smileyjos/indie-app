import React, { Component } from 'react';
import { connect } from 'react-redux';
import history from "../../history"

export default function (ComposedComponent) {
  class Authentication extends Component {
    componentDidMount() {
      if (!this.props.authenticated) {
        history.push('/');
      }
    }

    componentDidUpdate(nextProps) {
      if (!nextProps.authenticated) {
        history.push('/');
      }
    }

    render() {
      return <ComposedComponent {...this.props} />;
    }
  }

  function mapStateToProps(state) {
    return { authenticated: state.auth.authenticated };
  }

  return connect(mapStateToProps)(Authentication);
}
