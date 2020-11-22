import React from 'react';
import { Button } from 'antd';
import { connect } from 'react-redux';
import { changeAuthorization } from 'core/redux/login/actions';
import styles from './style.module.scss';

const Login = (props) => {
  const { loading, changeAuthorizationProps, initializingWeb3, registered } = props;

  let text;

  if (initializingWeb3 && !registered) {
    text = 'Connecting';
  } else if (loading && !registered) {
    text = 'Registering';
  } else if (loading && registered) {
    text = 'Fetching';
  } else {
    text = 'Connect to a wallet';
  }
  return (
    <div className={styles.loginButton}>
      <Button type="primary" onClick={() => changeAuthorizationProps()} loading={loading}>
        {text}
      </Button>
    </div>
  );
};

const mapStateToProps = (state) => ({
  registered: state.login.registered,
  loading: state.login.end2endLoadingIndicator,
  initializingWeb3: state.login.initializingWeb3,
});

const mapDispatchToProps = (dispatch) => ({
  changeAuthorizationProps: () => dispatch(changeAuthorization()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
