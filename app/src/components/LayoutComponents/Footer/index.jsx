import React from 'react';
import { Button } from 'antd';
import { GithubOutlined } from '@ant-design/icons';
import styles from './style.module.scss';

const Footer = () => (
  <div className={styles.footer}>
    <div className={styles.inner}>
      <p>
        <strong>Joao Martins</strong>
      </p>
      <p>Dapp React Starter Pack</p>
      <div className={styles.bottom}>
        <div>
          <a href="https://github.com/j-mars" target="_blank" rel="noopener noreferrer">
            <Button icon={<GithubOutlined />}>Github</Button>
          </a>
        </div>
      </div>
    </div>
  </div>
);

export default Footer;
