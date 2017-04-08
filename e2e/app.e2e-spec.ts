import { Apwa1Page } from './app.po';

describe('apwa1 App', () => {
  let page: Apwa1Page;

  beforeEach(() => {
    page = new Apwa1Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
