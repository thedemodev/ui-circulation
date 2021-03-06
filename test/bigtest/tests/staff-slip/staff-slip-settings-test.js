import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../helpers/setup-application';
import StaffSlipSettings from '../../interactors/staff-slip/staff-slip-settings';

describe('StaffSlipSettings', () => {
  setupApplication();

  beforeEach(function () {
    this.server.createList('staffSlip', 3);
  });

  describe('viewing staff slip list', () => {
    beforeEach(function () {
      this.visit('/settings/circulation/staffslips');
    });

    it('has a staff slip list', () => {
      expect(StaffSlipSettings.hasList).to.be.true;
    });

    it('has 3 items', () => {
      expect(StaffSlipSettings.staffSlipCount).to.equal(3);
    });
  });
});
