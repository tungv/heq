import Head from 'next/head';
import React from 'react';
import fetch from 'isomorphic-fetch';

import { eventsReceived } from '../ui/components/subscription.state';
import Dispatcher from '../ui/components/Dispatcher';
import EventDetailBox from '../ui/components/EventDetailBox';
import EventsTimeline from '../ui/components/EventsTimeline';
import Subscriber from '../ui/components/Subscriber';

const getJSON = async (endpoint, opts = {}) => {
  const { headers = {} } = opts;
  const enhancedHeaders = {
    ...headers,
    'content-type': 'application/json',
  };
  const resp = await fetch(endpoint, { ...opts, headers: enhancedHeaders });

  const json = await resp.json();

  return json;
};

const Page = ({ children, title = 'heq devtool' }) => (
  <React.Fragment>
    <Head>
      <title>{title}</title>
      <link
        href="https://fonts.googleapis.com/css?family=Open+Sans|Roboto+Slab|Overpass+Mono"
        rel="stylesheet"
      />
    </Head>
    <main>{children}</main>
    <style jsx>{`
      main {
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
    `}</style>
  </React.Fragment>
);

const Header = ({ children }) => (
  <header>
    <h1>{children}</h1>
    <style jsx>{`
      header {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;

        height: 72px;
        font-family: 'Open Sans';
      }
    `}</style>
  </header>
);

const IndexPage = ({ latest }) => (
  <Page title="events timeline | heq devtool">
    <Subscriber lastSeen={latest.id} />
    <Header>events timeline</Header>
    <div>
      <section>
        <EventsTimeline />
      </section>
      <section>
        <EventDetailBox event={latest} />
        {/* <Dispatcher /> */}
      </section>
    </div>

    <style jsx>{`
      div {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-column-gap: 16px;
        width: 1600px;
        max-width: 100%;
        min-width: 800px;
        margin: auto;
      }
      section {
        display: flex;
        flex-direction: column;

        flex: 1;
      }
    `}</style>
  </Page>
);

IndexPage.getInitialProps = async ({ req, store }) => {
  const base = req ? `http://${req.headers.host}` : '';
  const endpoint = `${base}/events/latest`;

  const latest = await getJSON(endpoint);

  const { id } = latest;

  const last10 = await getJSON(
    `${base}/query?lastEventId=${Math.max(0, id - 10)}`
  );

  store.dispatch(eventsReceived(last10));
  return {
    latest: last10[last10.length - 1],
  };
};

export default IndexPage;