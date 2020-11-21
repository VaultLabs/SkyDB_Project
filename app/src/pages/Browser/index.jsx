import React, { useState } from 'react';
import { Table, Popover, Button } from 'antd';
import { connect } from 'react-redux';
import Authorize from 'components/LayoutComponents/Authorize';
import { useSubscription } from '@apollo/react-hooks';
import spatialAssetsSubscription from 'core/graphql/spatialAssetsSubscription';

function Customization(props) {
  const { selectedAccount } = props;

  const [visible, setVisible] = useState(false);

  const { data, loading } = useSubscription(spatialAssetsSubscription, {
    variables: {
      where: {
        ...(selectedAccount ? { owner: selectedAccount } : {}),
        ...{ active: true },
      },
    },
  });

  const hide = () => {
    setVisible(false);
  };

  const handleVisibleChange = (v) => {
    setVisible(v);
  };

  if (loading || !data) {
    return (
      <Authorize authorizedAccounts={[selectedAccount]} redirect to="/">
        <div className="card">
          <div className="card-header">
            <div className="utils__title">
              <strong>View your STAC items</strong>
            </div>
          </div>
          <div className="card-body">LOADING</div>
        </div>
      </Authorize>
    );
  }

  const spatialAssets = data && data.spatialAssets;

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Active',
      dataIndex: 'active',
      key: 'active',
    },
    {
      title: 'Fetch STAC',
      dataIndex: 'fetch',
      key: 'fetch',
      render: () => (
        <Popover
          content={
            <Button type="link" onClick={hide}>
              Close
            </Button>
          }
          title="Title"
          trigger="click"
          visible={visible}
          onVisibleChange={handleVisibleChange}
        >
          <Button type="primary">Click me</Button>
        </Popover>
      ),
    },
  ];

  return (
    <Authorize authorizedAccounts={[selectedAccount]} redirect to="/">
      <div className="card">
        <div className="card-header">
          <div className="utils__title">
            <strong>View your STAC items</strong>
          </div>
        </div>
        <div className="card-body">
          <Table
            className="utils__scrollTable"
            scroll={{ x: '100%' }}
            columns={columns}
            rowKey="id"
            tableLayout="auto"
            dataSource={
              spatialAssets &&
              spatialAssets.map((spatialAsset) => ({
                id: spatialAsset.id,
                active: spatialAsset.active.toString(),
              }))
            }
          />
        </div>
      </div>
    </Authorize>
  );
}

const mapStateToProps = (state) => ({
  web3: state.login.web3,
  selectedAccount: state.login.selectedAccount,
});

export default connect(mapStateToProps, null)(Customization);
