import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import stripesFinalForm from '@folio/stripes/final-form';

import {
  Accordion,
  ExpandAllButton,
  Col,
  Row,
  Pane,
  Paneset,
} from '@folio/stripes/components';

import LostItemFeePolicy from '../Models/LostItemFeePolicy';

import {
  LostItemFeeAboutSection,
  LostItemFeeSection,
} from './components/EditSections';

import {
  CancelButton,
  FooterPane,
  Metadata,
} from '../components';

import { LostItemFeePolicy as validateLostItemFeePolicy } from '../Validation';

import css from './LostItemFee.css';

class LostItemFeePolicyForm extends React.Component {
  static propTypes = {
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    initialValues: PropTypes.object,
    form: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
  };;

  static defaultProps = {
    initialValues: {},
  };

  constructor(props) {
    super(props);

    this.state = {
      sections: {
        lostItemFeegeneralSection: true,
        LostItemFeeSection: true,
        lostItemFeeSectionOpen: true,
      },
    };
  }

  handleSectionToggle = ({ id }) => {
    this.setState((state) => {
      const sections = { ...state.sections };
      sections[id] = !sections[id];
      return { sections };
    });
  };

  handleExpandAll = (sections) => {
    this.setState({ sections });
  };

  render() {
    const {
      pristine,
      initialValues,
      submitting,
      handleSubmit,
      form: { change, getState },
      onCancel,
    } = this.props;

    const { sections } = this.state;

    const { values } = getState();
    const policy = new LostItemFeePolicy(values);

    const panelTitle = policy.id ? policy.name : <FormattedMessage id="ui-circulation.settings.lostItemFee.entryLabel" />;
    const footerPaneProps = {
      pristine,
      submitting,
      onCancel,
    };

    return (
      <form
        noValidate
        data-test-lost-item-fee-policy-form
        onSubmit={handleSubmit}
      >
        <Paneset isRoot>
          <Pane
            defaultWidth="100%"
            paneTitle={panelTitle}
            firstMenu={<CancelButton onCancel={onCancel} />}
            footer={<FooterPane {...footerPaneProps} />}
          >
            <>
              <Row end="xs">
                <Col
                  data-test-expand-all
                  xs
                >
                  <ExpandAllButton
                    accordionStatus={sections}
                    onToggle={this.handleExpandAll}
                  />
                </Col>
              </Row>
              <Accordion
                id="lostItemFeegeneralSection"
                label={<FormattedMessage id="ui-circulation.settings.lostItemFee.generalInformation" />}
                open={sections.lostItemFeegeneralSection}
                onToggle={this.handleSectionToggle}
              >
                <Metadata metadata={policy.metadata} />
                <LostItemFeeAboutSection />
                <LostItemFeeSection
                  policy={policy}
                  change={change}
                  initialValues={initialValues}
                  lostItemFeeSectionOpen={sections.lostItemFeeSectionOpen}
                  accordionOnToggle={this.handleSectionToggle}
                />
              </Accordion>
            </>
          </Pane>
        </Paneset>
      </form>
    );
  }
}

export default stripesFinalForm({
  navigationCheck: true,
  validate: validateLostItemFeePolicy,
})(LostItemFeePolicyForm);
