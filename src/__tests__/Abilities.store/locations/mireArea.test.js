// The tagged template literal throws eslint indents off bad. Best to just disable it.
/* eslint indent: 'off' */
import AbilitiesStore from '~/Abilities.store';
import { itemList, applyItemLoadout } from '~/utilities/testHelpers';

describe('Ability to enter Mire area:', () => {
	const items = applyItemLoadout(itemList);
	const mockHasItem = jest.fn().mockImplementation(name => items[name]);
	const store = AbilitiesStore.create({
		id: '1',
		config: '2',
	});

	store.hasItem = mockHasItem;
	test.each`
		canAccessMiseryMirePortal | canFly | canLiftDarkRocks | expected
		${true} | ${true} | ${true} | ${true}
		${true} | ${true} | ${false} | ${true}
		${true} | ${false} | ${true} | ${true}
		${true} | ${false} | ${false} | ${true}
		${false} | ${true} | ${true} | ${true}
		${false} | ${true} | ${false} | ${false}
		${false} | ${false} | ${true} | ${false}
		${false} | ${false} | ${false} | ${false}
	`('returns $expected when canAccessMiseryMirePortal is $canAccessMiseryMirePortal and canFly is $canFly and canLiftDarkRocks is $canLiftDarkRocks.', ({
		canAccessMiseryMirePortal,
		canFly,
		canLiftDarkRocks,
		expected,
      }) => {
		store.canAccessMiseryMirePortal = jest.fn().mockReturnValue(canAccessMiseryMirePortal);
		jest.spyOn(store, 'canFly', 'get').mockReturnValue(canFly);
		jest.spyOn(store, 'canLiftDarkRocks', 'get').mockReturnValue(canLiftDarkRocks);

		expect(store.canEnterMireArea()).toBe(expected);
	});
});
