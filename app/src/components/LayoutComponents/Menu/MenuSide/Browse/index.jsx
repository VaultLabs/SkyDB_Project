import React, { useState } from 'react';
import { List, Button, Menu } from 'antd';
import { connect } from 'react-redux';
import { useSubscription } from '@apollo/react-hooks';
// import Inspector from 'react-inspector';
import { CodeBlock, nord } from 'react-code-blocks';
// import JSONViewer from 'react-json-viewer';
// import ReactJson from 'react-json-view';
import spatialAssetsSubscription from 'core/graphql/spatialAssetsSubscription';
import stac from './stac.json';

const OPEN_KEYS = ['sub1'];
const { SubMenu } = Menu;
// const getJsonIndented = (obj) => JSON.stringify(newObj, null, 4).replace(/["{[,\}\]]/g, '');

const Browse = (props) => {
  const { selectedAccount } = props;
  const [openKeys, setOpenKeys] = useState(OPEN_KEYS);

  // const [visible, setVisible] = useState(false);

  const { data, loading } = useSubscription(spatialAssetsSubscription, {
    variables: {
      where: {
        ...(selectedAccount ? { owner: selectedAccount } : {}),
        ...{ active: true },
      },
    },
  });

  const spatialAssets = data && data.spatialAssets;
  const onOpenChange = (okeys) => setOpenKeys([...OPEN_KEYS, ...okeys]);

  return (
    <Menu
      theme="dark"
      mode="inline"
      openKeys={openKeys}
      onOpenChange={onOpenChange}
      forceSubMenuRender
    >
      <SubMenu key="sub1" title="STAC Items you own">
        <List
          itemLayout="vertical"
          loading={loading || !data}
          size="large"
          pagination={{
            onChange: (page) => {
              console.log(page);
            },
            pageSize: 2,
          }}
          dataSource={
            spatialAssets &&
            spatialAssets.map((spatialAsset) => ({
              id: spatialAsset.id,
              active: spatialAsset.active.toString(),
            }))
          }
          renderItem={(item) => (
            <List.Item key={item.id}>
              <List.Item.Meta
                title={
                  <div style={{ textAlign: 'center' }}>{`STAC ID: ${item.id.substr(
                    0,
                    6,
                  )} ... ${item.id.substr(-4)}`}</div>
                }
                description={
                  <Button block type="primary">
                    Load
                  </Button>
                }
              />
            </List.Item>
          )}
        />
      </SubMenu>
      <SubMenu key="sub2" title="Loaded STAC Item">
        <div>
          <CodeBlock
            customStyle={{
              height: '100vh',
              overflow: 'scroll',
            }}
            text={JSON.stringify(stac, null, 2)}
            language="json"
            theme={nord}
          />
        </div>
      </SubMenu>
    </Menu>
  );
};

const mapStateToProps = (state) => ({
  web3: state.login.web3,
  selectedAccount: state.login.selectedAccount,
});

export default connect(mapStateToProps, null)(Browse);
