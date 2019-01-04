// The tagged template literal throws eslint indents off bad. Best to just disable it.
/* eslint indent: 'off' */
import AbilitiesStore from '~/Abilities.store';
import { itemList, applyItemLoadout } from '~/utilities/testHelpers';

describe('Ability to enter East Dark World Death Mountain:', () => {
	const items = applyItemLoadout(itemList);
	const mockHasItem = jest.fn().mockImplementation(name => items[name]);
	const store = AbilitiesStore.create({
		id: '1',
		config: '2',
	});

	store.hasItem = mockHasItem;
	test.each`
canLiftDarkRocks | canEnterEastDeathMountain | expected
${true} | ${true} | ${true}
${true} | ${false} | ${false}
${false} | ${true} | ${false}
${false} | ${false} | ${false}
	`('returns $expected when canLiftDarkRocks=$canLiftDarkRocks | canEnterEastDeathMountain=$canEnterEastDeathMountain', ({
		canLiftDarkRocks,
		canEnterEastDeathMountain,
		expected,
      }) => {
		jest.spyOn(store, 'canLiftDarkRocks', 'get').mockReturnValue(canLiftDarkRocks);
		store.canEnterEastDeathMountain = jest.fn().mockReturnValue(canEnterEastDeathMountain);

		expect(store.canEnterEastDarkWorldDeathMountain()).toBe(expected);
	});
});
