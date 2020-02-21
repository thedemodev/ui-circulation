import React from 'react';
import PropTypes from 'prop-types';
import { isUndefined } from 'lodash';

import { ViewMetaData } from '@folio/stripes/smart-components';
import {
  Col,
  Row,
} from '@folio/stripes/components';

import {
  stripesConnect,
  stripesShape,
} from '@folio/stripes-core';

class Metadata extends React.Component {
  static propTypes = {
    stripes: stripesShape.isRequired,
    metadata: PropTypes.object,
  };

  static defaultProps = {
    metadata: {},
  };

  constructor(props) {
    super(props);

    this.cViewMetaData = props.stripes.connect(ViewMetaData);
  }

  render() {
    const { metadata } = this.props;

    if (isUndefined(metadata) || isUndefined(metadata.createdDate)) {
      return null;
    }

    return (
      <Row>
        <Col xs={12}>
          <this.cViewMetaData metadata={metadata} />
        </Col>
      </Row>
    );
  }
}

export default stripesConnect(Metadata);
