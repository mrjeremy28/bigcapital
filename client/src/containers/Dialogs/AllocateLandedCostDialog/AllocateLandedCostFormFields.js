import React from 'react';
import { FastField, ErrorMessage } from 'formik';
import {
  Classes,
  FormGroup,
  RadioGroup,
  Radio,
  InputGroup,
  Position,
} from '@blueprintjs/core';
import { DateInput } from '@blueprintjs/datetime';
import classNames from 'classnames';
import { FormattedMessage as T } from 'components';
import intl from 'react-intl-universal';
import {
  inputIntent,
  momentFormatter,
  tansformDateValue,
  handleDateChange,
  handleStringChange,
} from 'utils';
import { FieldRequiredHint, ListSelect } from 'components';
import { CLASSES } from 'common/classes';
import allocateLandedCostType from 'common/allocateLandedCostType';
import AccountsSuggestField from 'components/AccountsSuggestField';
import AllocateLandedCostFormBody from './AllocateLandedCostFormBody';

/**
 * Allocate landed cost form fields.
 */
export default function AllocateLandedCostFormFields() {
  return (
    <div className={Classes.DIALOG_BODY}>
      {/*------------Transaction type -----------*/}
      <FastField name={'transaction_type'}>
        {({
          form: { values, setFieldValue },
          field: { value },
          meta: { error, touched },
        }) => (
          <FormGroup
            label={<T id={'transaction_type'} />}
            labelInfo={<FieldRequiredHint />}
            helperText={<ErrorMessage name="transaction_type" />}
            intent={inputIntent({ error, touched })}
            inline={true}
            className={classNames(CLASSES.FILL, 'form-group--transaction_type')}
          >
            <ListSelect
              items={allocateLandedCostType}
              onItemSelect={(type) => {
                setFieldValue('transaction_type', type.value);
              }}
              filterable={false}
              selectedItem={value}
              selectedItemProp={'value'}
              textProp={'name'}
              popoverProps={{ minimal: true }}
            />
          </FormGroup>
        )}
      </FastField>

      {/*------------Transaction date -----------*/}
      <FastField name={'transaction_date'}>
        {({ form, field: { value }, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'transaction_date'} />}
            // labelInfo={<FieldRequiredHint />}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name="transaction_date" />}
            minimal={true}
            className={classNames(CLASSES.FILL, 'form-group--transaction_date')}
            inline={true}
          >
            <DateInput
              {...momentFormatter('YYYY/MM/DD')}
              onChange={handleDateChange((formattedDate) => {
                form.setFieldValue('transaction_date', formattedDate);
              })}
              value={tansformDateValue(value)}
              popoverProps={{
                position: Position.BOTTOM,
                minimal: true,
              }}
            />
          </FormGroup>
        )}
      </FastField>
      {/*------------ Transaction  -----------*/}
      <FastField name={'transaction_id'}>
        {({ form, field, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'transaction_id'} />}
            // labelInfo={<FieldRequiredHint />}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name="transaction_id" />}
            className={'form-group--transaction_id'}
            inline={true}
          >
            <AccountsSuggestField
              accounts={[]}
              onAccountSelected={({ id }) =>
                form.setFieldValue('transaction_id', id)
              }
              inputProps={{
                placeholder: intl.get('select_transaction'),
              }}
            />
          </FormGroup>
        )}
      </FastField>
      {/*------------ Transaction line  -----------*/}
      <FastField name={'transaction_entry_id'}>
        {({ form, field, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'transaction_line'} />}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name="transaction_entry_id" />}
            className={'form-group--transaction_entry_id'}
            inline={true}
          >
            <InputGroup {...field} />
          </FormGroup>
        )}
      </FastField>
      {/*------------ Amount -----------*/}
      <FastField name={'amount'}>
        {({ form, field, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'amount'} />}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name="amount" />}
            className={'form-group--amount'}
            inline={true}
          >
            <InputGroup {...field} />
          </FormGroup>
        )}
      </FastField>
      {/*------------ Allocation method -----------*/}
      <FastField name={'allocation_method'}>
        {({ form, field: { value }, meta: { touched, error } }) => (
          <FormGroup
            medium={true}
            label={<T id={'allocation_method'} />}
            labelInfo={<FieldRequiredHint />}
            className={'form-group--allocation_method'}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name="allocation_method" />}
            inline={true}
          >
            <RadioGroup
              onChange={handleStringChange((_value) => {
                form.setFieldValue('allocation_method', _value);
              })}
              selectedValue={value}
              inline={true}
            >
              <Radio label={<T id={'quantity'} />} value="quantity" />
              <Radio label={<T id={'valuation'} />} value="valuation" />
            </RadioGroup>
          </FormGroup>
        )}
      </FastField>

      {/*------------ Allocate Landed cost Table -----------*/}
      <AllocateLandedCostFormBody />
    </div>
  );
}
