import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useFormState } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { values } from 'lodash';
import { Accordion } from '@folio/stripes/components';

import NoticesList from '../components';
import {
  requestNoticesTriggeringEvents,
  requestTimeBasedEventsIds,
} from '../../../../../constants';

import { NoticePolicy } from '../../../../Models/NoticePolicy';

const RequestNoticesSection = props => {
  const {
    isOpen,
    templates,
    onToggle,
  } = props;

  const { values: policy } = useFormState();
  const noticePolicy = new NoticePolicy(policy);

  return (
    <div data-test-notice-policy-form-request-notices-section>
      <Accordion
        id="requestNotices"
        open={isOpen}
        label={<FormattedMessage id="ui-circulation.settings.noticePolicy.requestNotices" />}
        onToggle={onToggle}
      >
        <FieldArray
          name="requestNotices"
          sectionKey="requestNotices"
          component={NoticesList}
          policy={noticePolicy}
          templates={templates}
          triggeringEvents={requestNoticesTriggeringEvents}
          timeBasedEventsIds={values(requestTimeBasedEventsIds)}
        />
      </Accordion>
    </div>
  );
};

RequestNoticesSection.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  templates: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  })).isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default RequestNoticesSection;
