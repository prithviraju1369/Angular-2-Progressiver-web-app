import { ShoppinglistPage } from './app.po';

describe('shoppinglist App', function() {
  let page: ShoppinglistPage;

  beforeEach(() => {
    page = new ShoppinglistPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
