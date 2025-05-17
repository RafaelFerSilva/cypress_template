import HomePage from '../support/pages/HomePage'

describe('Home Page Test Suite', () => {
  let homePage

  before(() => {
    homePage = new HomePage()
  })

  it('Home page test', () => {
    homePage.visitHomePage()
    homePage.validateHomePageLoaded()
  })
})