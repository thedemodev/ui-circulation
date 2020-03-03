import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import {
  find,
  sortBy,
  get,
} from 'lodash';

import {
  Accordion,
  AccordionSet,
  Checkbox,
  Col,
  Pane,
  Paneset,
  Row,
  Select,
  TextArea,
  TextField,
} from '@folio/stripes/components';
import stripesFinalForm from '@folio/stripes/final-form';

import tokens from './tokens';
import TokensList from './TokensList';
import { patronNoticeCategories } from '../../constants';
import {
  CancelButton,
  FooterPane,
  TemplateEditor,
} from '../components';

import { PatronNoticeTemplate as validatePatronNoticeTemplate } from '../Validation';

const PatronNoticeForm = props => {
  const [state, setState] = useState({
    accordions: { 'email-template': true }
  });

  const onToggleSection = ({ id }) => {
    setState((prevState) => {
      const accordions = { ...prevState.accordions };
      accordions[id] = !accordions[id];
      return { accordions };
    });
  };

  const {
    handleSubmit,
    initialValues,
    onCancel,
    pristine,
    submitting,
    intl: { formatMessage },
    form: { getFieldState },
  } = props;

  const sortedCategories = sortBy(patronNoticeCategories, ['label']);
  const categoryOptions = sortedCategories.map(({ label, id }) => ({
    label: formatMessage({ id: label }),
    value: id,
  }));

  const checkUniqueName = (name) => {
    const { okapi } = props;

    return fetch(`${okapi.url}/templates?query=(name=="${name}")`,
      {
        headers: {
          'X-Okapi-Tenant': okapi.tenant,
          'X-Okapi-Token': okapi.token,
          'Content-Type': 'application/json',
        }
      });
  };

  const validate = async (name) => {
    let error;

    if (name) {
      try {
        const response = await checkUniqueName(name);
        const notices = await response.json();
        const matchedNotice = find(notices?.templates, ['name', name]);
        if (matchedNotice && matchedNotice.id !== props.initialValues.id) {
          error = <FormattedMessage id="ui-circulation.settings.patronNotices.errors.nameExists" />;
        }
      } catch (e) {
        throw new Error(e);
      }
    }

    return error;
  };

  return (
    <form
      id="form-patron-notice"
      noValidate
      data-test-patron-notice-form
      onSubmit={handleSubmit}
    >
      <Paneset isRoot>
        <Pane
          defaultWidth="100%"
          paneTitle={initialValues.id ? initialValues.name : <FormattedMessage id="ui-circulation.settings.patronNotices.newLabel" />}
          firstMenu={
            <CancelButton
              labelKey="ui-circulation.settings.patronNotices.closeDialog"
              onCancel={onCancel}
            />
          }
          footer={
            <FooterPane
              pristine={pristine}
              submitting={submitting}
              onCancel={onCancel}
            />
          }
        >
          <Row>
            <Col
              xs={8}
              data-test-patron-notice-template-name
            >
              <Field
                label={<FormattedMessage id="ui-circulation.settings.patronNotices.notice.name" />}
                name="name"
                required
                id="input-patron-notice-name"
                component={TextField}
                validate={validate}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={3}>
              <Field
                label={<FormattedMessage id="ui-circulation.settings.patronNotices.notice.active" />}
                name="active"
                type="checkbox"
                id="input-patron-notice-active"
                component={Checkbox}
              />
            </Col>
          </Row>
          <br />
          <Row>
            <Col xs={8}>
              <Field
                label={<FormattedMessage id="ui-circulation.settings.patronNotices.notice.description" />}
                name="description"
                id="input-patron-notice-description"
                component={TextArea}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={8}>
              <div data-test-template-category>
                <Field
                  label={<FormattedMessage id="ui-circulation.settings.patronNotices.notice.category" />}
                  name="category"
                  component={Select}
                  fullWidth
                  dataOptions={categoryOptions}
                  value={initialValues.category}
                />
              </div>
            </Col>
          </Row>
          <AccordionSet accordionStatus={state.accordions} onToggle={onToggleSection}>
            <Accordion
              id="email-template"
              label={<FormattedMessage id="ui-circulation.settings.patronNotices.email" />}
            >
              <Row>
                <Col xs={8}>
                  <Field
                    id="input-patron-notice-subject"
                    component={TextField}
                    required
                    label={<FormattedMessage id="ui-circulation.settings.patronNotices.subject" />}
                    name="localizedTemplates.en.header"
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={8}>
                  <Field
                    label={<FormattedMessage id="ui-circulation.settings.patronNotices.body" />}
                    required
                    name="localizedTemplates.en.body"
                    id="input-email-template-body"
                    selectedCategory={get(getFieldState('category'), 'value', '')}
                    component={TemplateEditor}
                    tokens={tokens}
                    tokensList={TokensList}
                    previewModalHeader={<FormattedMessage id="ui-circulation.settings.patronNotices.form.previewHeader" />}
                  />
                </Col>
              </Row>
            </Accordion>
          </AccordionSet>
          { initialValues && initialValues.predefined &&
            <Row>
              <Col xs={8}>
                <FormattedMessage id="ui-circulation.settings.patronNotices.predefinedWarning" />
              </Col>
            </Row>}
        </Pane>
      </Paneset>
    </form>
  );
};

PatronNoticeForm.propTypes = {
  initialValues: PropTypes.object,
  okapi: PropTypes.object.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
  form: PropTypes.object.isRequired,
};

PatronNoticeForm.defaultProps = {
  initialValues: {},
};

export default stripesFinalForm({
  navigationCheck: true,
  validate: validatePatronNoticeTemplate,
  validateOnBlur: true,
})(injectIntl(PatronNoticeForm));
