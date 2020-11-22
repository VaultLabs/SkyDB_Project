import React, { useRef, useEffect } from 'react';
import { Layout, message, Tabs } from 'antd';
import { connect } from 'react-redux';
import { setSiderCollapse } from 'core/redux/settings/actions';
import Register from './Register';
import Browse from './Browse';

const { TabPane } = Tabs;
const { Sider } = Layout;

const MenuSide = (props) => {
  const { collapsed, dispatchSetSiderCollapse, isLoggedIn, rolesChecked } = props;

  const parentRef = useRef(null);

  const onCollapse = (c) => {
    const siderWidth = parentRef.current.offsetWidth;

    dispatchSetSiderCollapse(c, siderWidth);

    if (!isLoggedIn && !rolesChecked && !c) {
      message.info('Connect to your Ethereum wallet to interact with the dApp');
    }
  };

  useEffect(
    function openSideBar() {
      if (isLoggedIn && rolesChecked) {
        const siderWidth = parentRef.current.offsetWidth;

        dispatchSetSiderCollapse(false, siderWidth);
      }
    },
    [isLoggedIn, rolesChecked],
  );

  return (
    <div ref={parentRef}>
      <Sider
        reverseArrow
        width="30vw"
        collapsible={isLoggedIn}
        collapsed={collapsed}
        onCollapse={onCollapse}
      >
        <div className="logo" />
        {!collapsed && (
          <>
            <Tabs defaultActiveKey="1" centered>
              <TabPane tab="Register STAC items" key="1">
                <Register />
              </TabPane>
              <TabPane tab="Browse STAC items" key="2">
                <Browse />
              </TabPane>
            </Tabs>
          </>
        )}
      </Sider>
    </div>
  );
};

const mapStateToProps = (state) => ({
  collapsed: state.settings.collapsed,
  isLoggedIn: state.login.isLoggedIn,
  rolesChecked: state.login.rolesChecked,
  selectedCog: state.spatialAssets.selectedCog,
});

const mapDispatchToProps = (dispatch) => ({
  dispatchSetSiderCollapse: (collapsed, siderWidth) =>
    dispatch(setSiderCollapse(collapsed, siderWidth)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MenuSide);
