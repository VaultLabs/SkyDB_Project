import React from 'react';
import { connect } from 'react-redux';
import { Menu, Button } from 'antd';
import { withRouter } from 'react-router-dom';
import { logout } from 'core/redux/login/actions';
import utils from 'utils';
import Login from './Login';
import styles from './style.module.scss';

const SimpleMenuTop = (props) => {
  const { selectedAccount, isLoggedIn, signingOut, dispatchLogout } = props;

  let userArea;

  if (isLoggedIn && !signingOut) {
    userArea = (
      <div className={styles.userArea}>
        <Button type="primary" className="text-center login-form-button" onClick={dispatchLogout}>
          Logout
        </Button>
      </div>
    );
  } else if (isLoggedIn && signingOut) {
    userArea = (
      <div className={styles.userArea}>
        <Button type="primary" className="text-center login-form-button" disabled>
          Disconnecting
        </Button>
      </div>
    );
  } else {
    userArea = <Login />;
  }

  return (
    <div>
      <div className={styles.logo}>
        <div className={styles.logoContainer}>
          <img src="vaultlabslogo.png" alt="logo" />
        </div>
      </div>
      <Menu selectedKeys={['title']} theme="dark" mode="horizontal">
        <Menu.Item key="title">SKYDB STAC Browser</Menu.Item>
        <Menu theme="dark" mode="horizontal" style={{ float: 'right' }}>
          {selectedAccount && (
            <Menu.Item key="account">{utils.getShortAddress(selectedAccount)}</Menu.Item>
          )}
          <Menu.Item key="userArea">{userArea}</Menu.Item>
        </Menu>
      </Menu>
    </div>
  );
};

const mapStateToProps = (state) => ({
  selectedAccount: state.login.selectedAccount,
  isLoggedIn: state.login.isLoggedIn,
  signingOut: state.login.signingOut,
});

const mapDispatchToProps = (dispatch) => ({
  dispatchLogout: () => dispatch(logout()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SimpleMenuTop));
