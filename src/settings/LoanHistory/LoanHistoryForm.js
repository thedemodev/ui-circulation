import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  injectIntl,
  FormattedMessage,
} from 'react-intl';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';

import stripesFinalForm from '@folio/stripes/final-form';
import { stripesShape } from '@folio/stripes/core';
import {
  Button,
  Checkbox,
  Col,
  Pane,
  Row,
  Headline,
  PaneFooter,
} from '@folio/stripes/components';

import AnonymizingTypeSelectContainer from '../components/AnonymizingTypeSelect/AnonymizingTypeSelectContainer';
import ExceptionsList from './ExceptionsList';
import {
  closingTypes,
  closedLoansRules,
} from '../../constants';
import { normalize } from './utils/normalize';

import css from './LoanHistoryForm.css';

class LoanHistoryForm extends Component {
  static propTypes = {
    // dispatch: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    // onSubmit: PropTypes.func.isRequired,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    // stripes: stripesShape.isRequired,
    form: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    // eslint-disable-next-line react/no-unused-state
    this.state = { checked: false };
  }

  /* onSave = data => {
    const {
      dispatch,
      onSubmit,
    } = this.props;

    const normalizedData = normalize({ data, dispatch });

    onSubmit({ loan_history: JSON.stringify(normalizedData) });
  }; */

  renderFooter = () => {
    const {
      pristine,
      submitting,
    } = this.props;

    return (
      <PaneFooter
        renderEnd={(
          <Button
            data-test-loan-history-save-button
            type="submit"
            buttonStyle="primary paneHeaderNewButton"
            disabled={pristine || submitting}
            marginBottom0
          >
            <FormattedMessage id="stripes-core.button.save" />
          </Button>
        )}
      />
    );
  }

  // Due to the issue https://github.com/erikras/redux-form/issues/4101
  // the multiple actions should be dispatched instead of single one ('clearFields')
  toggleCheckbox = () => {
    const { form: { change } } = this.props;

    change('closingType.feeFine', null);
    change('closingType.loanExceptions', []);
    change('feeFine', {});
    // dispatch(arrayRemoveAll('loanHistoryForm', 'loanExceptions'));

    this.setState(({ checked }) => ({
      // eslint-disable-next-line react/no-unused-state
      checked: !checked
    }));
  }

  render() {
    const {
      handleSubmit,
      label,
      form: { getState }
    } = this.props;

    const { values: loanHistoryValues } = getState();

    return (
      <form
        id="loan-history-form"
        className={css.loanHistoryForm}
        onSubmit={handleSubmit}
      >
        <Pane
          defaultWidth="fill"
          fluidContentWidth
          paneTitle={label}
          footer={this.renderFooter()}
        >
          <div data-test-closed-loans>
            <Headline
              size="large"
              margin="xx-large"
              tag="h5"
            >
              <FormattedMessage id="ui-circulation.settings.loanHistory.closedLoans" />
            </Headline>
            <FormattedMessage
              tagName="p"
              id="ui-circulation.settings.loanHistory.anonymize"
            />
            <AnonymizingTypeSelectContainer
              name={closedLoansRules.DEFAULT}
              path={closedLoansRules.DEFAULT}
              types={closingTypes}
            />
          </div>
          <br />
          <Row>
            <Col xs={12}>
              <Field
                label={<FormattedMessage id="ui-circulation.settings.loanHistory.treat" />}
                id="treatEnabled-checkbox"
                name="treatEnabled"
                component={Checkbox}
                type="checkbox"
                // onChange={this.toggleCheckbox}
              />
            </Col>
          </Row>
          <br />
          {loanHistoryValues.treatEnabled &&
            <div data-test-closed-loans-feefine>
              <Headline
                size="large"
                margin="xx-large"
                tag="h5"
              >
                <FormattedMessage id="ui-circulation.settings.loanHistory.closedLoansFeesFines" />
              </Headline>
              <FormattedMessage
                tagName="p"
                id="ui-circulation.settings.loanHistory.anonymizeFeesFines"
              />
              <AnonymizingTypeSelectContainer
                name={closedLoansRules.WITH_FEES_FINES}
                path={closedLoansRules.WITH_FEES_FINES}
                types={closingTypes}
              />
              <FieldArray
                name="loanExceptions"
                component={ExceptionsList}
              />
            </div>}
        </Pane>
      </form>
    );
  }
}

export default injectIntl(
  stripesFinalForm({
    navigationCheck: true,
    keepDirtyOnReinitialize: true,
  })(LoanHistoryForm)
);
