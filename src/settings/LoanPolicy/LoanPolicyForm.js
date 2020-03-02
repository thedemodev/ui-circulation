import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useFormState } from 'react-final-form';

import {
  FormattedMessage,
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

const LoanPolicyForm = props => {
  const [state, setState] = useState({
    sections: {
      generalSection: true,
      recallsSection: true,
      holdsSection: true,
    },
  });

  const handleSectionToggle = ({ id }) => {
    setState((prevState) => {
      const sections = { ...prevState.sections };
      sections[id] = !sections[id];
      return { ...prevState, sections };
    });
  };

  const handleExpandAll = (sections) => {
    setState({ sections });
  };

  const generateScheduleOptions = () => {
    const {
      intl: {
        formatMessage,
      },
    } = props;
    const records = get(props, 'parentResources.fixedDueDateSchedules.records', []);
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

  const {
    pristine,
    submitting,
    handleSubmit,
    form: { change },
    onCancel,
  } = props;

  const { sections } = state;

  const { values } = useFormState();
  const policy = new LoanPolicy(values);
  const schedules = generateScheduleOptions();
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
                onToggle={handleExpandAll}
              />
            </Col>
          </Row>
          <Accordion
            id="generalSection"
            open={sections.generalSection}
            label={<FormattedMessage id="ui-circulation.settings.loanPolicy.generalInformation" />}
            onToggle={handleSectionToggle}
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
              accordionOnToggle={handleSectionToggle}
              change={change}
            />
          </Accordion>
        </Pane>
      </Paneset>
    </form>
  );
};

LoanPolicyForm.propTypes = {
  intl: intlShape.isRequired,
  pristine: PropTypes.bool,
  submitting: PropTypes.bool,
  parentResources: PropTypes.shape({
    fixedDueDateSchedules: PropTypes.object,
  }).isRequired,
  policy: PropTypes.object,
  initialValues: PropTypes.object,
  form: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default stripesFinalForm({
  navigationCheck: true,
  validate: validateLoanPolicy,
})(LoanPolicyForm);
