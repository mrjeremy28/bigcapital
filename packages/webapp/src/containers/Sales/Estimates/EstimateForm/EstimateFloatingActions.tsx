// @ts-nocheck
import React from 'react';
import {
  Intent,
  Button,
  ButtonGroup,
  Popover,
  PopoverInteractionKind,
  Position,
  Menu,
  MenuItem,
} from '@blueprintjs/core';
import { If, Icon, FormattedMessage as T, Group, FSelect } from '@/components';
import { useHistory } from 'react-router-dom';
import { useFormikContext } from 'formik';
import { useEstimateFormContext } from './EstimateFormProvider';
import { useEstimateFormBrandingTemplatesOptions } from './utils';
import { useDrawerActions } from '@/hooks/state';
import {
  BrandingThemeFormGroup,
  BrandingThemeSelectButton,
} from '@/containers/BrandingTemplates/BrandingTemplatesSelectFields';
import { PageForm } from '@/components/PageForm';
import { MoreIcon } from '@/icons/More';
import { DRAWERS } from '@/constants/drawers';

/**
 * Estimate floating actions bar.
 */
export default function EstimateFloatingActions() {
  const history = useHistory();
  const { openDrawer } = useDrawerActions();
  const { resetForm, submitForm, isSubmitting } = useFormikContext();

  // Estimate form context.
  const { estimate, setSubmitPayload } = useEstimateFormContext();

  // Handle submit & deliver button click.
  const handleSubmitDeliverBtnClick = (event) => {
    setSubmitPayload({ redirect: true, deliver: true });
    submitForm();
  };

  // Handle submit, deliver & new button click.
  const handleSubmitDeliverAndNewBtnClick = (event) => {
    setSubmitPayload({ redirect: false, deliver: true, resetForm: true });
    submitForm();
  };

  // Handle submit, deliver & continue editing button click.
  const handleSubmitDeliverContinueEditingBtnClick = (event) => {
    setSubmitPayload({ redirect: false, deliver: true });
    submitForm();
  };

  // Handle submit as draft button click.
  const handleSubmitDraftBtnClick = (event) => {
    setSubmitPayload({ redirect: true, deliver: false });
    submitForm();
  };

  // Handle submit as draft & new button click.
  const handleSubmitDraftAndNewBtnClick = (event) => {
    setSubmitPayload({ redirect: false, deliver: false, resetForm: true });
    submitForm();
  };

  // Handle submit as draft & continue editing button click.
  const handleSubmitDraftContinueEditingBtnClick = (event) => {
    setSubmitPayload({ redirect: false, deliver: false });
    submitForm();
  };

  // Handle the cancel button click.
  const handleCancelBtnClick = (event) => {
    history.goBack();
  };

  // Handle the clear button click.
  const handleClearBtnClick = (event) => {
    resetForm();
  };

  // Handles the invoice customize button click.
  const handleCustomizeBtnClick = () => {
    openDrawer(DRAWERS.BRANDING_TEMPLATES, { resource: 'SaleEstimate' });
  };

  const brandingTemplatesOptions = useEstimateFormBrandingTemplatesOptions();

  return (
    <PageForm.FooterActions position={'apart'} spacing={10}>
      <Group spacing={10}>
        {/* ----------- Save And Deliver ----------- */}
        <If condition={!estimate || !estimate?.is_delivered}>
          <ButtonGroup>
            <Button
              disabled={isSubmitting}
              loading={isSubmitting}
              intent={Intent.PRIMARY}
              onClick={handleSubmitDeliverBtnClick}
              text={<T id={'save_and_deliver'} />}
            />
            <Popover
              content={
                <Menu>
                  <MenuItem
                    text={<T id={'deliver_and_new'} />}
                    onClick={handleSubmitDeliverAndNewBtnClick}
                  />
                  <MenuItem
                    text={<T id={'deliver_continue_editing'} />}
                    onClick={handleSubmitDeliverContinueEditingBtnClick}
                  />
                </Menu>
              }
              minimal={true}
              interactionKind={PopoverInteractionKind.CLICK}
              position={Position.BOTTOM_LEFT}
            >
              <Button
                disabled={isSubmitting}
                intent={Intent.PRIMARY}
                rightIcon={<Icon icon="arrow-drop-up-16" iconSize={20} />}
              />
            </Popover>
          </ButtonGroup>

          {/* ----------- Save As Draft ----------- */}
          <ButtonGroup>
            <Button
              disabled={isSubmitting}
              className={'ml1'}
              onClick={handleSubmitDraftBtnClick}
              text={<T id={'save_as_draft'} />}
            />
            <Popover
              content={
                <Menu>
                  <MenuItem
                    text={<T id={'save_and_new'} />}
                    onClick={handleSubmitDraftAndNewBtnClick}
                  />
                  <MenuItem
                    text={<T id={'save_continue_editing'} />}
                    onClick={handleSubmitDraftContinueEditingBtnClick}
                  />
                </Menu>
              }
              minimal={true}
              interactionKind={PopoverInteractionKind.CLICK}
              position={Position.BOTTOM_LEFT}
            >
              <Button
                disabled={isSubmitting}
                rightIcon={<Icon icon="arrow-drop-up-16" iconSize={20} />}
              />
            </Popover>
          </ButtonGroup>
        </If>

        {/* ----------- Save and New ----------- */}
        <If condition={estimate && estimate?.is_delivered}>
          <ButtonGroup>
            <Button
              disabled={isSubmitting}
              intent={Intent.PRIMARY}
              onClick={handleSubmitDeliverBtnClick}
              style={{ minWidth: '85px' }}
              text={<T id={'save'} />}
            />
            <Popover
              content={
                <Menu>
                  <MenuItem
                    text={<T id={'save_and_new'} />}
                    onClick={handleSubmitDeliverAndNewBtnClick}
                  />
                </Menu>
              }
              minimal={true}
              interactionKind={PopoverInteractionKind.CLICK}
              position={Position.BOTTOM_LEFT}
            >
              <Button
                disabled={isSubmitting}
                intent={Intent.PRIMARY}
                rightIcon={<Icon icon="arrow-drop-up-16" iconSize={20} />}
              />
            </Popover>
          </ButtonGroup>
        </If>

        {/* ----------- Clear & Reset----------- */}
        <Button
          className={'ml1'}
          disabled={isSubmitting}
          onClick={handleClearBtnClick}
          text={estimate ? <T id={'reset'} /> : <T id={'clear'} />}
        />

        {/* ----------- Cancel ----------- */}
        <Button
          className={'ml1'}
          disabled={isSubmitting}
          onClick={handleCancelBtnClick}
          text={<T id={'cancel'} />}
        />
      </Group>

      <Group spacing={0}>
        {/* ----------- Branding Template Select ----------- */}
        <BrandingThemeFormGroup
          name={'pdf_template_id'}
          label={'Branding'}
          inline
          fastField
          style={{ marginLeft: 20 }}
        >
          <FSelect
            name={'pdf_template_id'}
            items={brandingTemplatesOptions}
            input={({ activeItem, text, label, value }) => (
              <BrandingThemeSelectButton text={text || 'Brand Theme'} minimal />
            )}
            filterable={false}
            popoverProps={{ minimal: true }}
          />
        </BrandingThemeFormGroup>

        {/* ----------- More Select ----------- */}
        <Popover
          minimal={true}
          interactionKind={PopoverInteractionKind.CLICK}
          position={Position.TOP_RIGHT}
          modifiers={{
            offset: { offset: '0, 4' },
          }}
          content={
            <Menu>
              <MenuItem
                text={'Customize Templates'}
                onClick={handleCustomizeBtnClick}
              />
            </Menu>
          }
        >
          <Button minimal icon={<MoreIcon height={'14px'} width={'14px'} />} />
        </Popover>
      </Group>
    </PageForm.FooterActions>
  );
}
