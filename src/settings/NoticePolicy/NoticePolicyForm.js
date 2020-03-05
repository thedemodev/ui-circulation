/* import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';
import { useFormState } from 'react-final-form';

import stripesFinalForm from '@folio/stripes/final-form';
import {
  Col,
  Row,
  Pane,
  Paneset,
  ExpandAllButton,
} from '@folio/stripes/components';

import getTemplates from './utils/get-templates';
import {
  FooterPane,
  CancelButton,
} from '../components';
import {
  GeneralSection,
  LoanNoticesSection,
  FeeFineNoticesSection,
  RequestNoticesSection,
} from './components';

import { NoticePolicy as validateNoticePolicy } from '../Validation';

const NoticePolicyForm = props => {
  const [state, setState] = useState({
    sections: {
      general: true,
      loanNotices: true,
      requestNotices: true,
      feeFineNotices: false,
    }
  });

  const { values: policy } = useFormState();

  const handleSectionToggle = ({ id }) => {
    setState((prevState) => {
      const sections = { ...prevState.sections };
      sections[id] = !sections[id];
      return { sections };
    });
  };

  const handleExpandAll = (sections) => {
    setState({ sections });
  };

  const {
    pristine,
    submitting,
    handleSubmit,
    onCancel,
  } = props;

  const patronNoticeTemplates = get(props, 'parentResources.templates.records', []);
  const panelTitle = policy.id
    ? policy.name
    : <FormattedMessage id="ui-circulation.settings.noticePolicy.createEntryLabel" />;

  const footerPaneProps = {
    pristine,
    submitting,
    onCancel,
  };

  const { sections } = state;

  return (
    <form
      data-test-notice-policy-form
      noValidate
      onSubmit={handleSubmit}
    >
      <Paneset isRoot>
        <Pane
          defaultWidth="100%"
          paneTitle={panelTitle}
          firstMenu={<CancelButton onCancel={onCancel} />}
          footer={<FooterPane {...footerPaneProps} />}
        >
          <Row end="xs">
            <Col
              data-test-expand-all
              xs
            >
              <ExpandAllButton
                accordionStatus={sections}
                onToggle={handleExpandAll}
              />
            </Col>
          </Row>
          <GeneralSection
            isOpen={sections.general}
            onToggle={handleSectionToggle}
          />
          <LoanNoticesSection
            isOpen={sections.loanNotices}
            policy={policy}
            templates={getTemplates(patronNoticeTemplates, 'Loan')}
            onToggle={handleSectionToggle}
          />
          <RequestNoticesSection
            isOpen={sections.requestNotices}
            policy={policy}
            templates={getTemplates(patronNoticeTemplates, 'Request')}
            onToggle={handleSectionToggle}
          />
          <FeeFineNoticesSection
            isOpen={sections.feeFineNotices}
            onToggle={handleSectionToggle}
          />
        </Pane>
      </Paneset>
    </form>
  );
};

NoticePolicyForm.propTypes = {
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  parentResources: PropTypes.shape({
    templates: PropTypes.object,
  }).isRequired,
  onCancel: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default stripesFinalForm({
  navigationCheck: true,
  validate: validateNoticePolicy,
})(NoticePolicyForm);
*/

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';

import stripesFinalForm from '@folio/stripes/final-form';
import {
  Col,
  Row,
  Pane,
  Paneset,
  ExpandAllButton,
} from '@folio/stripes/components';

import getTemplates from './utils/get-templates';
import { NoticePolicy } from '../Models/NoticePolicy';
import { NoticePolicy as validateNoticePolicy } from '../Validation';
import {
  FooterPane,
  CancelButton,
} from '../components';
import {
  GeneralSection,
  LoanNoticesSection,
  FeeFineNoticesSection,
  RequestNoticesSection,
} from './components';

class NoticePolicyForm extends React.Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    pristine: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
    parentResources: PropTypes.shape({
      templates: PropTypes.object,
    }).isRequired,
    onCancel: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      sections: {
        general: true,
        loanNotices: true,
        requestNotices: true,
        feeFineNotices: false,
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
      submitting,
      form: { getState },
      handleSubmit,
      onCancel,
    } = this.props;

    const { sections } = this.state;
    const { values } = getState();
    const policy = new NoticePolicy(values);

    const patronNoticeTemplates = get(this.props, 'parentResources.templates.records', []);
    const panelTitle = policy.id
      ? policy.name
      : <FormattedMessage id="ui-circulation.settings.noticePolicy.createEntryLabel" />;

    const footerPaneProps = {
      pristine,
      submitting,
      onCancel,
    };

    return (
      <form
        data-test-notice-policy-form
        noValidate
        onSubmit={handleSubmit}
      >
        <Paneset isRoot>
          <Pane
            defaultWidth="100%"
            paneTitle={panelTitle}
            firstMenu={<CancelButton onCancel={onCancel} />}
            footer={<FooterPane {...footerPaneProps} />}
          >
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
            <GeneralSection
              isOpen={sections.general}
              metadata={policy.metadata}
              onToggle={this.handleSectionToggle}
            />
            <LoanNoticesSection
              isOpen={sections.loanNotices}
              policy={policy}
              templates={getTemplates(patronNoticeTemplates, 'Loan')}
              onToggle={this.handleSectionToggle}
            />
            <RequestNoticesSection
              isOpen={sections.requestNotices}
              policy={policy}
              templates={getTemplates(patronNoticeTemplates, 'Request')}
              onToggle={this.handleSectionToggle}
            />
            <FeeFineNoticesSection
              isOpen={sections.feeFineNotices}
              onToggle={this.handleSectionToggle}
            />
          </Pane>
        </Paneset>
      </form>
    );
  }
}

export default stripesFinalForm({
  navigationCheck: true,
  validate: validateNoticePolicy,
})(NoticePolicyForm);
