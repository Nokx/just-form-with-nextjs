import React from 'react';
import Head from 'next/head';

export default () => (
  <header>
    <Head>
      <title>Просмотр заявок</title>
      <link href="/static/styles.css" rel="stylesheet"/>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.98.0/css/materialize.min.css"/>
      <link href="http://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"/>
    </Head>
    <nav>
      <div className="nav-wrapper">
        <span className="title">Просмотр заявок</span>
      </div>
    </nav>
  </header>
)