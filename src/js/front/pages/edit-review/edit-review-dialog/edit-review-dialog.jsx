// @flow

import React from 'react';
import type { ComponentType } from 'react';
import type { EditStage, CriterionType, ReviewType, ReviewFormErrors } from 'common/types';
import type { SettingsType, ProductInfoType } from 'front/types';
import Grading from 'common/components/grading/grading';
import Button from 'material-ui/Button';
import Dialog, { DialogActions, DialogContent, DialogTitle, withMobileDialog } from 'material-ui/Dialog';
import EditReviewForm from '../edit-review-form/edit-review-form';
import Grid from 'material-ui/Grid';
import Check from 'material-ui-icons/Check';
import ErrorOutline from 'material-ui-icons/ErrorOutline';
import { CircularProgress } from 'material-ui/Progress';
import { fixUrl } from 'common/utils/url';
import { validateReview, hasErrors } from 'common/utils/validation';
import { isLoggedIn } from 'front/settings';
import { find, assoc } from 'ramda';
import styles from './edit-review-dialog.less';

type Grades = {
  [ number ]: number
}

type InputProps = {
  stage: EditStage,
  settings: SettingsType,
  review: ?ReviewType,
  onUpdateReview: (ReviewType)=>void,
  onSave: (ReviewType)=>void,
  onClose: ()=>void
}

type Props = InputProps & {
  fullScreen: boolean,
  width: string,
}

class EditReviewDialog extends React.PureComponent<Props> {
  render() {
    const { settings, onClose, review, fullScreen } = this.props;
    return (
      <Dialog
        fullScreen={fullScreen}
        fullWidth={true}
        maxWidth='md'
        open={!! review}
        disableBackdropClick={true}
        onClose={onClose} >
        { review ? this.renderDialog(settings.product, review) : '' }
      </Dialog>
    );
  }

  renderDialog = (product: ProductInfoType, review: ReviewType) => {
    const { onClose, onSave, settings, stage } = this.props;
    const { name } = product;
    const errors = validateReview(isLoggedIn(settings), review);
    const withErrors = hasErrors(errors);
    const saving = stage === 'saving';
    const saved = stage === 'saved' || stage === 'failed';
    const closeLabel = saved ? 'Close' : 'Cancel';
    const isNew = review.id === -1;
    const buttons = [
      <Button key="close" onClick={onClose}>
        { closeLabel }
      </Button>
    ];

    if (! saved) {
      buttons.push(
        <Button key="create" disabled={saving || withErrors} onClick={() => onSave(review)} color="accent">
          { isNew ? 'Create review' : 'Update review' }
        </Button>
      );
    }
    return (
      <div>
        <DialogTitle>Please review {name}</DialogTitle>
        <DialogContent>
          { this.renderContent(product, review, errors)}
        </DialogContent>
        <DialogActions>
          { buttons }
        </DialogActions>
      </div>
    );
  }

  renderContent = (product: ProductInfoType, review: ReviewType, errors: ReviewFormErrors) => {
    const { id, grades } = review;
    const { stage } = this.props;
    const isNew = id === -1;
    if (stage === 'saving') {
      return this.renderSaving();
    }
    if (stage === 'saved' || stage === 'failed') {
      return this.renderSaved(isNew, stage === 'saved');
    }
    const criterion = isNew ? this.getUnsetCriterion(product.criteria, grades) : null;
    if (criterion) {
      return this.renderGrading(criterion, review);
    }
    return this.renderForm(review, product, errors);
  }

  getUnsetCriterion = (criteria: Array<number>, grades: Grades): ?CriterionType => {
    const key = find(k => !grades[k], criteria);
    if (key) {
      return this.props.settings.criteria[key];
    }
    return null;
  }

  renderGrading = (criterion: CriterionType, review: ReviewType) => {
    const { settings, onUpdateReview } = this.props;
    const grades = review.grades;
    return (
      <div className={styles.single}>
        <h2>{ criterion.label }</h2>
        <Grading
          shape={settings.shape}
          size={settings.shapeSize.create}
          grade={0}
          onSetGrade={grade => onUpdateReview({ ...review, grades: assoc(criterion.id, grade, grades)})} />
      </div>
    );
  }

  renderForm = (review: ReviewType, product: ProductInfoType, errors: ReviewFormErrors) => {
    const { width, settings, onUpdateReview } = this.props;
    const smallDevice = width === 'sm' || width == 'xs';
    const image = product.image;
    const form = (
      <EditReviewForm
        product={product}
        settings={settings}
        review={review}
        onUpdateReview={onUpdateReview}
        errors={errors} />
    );
    return (smallDevice || !image) ? form : (
      <Grid container spacing={8} className={styles.minHeight}>
        <Grid item sm={4}>
          <img src={fixUrl(image)} />
        </Grid>
        <Grid item sm={8}>
          { form}
        </Grid>
      </Grid>
    );
  }

  renderSaving = () => {
    return (
      <div className={styles.single}>
        <CircularProgress size={100} />
      </div>
    );
  }

  renderSaved = (isNew: boolean, success: boolean) => {
    const Icon = success ? Check: ErrorOutline;
    const message = getSaveMessage(isNew, success);
    const color = success ? 'primary' : 'error';
    const size = 120;
    return (
      <div className={styles.single}>
        <h2>{message}</h2>
        <Icon
          style={{width: size, height: size}}
          color={color} />
      </div>
    );
  }
}

const getSaveMessage = (isNew, success) => {
  if (isNew) {
    return success ? 'Review has been created' : 'Failed to create review';
  }
  return success ? 'Review has been updated' : 'Failed to update review';
};

const makeResponsive = withMobileDialog({
  breakpoint: 'xs'
});

const Responsive: ComponentType<InputProps> = makeResponsive(EditReviewDialog);

export default Responsive;