'use strict';

import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  TouchableOpacity,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import DZWebView from '../../lib/dazzle-webview';

import * as actions from '../actions'
import * as constants from '../constants'

const WEBVIEW_REF = 'webview';
const DEFAULT_URL = 'https://www.google.com';

class FullWebView extends React.Component {
  state = {
    url: DEFAULT_URL,
    loading: true,
  };

  render() {
    return(
      <View style={[styles.container]}>
        <DZWebView
          ref={WEBVIEW_REF}
          automaticallyAdjustContentInsets={false}
          source={{uri: this.state.url}}
          decelerationRate="normal"
          onNavigationStateChange={this.onNavigationStateChange}
          onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
          scalesPageToFit={true}
          openNewWindowInWebView={true}
          allowsBackForwardNavigationGestures={true}
          style={styles.webView}
          onLoadEnd={this.onLoadEnd}
          onLoadStart={this.onLoadStart}
          onLoadResponse={this.onLoadResponse}
          onProgress={this.onProgress}
        />
      </View>
    );
  }

  componentWillReceiveProps(nextProps) {
    // Navigate when we see targetURL change.
    if (this.props.targetURL != nextProps.targetURL &&
      nextProps.targetURL != '') {
      if (this.state.url == nextProps.targetURL) {
        this.refs[WEBVIEW_REF].reload();
      } else {
        this.setState({
          url: nextProps.targetURL,
        })
      }
    }
  }

  onShouldStartLoadWithRequest = (event) => {
    // Implement any custom loading logic here, don't forget to return!
    return true;
  };

  onLoadEnd = (event) => {
    console.log('!>> LOADEND', event.nativeEvent.url)
    this.props.loadEnd(event.nativeEvent);
    this.setState({
      url: event.nativeEvent.url,
      loading: false,
    });
  };

  onLoadStart = (event) => {
    console.log('!>> LOADSTART', event.nativeEvent.url)
    this.props.loadStart(event.nativeEvent);
    this.setState({
      url: event.nativeEvent.url,
      loading: true,
    });
  };

  onLoadResponse = (event) => {
    console.log('!>> LOADRESPONSE', event.nativeEvent.statusCode, event.nativeEvent.url)
    this.props.loadResponse(event.nativeEvent);
  };

  onProgress = (progress) => {
    this.props.loadProgress(progress);
  };
}

FullWebView.propTypes = {
  currentURL: PropTypes.string.isRequired,
  targetURL: PropTypes.string.isRequired,
  loadStart: PropTypes.func.isRequired,
  loadResponse: PropTypes.func.isRequired,
  loadEnd: PropTypes.func.isRequired,
  loadProgress: PropTypes.func.isRequired,
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: constants.BLACK,
    borderRadius: constants.BORDER_RADIUS,
    overflow: 'hidden',
  },
  webView: {
    flex: 1,
  },
});

export default connect(
  (state, props) => ({
    targetURL: state.targetURL,
    currentURL: state.currentURL,
  }),
  (dispatch) => ({
    loadStart: (navState) => dispatch(actions.loadStart(navState)),
    loadResponse: (navState) => dispatch(actions.loadResponse(navState)),
    loadEnd: (navState) => dispatch(actions.loadEnd(navState)),
    loadProgress: (progress) => dispatch(actions.loadProgress(progress)),
  })
)(FullWebView)
