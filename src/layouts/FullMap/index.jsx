import React from 'react';
import { Layout } from 'antd';
import SimpleMenuTop from 'components/LayoutComponents/Menu/SimpleMenuTop';
import MenuSide from 'components/LayoutComponents/Menu/MenuSide';

const { Content } = Layout;

const FullMapLayout = (props) => {
  const { children } = props;

  return (
    <Layout>
      <Layout style={{ height: '100vh' }} className="site-layout">
        <SimpleMenuTop />
        <Content style={{ height: '100%', position: 'relative' }}>{children}</Content>
      </Layout>
      <MenuSide />
    </Layout>
  );
};

export default FullMapLayout;
