module.exports.test = function(uiTestCtx) {
  describe('Module test: circulation:settings', function() {
    const { config, helpers: { login, logout } } = uiTestCtx;
    const nightmare = new Nightmare(config.nightmare);

    this.timeout(Number(config.test_timeout));

    describe('Login > Open Circulation settings > Logout', () => {
      before( done => {
        login(nightmare, config, done);
      })
      after( done => {
        logout(nightmare, config, done);
      })
      it('should open Circulation settings, Loan policies', done => {
        nightmare
        .wait(config.select.settings)
        .click(config.select.settings)
        .wait('a[href="/settings/circulation"]')
        .click('a[href="/settings/circulation"]')
        .wait('a[href="/settings/circulation/loan-policies"]')
        .click('a[href="/settings/circulation/loan-policies"]')
        .wait('#ModuleContainer > div > div > div a[href*=loan-policies]')
        .then(result => { done() })
        .catch(done);
      });
      it('should open loan policy', done => {
        nightmare
        .click('#ModuleContainer > div > div > div a[href*=loan-policies]')
        .wait('#clickable-edit-item')
        .then(done)
        .catch(done)
      });
    });
  });
};
