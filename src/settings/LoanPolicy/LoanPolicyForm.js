import React from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  injectIntl,
  intlShape,
} from 'react-intl';
import {
  get,
  sortBy,
} from 'lodash';

import stripesFinalForm from '@folio/stripes/final-form';

import {
  Accordion,
  ExpandAllButton,
  Col,
  Row,
  Pane,
  Paneset,
} from '@folio/stripes/components';

import LoanPolicy from '../Models/LoanPolicy';
import { LoanPolicy as validateLoanPolicy } from '../Validation';

import {
  AboutSection,
  LoansSection,
  RenewalsSection,
  RequestManagementSection,
} from './components/EditSections';

import {
  CancelButton,
  FooterPane,
  Metadata,
} from '../components';

class LoanPolicyForm extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    parentResources: PropTypes.shape({
      fixedDueDateSchedules: PropTypes.object,
    }).isRequired,
    form: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      sections: {
        generalSection: true,
        recallsSection: true,
        holdsSection: true,
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

  generateScheduleOptions = () => {
    const { intl: { formatMessage } } = this.props;
    const records = get(this.props, 'parentResources.fixedDueDateSchedules.records', []);
    const sortedSchedules = sortBy(records, ['name']);

    const placeholder = (
      <option value="" key="x">
        {formatMessage({ id: 'ui-circulation.settings.loanPolicy.selectSchedule' })}
      </option>
    );

    const schedules = sortedSchedules.map(({ id, name }) => {
      return (
        <option
          value={id}
          key={id}
        >
          {name}
        </option>
      );
    });

    return [placeholder, ...schedules];
  };

  render() {
    const {
      pristine,
      submitting,
      handleSubmit,
      form: {
        change,
        getState,
      },
      onCancel,
    } = this.props;

    const { sections } = this.state;

    const { values } = getState();
    const policy = new LoanPolicy(values);
    const schedules = this.generateScheduleOptions();
    const panelTitle = policy.id ? policy.name : <FormattedMessage id="ui-circulation.settings.loanPolicy.createEntryLabel" />;
    const footerPaneProps = {
      pristine,
      submitting,
      onCancel,
    };

    return (
      <form
        noValidate
        data-test-loan-policy-form
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
            <Accordion
              id="generalSection"
              open={sections.generalSection}
              label={<FormattedMessage id="ui-circulation.settings.loanPolicy.generalInformation" />}
              onToggle={this.handleSectionToggle}
            >
              <Metadata metadata={policy.metadata} />
              <AboutSection />
              <LoansSection
                policy={policy}
                schedules={schedules}
                change={change}
              />
              <RenewalsSection
                policy={policy}
                schedules={schedules}
                change={change}
              />
              <RequestManagementSection
                policy={policy}
                holdsSectionOpen={sections.holdsSection}
                recallsSectionOpen={sections.recallsSection}
                accordionOnToggle={this.handleSectionToggle}
                change={change}
              />
            </Accordion>
          </Pane>
        </Paneset>
      </form>
    );
  }
}

export default stripesFinalForm({
  navigationCheck: true,
  validate: validateLoanPolicy,
})(injectIntl(LoanPolicyForm));
