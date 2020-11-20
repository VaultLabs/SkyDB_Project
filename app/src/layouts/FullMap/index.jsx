import React from 'react';
import { Layout } from 'antd';
import MenuTop from 'components/LayoutComponents/Menu/MenuTop';
import MenuSide from 'components/LayoutComponents/Menu/MenuSide';

const { Content } = Layout;

const FullMapLayout = (props) => {
  const { children } = props;

  return (
    <Layout>
      <Layout style={{ height: '100vh' }} className="site-layout">
        <MenuTop />
        <Content style={{ height: '100%', position: 'relative' }}>{children}</Content>
      </Layout>
      <MenuSide />
    </Layout>
  );
};

export default FullMapLayout;
