import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { notification } from 'antd';

const Authorize = (props) => {
  const { selectedAccount } = props; // current user role
  const { children, redirect = false, to = '/404', authorizedAccounts = [] } = props;
  const authorized = selectedAccount && authorizedAccounts.includes(selectedAccount);

  const AuthorizedChildren = () => {
    // if user not equal needed role and if component is a page - make redirect to needed route
    if (!authorized && redirect) {
      notification.warning({
        message: 'Unauthorized Access',
        description: 'You have to login to access this page!',
        placement: 'bottomRight',
      });
      return <Redirect to={to} />;
    }
    // if user not authorized return null to component
    if (!authorized) {
      return null;
    }
    // if access is successful render children
    return <div>{children}</div>;
  };
  return AuthorizedChildren();
};

const mapStateToProps = (state) => ({
  selectedAccount: state.login.selectedAccount,
});

export default connect(mapStateToProps, null)(Authorize);
