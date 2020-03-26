import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { isInteger } from 'lodash';
import { ARRAY_ERROR } from 'final-form';

import stripesFinalForm from '@folio/stripes/final-form';
import {
  Button,
  Checkbox,
  Col,
  Pane,
  Row,
  Select,
  TextField,
  Label,
  PaneFooter,
} from '@folio/stripes/components';

import { patronIdentifierTypes } from '../constants';

import css from './CheckoutSettingsForm.css';

class CheckoutSettingsForm extends Component {
  renderFooter = () => {
    const {
      pristine,
      submitting,
    } = this.props;

    return (
      <PaneFooter
        renderEnd={(
          <Button
            id="clickable-savescanid"
            type="submit"
            buttonStyle="primary paneHeaderNewButton"
            disabled={pristine || submitting}
            marginBottom0
          >
            <FormattedMessage id="ui-circulation.settings.checkout.save" />
          </Button>
        )}
      />
    );
  }

  renderList = ({ fields, meta }) => {
    const items = patronIdentifierTypes.map((iden, index) => (
      <Row key={`row-${index}`}>
        <Col xs={12}>
          <Field
            component={Checkbox}
            type="checkbox"
            id={`${iden.queryKey}-checkbox`}
            data-checked={fields.value[index]}
            label={iden.label}
            name={`idents[${index}]`}
          />
        </Col>
      </Row>
    ));

    return (
      <div>
        <p>
          <Label required>
            <FormattedMessage id="ui-circulation.settings.checkout.patronIds" />
          </Label>
        </p>
        {items}
        {meta.error && <div className={css.error}>{meta.error}</div>}
      </div>
    );
  }

  render() {
    const {
      handleSubmit,
      label,
      form: { getState },
    } = this.props;

    const { values: checkoutValues } = getState();

    return (
      <form
        id="checkout-form"
        className={css.checkoutForm}
        onSubmit={handleSubmit}
      >
        <Pane
          defaultWidth="fill"
          fluidContentWidth
          paneTitle={label}
          footer={this.renderFooter()}
        >
          <FieldArray
            name="idents"
            component={this.renderList}
          />
          <br />
          <Row>
            <Col xs={12}>
              <Field
                label={<FormattedMessage id="ui-circulation.settings.checkout.timeout" />}
                id="checkoutTimeout"
                name="checkoutTimeout"
                component={Checkbox}
                type="checkbox"
              />
            </Col>

          </Row>
          { checkoutValues.checkoutTimeout &&
            <Row>
              <div className={css.indentSection}>
                <Col xs={5}>
                  <Field
                    id="checkoutTimeoutDuration"
                    name="checkoutTimeoutDuration"
                    component={TextField}
                  />
                </Col>
                <Col xs={7}>
                  <FormattedMessage id="ui-circulation.settings.checkout.minutes" />
                </Col>
              </div>
            </Row>}
          <br />
          <Row>
            <Col xs={12}>
              <Field
                label={<FormattedMessage id="ui-circulation.settings.checkout.audioAlerts" />}
                name="audioAlertsEnabled"
                component={Select}
              >
                <FormattedMessage id="ui-circulation.settings.checkout.no">
                  {(message) => <option value="false">{message}</option>}
                </FormattedMessage>
                <FormattedMessage id="ui-circulation.settings.checkout.yes">
                  {(message) => <option value="true">{message}</option>}
                </FormattedMessage>
              </Field>
            </Col>
          </Row>
        </Pane>
      </form>
    );
  }
}

CheckoutSettingsForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool,
  submitting: PropTypes.bool,
  label: PropTypes.node,
  form: PropTypes.object.isRequired,
};

function validate(values) {
  const errors = {};

  const isValid = values.idents && values.idents.reduce((valid, v) => (valid || v), false);
  if (!isValid) {
    errors.idents = [];
    errors.idents[ARRAY_ERROR] = <FormattedMessage id="ui-circulation.settings.checkout.validate.selectContinue" />;
  }

  const checkoutTimeoutDuration = (isInteger(+values.checkoutTimeoutDuration) && (+values.checkoutTimeoutDuration > 0));
  if (!checkoutTimeoutDuration) {
    errors.checkoutTimeoutDuration = <FormattedMessage id="ui-circulation.settings.checkout.validate.timeoutDuration" />;
  }

  return errors;
}

export default stripesFinalForm({
  navigationCheck: true,
  validate,
})(CheckoutSettingsForm);
