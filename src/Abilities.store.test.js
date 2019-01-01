import AbilitiesStore from '~/Abilities.store';
import { mapValues } from 'lodash';

describe('Abilities', () => {
	let items = {
		boots: false,
		book: false,
	};
	const applyItemLoadout = (overrides = {}, name = 'empty') => {
		let result = {};

		switch (name) {
			case 'empty':
			default:
				result = mapValues(items, () => false);
				break;
			case 'full':
				result = mapValues(items, () => true);
				break;
		}
		return Object.assign(result, overrides);
	};

	describe('Ability helpers', () => {
		let store;
		const mockHasItem = jest.fn().mockImplementation(name => items[name]);

		beforeEach(() => {
			jest.clearAllMocks();
			store = AbilitiesStore.create({
				id: '1',
				config: '2',
			});
			store.hasItem = mockHasItem;
			items = applyItemLoadout();
		});
		test('ability to dash.', () => {
			items.boots = false;
			expect(store.canDash).toBe(false);

			items.boots = true;
			expect(store.canDash).toBe(true);
		});
		test('has equipped sword tiers.', () => {
			store.getItemsByGroup = jest.fn().mockReturnValue([{ tier: 1, acquired: true }]);
			expect(store.hasSwordTier).toEqual(1);

			store.getItemsByGroup = jest.fn().mockReturnValue([
				{ tier: 1, acquired: false },
				{ tier: 2, acquired: false },
				{ tier: 3, acquired: true },
				{ tier: 4, acquired: false },
			]);
			expect(store.hasSwordTier).toEqual(3);
			store.getItemsByGroup = jest.fn().mockReturnValue([{ tier: 1, acquired: false }]);
			expect(store.hasSwordTier).toEqual(0);
		});
		test('ability to read.', () => {
			items.book = false;
			expect(store.canRead).toBe(false);
			items.book = true;
			expect(store.canRead).toBe(true);
		});
		test('ability to activate tablets.', () => {
			const canRead = jest.spyOn(store, 'canRead', 'get').mockReturnValue(true);
			const hasSwordTier = jest.spyOn(store, 'hasSwordTier', 'get').mockReturnValue(2);

			expect(store.canActivateTablets).toBe(true);

			canRead.mockReturnValue(false);
			expect(store.canActivateTablets).toBe(false);

			canRead.mockReturnValue(true);
			hasSwordTier.mockReturnValue(0);
			expect(store.canActivateTablets).toBe(false);

			canRead.mockReturnValue(false);
			hasSwordTier.mockReturnValue(3);
			expect(store.canActivateTablets).toBe(false);
		});
	});
});
