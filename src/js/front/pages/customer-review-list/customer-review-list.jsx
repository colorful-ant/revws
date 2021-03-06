// @flow
import React from 'react';
import type { ReviewListType, ReviewType } from 'common/types';
import type { SettingsType } from 'front/types';
import { slice } from 'ramda';
import List from './list';
import Paging from 'common/components/review-list-paging/review-list-paging';

type Props = {
  productsToReview: Array<number>,
  customerId: number,
  reviewList: ReviewListType,
  settings: SettingsType,
  loading: boolean,
  loadPage: (number, number)=>void,
  onEdit: (ReviewType)=>void,
  onCreate: (number)=>void,
  onDelete: (ReviewType)=>void,
};

class FrontAppCustomerReviewList extends React.PureComponent<Props> {
  static displayName = 'FrontAppCustomerReviewList';

  render() {
    return (
      <div>
        { this.renderRequests() }
        <h1 className="page-heading">{__('Your reviews')}</h1>
        { this.renderList() }
      </div>
    );
  }

  renderList = () => {
    const { settings, reviewList, loading, onEdit, onDelete } = this.props;
    const isEmpty = reviewList.total === 0;
    return isEmpty ? this.renderEmptyState() : (
      <div>
        <List
          settings={settings}
          reviewList={reviewList}
          loading={loading}
          onDelete={onDelete}
          onEdit={onEdit} />
        { this.renderPaging() }
      </div>
    );
  }

  renderPaging = () => {
    const { customerId, loading, loadPage } = this.props;
    const { page, pages } = this.props.reviewList;
    if (pages > 1) {
      return (
        <Paging
          key='paging'
          page={page}
          pages={pages}
          loading={loading}
          loadPage={page => loadPage(customerId, page)} />
      );
    }
    return null;
  }

  renderRequests = () => {
    const { productsToReview, settings } = this.props;
    if (productsToReview.length > 0) {
      const toReview = slice(0, settings.preferences.customerMaxRequests, productsToReview);
      return (
        <div>
          <h1 className="page-heading">{__('Could you review these products?')}</h1>
          <div className='revws-review-requests'>
            { toReview.map(this.renderRequest) }
          </div>
        </div>
      );
    }
    return null;
  }

  renderRequest = (productId: number) => {
    const { settings, onCreate } = this.props;
    const product = settings.products[productId];
    if (product) {
      return (
        <div key={productId} className='revws-review-request' onClick={e => onCreate(productId)}>
          <img src={product.image} />
          <h3 className='revws-review-request-name'>
            {product.name}
          </h3>
        </div>
      );
    }
  }

  renderEmptyState = () => {
    return (
      <div className="form-group">
        {__("You haven't written any review yet")}
      </div>
    );
  }
}

export default FrontAppCustomerReviewList;
