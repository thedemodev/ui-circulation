import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useFormState } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { values } from 'lodash';
import { Accordion } from '@folio/stripes/components';

import NoticesList from '../components';
import { NoticePolicy } from '../../../../Models/NoticePolicy';
import {
  loanNoticesTriggeringEvents,
  loanTimeBasedEventsIds,
} from '../../../../../constants';

const LoanNoticesSection = props => {
  const {
    isOpen,
    templates,
    onToggle,
  } = props;

  const { values: policy } = useFormState();
  const noticePolicy = new NoticePolicy(policy);

  return (
    <div data-test-notice-policy-form-loan-notices-section>
      <Accordion
        id="loanNotices"
        open={isOpen}
        label={<FormattedMessage id="ui-circulation.settings.noticePolicy.loanNotices" />}
        onToggle={onToggle}
      >
        <FieldArray
          name="loanNotices"
          sectionKey="loanNotices"
          component={NoticesList}
          policy={noticePolicy}
          templates={templates}
          triggeringEvents={loanNoticesTriggeringEvents}
          timeBasedEventsIds={values(loanTimeBasedEventsIds)}
        />
      </Accordion>
    </div>
  );
};

LoanNoticesSection.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  templates: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  })).isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default LoanNoticesSection;
