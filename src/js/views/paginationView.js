import View from './view';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');

      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }

  _generateMarkup() {
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // Page 1, there are other pages
    if (this._data.page === 1 && numPages > 1) {
      return this._generateNext(this._data.page);
    }
    // Page 1, there are no other pages
    if (this._data.page === 1 && numPages === 1) {
      return '';
    }
    // Last Page
    if (this._data.page === numPages && numPages > 1) {
      return this._generatePrev(this._data.page);
    }
    // Some other page
    if (this._data.page < numPages && this._data.page > 1) {
      return `
        ${this._generatePrev(this._data.page)}  ${this._generateNext(
        this._data.page
      )}
      `;
    }
  }

  _generatePrev(currentPage) {
    return `
        <button data-goto="${
          currentPage - 1
        }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currentPage - 1}</span>
        </button>
    `;
  }

  _generateNext(currentPage) {
    return `
        <button data-goto="${
          currentPage + 1
        }" class="btn--inline pagination__btn--next">
            <span>Page ${currentPage + 1}</span>
            <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>
    `;
  }
}

export default new PaginationView();
