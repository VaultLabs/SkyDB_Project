import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Menu, Button } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import store from 'store';
import _ from 'lodash';
import { fetchMenu } from 'core/redux/menu/actions';
import { logout } from 'core/redux/login/actions';
import utils from 'utils';
import Login from './Login';
import styles from './style.module.scss';

const { SubMenu, Divider } = Menu;

const MenuTop = (props) => {
  const [selectedKeys, setSelectedKeys] = useState(store.get('app.menu.selectedKeys') || []);
  const {
    menuData,
    selectedAccount,
    isLoggedIn,
    signingOut,
    dispatchLogout,
    dispatchFetchMenu,
  } = props;

  const getSelectedKeys = () => {
    const flattenItems = (items, key) =>
      items.reduce((flattenedItems, item) => {
        flattenedItems.push(item);
        if (Array.isArray(item[key])) {
          return flattenedItems.concat(flattenItems(item[key], key));
        }
        return flattenedItems;
      }, []);

    const selectedItem = _.find(flattenItems(menuData, 'children'), [
      'url',
      props.location.pathname,
    ]);
    setSelectedKeys(selectedItem ? [selectedItem.key] : []);
  };

  // Fetch Manu
  useEffect(
    function fetchMenuEffect() {
      dispatchFetchMenu();
    },
    [dispatchFetchMenu],
  );

  // Update selected keys
  useEffect(
    function selectedKeysEffect() {
      getSelectedKeys();
    },
    [menuData],
  );

  const handleClick = (e) => {
    // Menu links forbidden to be selected
    if (
      !(
        e.key === 'account' ||
        e.key === 'userArea' ||
        (e.key === 'customization' && !selectedAccount)
      )
    ) {
      store.set('app.menu.selectedKeys', [e.key]);

      setSelectedKeys([e.key]);
    }
  };

  const generateMenuItems = () => {
    const generateItem = (item) => {
      const { key, title, url, icon } = item;
      if (item.divider) {
        return <Divider key={Math.random()} />;
      }
      if (item.url) {
        return (
          <Menu.Item key={key}>
            {item.target ? (
              <a href={url} target={item.target} rel="noopener noreferrer">
                {icon && <span className={`${icon} ${styles.icon}`} />}
                <span className={styles.title}>{title}</span>
              </a>
            ) : (
              <Link to={url}>
                {icon && <span className={`${icon} ${styles.icon}`} />}
                <span className={styles.title}>{title}</span>
              </Link>
            )}
          </Menu.Item>
        );
      }
      return (
        <Menu.Item key={key}>
          {icon && <span className={`${icon} ${styles.icon}`} />}
          <span className={styles.title}>{title}</span>
        </Menu.Item>
      );
    };
    const generateSubmenu = (items) =>
      items.map((menuItem) => {
        if (menuItem.children) {
          const subMenuTitle = (
            <span className={styles.menu} key={menuItem.key}>
              <span className={styles.title}>{menuItem.title}</span>
              {menuItem.icon && <span className={`${menuItem.icon} ${styles.icon}`} />}
            </span>
          );
          return (
            <SubMenu title={subMenuTitle} key={menuItem.key}>
              {generateSubmenu(menuItem.children)}
            </SubMenu>
          );
        }
        return generateItem(menuItem);
      });
    return menuData.map((menuItem) => {
      if (menuItem.children) {
        const subMenuTitle = (
          <span className={styles.menu} key={menuItem.key}>
            <span className={styles.title}>{menuItem.title}</span>
            {menuItem.icon && <span className={`${menuItem.icon} ${styles.icon}`} />}
          </span>
        );
        return (
          <SubMenu title={subMenuTitle} key={menuItem.key}>
            {generateSubmenu(menuItem.children)}
          </SubMenu>
        );
      }
      return generateItem(menuItem);
    });
  };

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
      <Menu theme="dark" onClick={handleClick} selectedKeys={selectedKeys} mode="horizontal">
        {generateMenuItems()}
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
  menuData: state.menu.menuTopData,
  selectedAccount: state.login.selectedAccount,
  isLoggedIn: state.login.isLoggedIn,
  signingOut: state.login.signingOut,
});

const mapDispatchToProps = (dispatch) => ({
  dispatchLogout: () => dispatch(logout()),
  dispatchFetchMenu: () => dispatch(fetchMenu()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MenuTop));
