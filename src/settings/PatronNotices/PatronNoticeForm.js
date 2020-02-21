import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';
import {
  find,
  sortBy,
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
import { useStripes } from '@folio/stripes-core';

/**
 * on-blur validation checks that the name of the patron notice
 * is unique.
 *
 * redux-form requires that the rejected Promises have the form
 * { field: "error message" }
 * hence the eslint-disable-next-line comments since ESLint is picky
 * about the format of rejected promises.
 *
 * @see https://redux-form.com/7.3.0/examples/asyncchangevalidation/
 */
function asyncValidate(values, dispatch, props) {
  if (values.name !== undefined) {
    return new Promise((resolve, reject) => {
      const uv = props.uniquenessValidator.nameUniquenessValidator;
      const query = `(name="${values.name}")`;
      uv.reset();
      uv.GET({ params: { query } }).then((notices) => {
        const matchedNotice = find(notices, ['name', values.name]);
        if (matchedNotice && matchedNotice.id !== values.id) {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject({ name: <FormattedMessage id="ui-circulation.settings.patronNotices.errors.nameExists" /> });
        } else {
          resolve();
        }
      });
    });
  }
  return new Promise(resolve => resolve());
}

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
  } = props;

  const category = initialValues && initialValues.category;
  const isActive = initialValues && initialValues.active;

  const sortedCategories = sortBy(patronNoticeCategories, ['label']);
  const categoryOptions = sortedCategories.map(({ label, id }) => ({
    labelTranslationPath: label,
    value: id,
    selected: category === id
  }));

  const validate = async name => {
    let error;
    const validator = props.uniquenessValidator.nameUniquenessValidator;
    const query = `(name="${name}")`;
    validator.reset();

    try {
      const notices = await validator.GET({ params: { query } });
      const matchedNotice = find(notices, ['name', name]);
      if (matchedNotice && matchedNotice.id !== props.initialValues.id) {
        error = <FormattedMessage id="ui-circulation.settings.patronNotices.errors.nameExists" />;
      }
    } catch (e) {
      throw new Error(e);
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
                id="input-patron-notice-active"
                component={Checkbox}
                defaultChecked={isActive}
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
                >
                  {categoryOptions.map(({ labelTranslationPath, value, selected }) => (
                    <FormattedMessage id={labelTranslationPath}>
                      {translatedLabel => (
                        <option
                          value={value}
                          selected={selected}
                        >
                          {translatedLabel}
                        </option>
                      )}
                    </FormattedMessage>
                  ))}
                </Field>
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
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  // onSave: PropTypes.func.isRequired,
  uniquenessValidator: PropTypes.object.isRequired,
};

PatronNoticeForm.defaultProps = {
  initialValues: {},
};

export default stripesFinalForm({
  // form: 'patronNoticeForm',
  navigationCheck: true,
  validate: validatePatronNoticeTemplate,
  // enableReinitialize: false,
  // asyncValidate,
  // asyncBlurFields: ['name'],
})(PatronNoticeForm);
