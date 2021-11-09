import React from 'react';
import { Link } from 'umi';
import styles from './index.css';

export default function Home() {
  return (
    <div>
      <h1 className={styles.title}>首页</h1>
      <Link to="/profile">个人中心</Link>
    </div>
  );
}
