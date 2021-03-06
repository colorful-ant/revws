// @flow

import type { Api } from 'common/types';
import type { DeleteReviewAction } from 'front/actions';
import { setSnackbar } from 'front/actions/creators';

export const deleteReview = (action: DeleteReviewAction, store: any, api: Api) => {
  api('delete', { id: action.review.id }).then(result => {
    if (result.type === 'success') {
      store.dispatch(setSnackbar(__('Review deleted')));
    } else {
      store.dispatch(setSnackbar(__('Failed to delete review')));
    }
  });
};
