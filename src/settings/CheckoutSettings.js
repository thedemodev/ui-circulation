import React from 'react';
import _ from 'lodash';
import { FormattedMessage } from 'react-intl';
import { stripesShape, withStripes } from '@folio/stripes/core';
import { ConfigManager } from '@folio/stripes/smart-components';

import { patronIdentifierTypes } from '../constants';
import CheckoutSettingsForm from './CheckoutSettingsForm';

class CheckoutSettings extends React.Component {
  static propTypes = {
    stripes: stripesShape.isRequired,
  };

  constructor(props) {
    super(props);
    this.configManager = props.stripes.connect(ConfigManager);
  }

  // eslint-disable-next-line class-methods-use-this
  getInitialValues(settings) {
    const value = settings.length === 0 ? '' : settings[0].value;
    const defaultConfig = { prefPatronIdentifier: '',
      audioAlertsEnabled: false,
      checkoutTimeout: true,
      checkoutTimeoutDuration: 3 };
    let config;

    try {
      config = { ...defaultConfig, ...JSON.parse(value) };
    } catch (e) {
      config = defaultConfig;
    }
    const { audioAlertsEnabled, prefPatronIdentifier, checkoutTimeout, checkoutTimeoutDuration } = config;
    const values = (prefPatronIdentifier) ? prefPatronIdentifier.split(',') : [];
    const idents = patronIdentifierTypes.map(i => (values.indexOf(i.key) >= 0));

    return { idents, audioAlertsEnabled, checkoutTimeout, checkoutTimeoutDuration };
  }

  normalize = (data) => {
    const {
      idents,
      audioAlertsEnabled,
      checkoutTimeout,
      checkoutTimeoutDuration,
    } = data;

    const values = idents.reduce((vals, ident, index) => {
      if (ident) vals.push(patronIdentifierTypes[index].key);
      return vals;
    }, []);

    const otherSettings = JSON.stringify({
      audioAlertsEnabled: audioAlertsEnabled === 'true',
      prefPatronIdentifier: values.join(','),
      checkoutTimeout,
      checkoutTimeoutDuration,
    });

    return otherSettings;
  };

  render() {
    return (
      <this.configManager
        label={<FormattedMessage id="ui-circulation.settings.index.otherSettings" />}
        moduleName="CHECKOUT"
        configName="other_settings"
        getInitialValues={this.getInitialValues}
        configFormComponent={CheckoutSettingsForm}
        stripes={this.props.stripes}
        onBeforeSave={this.normalize}
      />
    );
  }
}

export default withStripes(CheckoutSettings);
