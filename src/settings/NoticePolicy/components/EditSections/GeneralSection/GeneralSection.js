import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Field,
  useFormState,
} from 'react-final-form';

import {
  TextArea,
  TextField,
  Checkbox,
  Accordion,
} from '@folio/stripes/components';

import { Metadata } from '../../../../components';

import styles from './GeneralSection.css';

const GeneralSection = ({ isOpen, onToggle }) => {
  const { values: policy } = useFormState();

  return (
    <div data-test-notice-policy-form-general-section>
      <Accordion
        id="general"
        open={isOpen}
        label={<FormattedMessage id="ui-circulation.settings.noticePolicy.generalInformation" />}
        onToggle={onToggle}
      >
        <Metadata metadata={policy.metadata} />
        <div data-test-general-section-policy-name>
          <Field
            id="notice_policy_name"
            name="name"
            label={<FormattedMessage id="ui-circulation.settings.noticePolicy.policyName" />}
            required
            component={TextField}
          />
        </div>
        <div data-test-general-section-active>
          <Field
            id="notice_policy_active"
            name="active"
            type="checkbox"
            className={styles.checkbox}
            label={<FormattedMessage id="ui-circulation.settings.noticePolicy.active" />}
            component={Checkbox}
          />
        </div>
        <div data-test-general-section-policy-description>
          <Field
            id="notice_policy_description"
            name="description"
            label={<FormattedMessage id="ui-circulation.settings.noticePolicy.policyDescription" />}
            component={TextArea}
          />
        </div>
      </Accordion>
    </div>
  );
};

GeneralSection.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default GeneralSection;
