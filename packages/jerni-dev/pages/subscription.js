import React from "react";
import fetch from "isomorphic-fetch";

import Page from "../ui/components/Page";
import SubscriptionTimeline from "../ui/components/SubscriptionTimeline";
import Toolbar from "../ui/components/Toolbar";

const SubscriptionPage = () => (
  <Page title="events timeline | heq devtool">
    <Toolbar />
    <SubscriptionTimeline />
  </Page>
);

SubscriptionPage.getInitialProps = async ({ store, req }) => {
  const base = req ? `http://${req.headers.host}` : "";

  const pulses = await getJSON(`${base}/dev/pulses`);

  store.dispatch({
    type: "PULSES_INITIALIZED",
    payload: pulses
  });

  return {};
};

const getJSON = async (endpoint, opts = {}) => {
  const { headers = {} } = opts;
  const enhancedHeaders = {
    ...headers,
    "content-type": "application/json"
  };
  const resp = await fetch(endpoint, { ...opts, headers: enhancedHeaders });

  const json = await resp.json();

  return json;
};

export default SubscriptionPage;