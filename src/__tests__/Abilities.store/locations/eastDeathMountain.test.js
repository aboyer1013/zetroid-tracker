// The tagged template literal throws eslint indents off bad. Best to just disable it.
/* eslint indent: 'off' */
import AbilitiesStore from '~/Abilities.store';
import { itemList, applyItemLoadout } from '~/utilities/testHelpers';

describe('Ability to enter East Death Mountain:', () => {
	const items = applyItemLoadout(itemList);
	const mockHasItem = jest.fn().mockImplementation(name => items[name]);
	const store = AbilitiesStore.create({
		id: '1',
		config: '2',
	});

	store.hasItem = mockHasItem;
	test.each`
canEnterWestDeathMountain | canGrapple | mirror | hammer | expected
${true} | ${true} | ${true} | ${true} | ${true}
${true} | ${true} | ${true} | ${false} | ${true}
${true} | ${true} | ${false} | ${true} | ${true}
${true} | ${true} | ${false} | ${false} | ${true}
${true} | ${false} | ${true} | ${true} | ${true}
${true} | ${false} | ${true} | ${false} | ${true}
${true} | ${false} | ${false} | ${true} | ${true}
${true} | ${false} | ${false} | ${false} | ${true}
${false} | ${true} | ${true} | ${true} | ${false}
${false} | ${true} | ${true} | ${false} | ${false}
${false} | ${true} | ${false} | ${true} | ${false}
${false} | ${true} | ${false} | ${false} | ${false}
${false} | ${false} | ${true} | ${true} | ${false}
${false} | ${false} | ${true} | ${false} | ${false}
${false} | ${false} | ${false} | ${true} | ${false}
${false} | ${false} | ${false} | ${false} | ${false}
	`('returns $expected when canEnterWestDeathMountain=$canEnterWestDeathMountain | canGrapple=$canGrapple | mirror=$mirror | hammer=$hammer', ({
		canEnterWestDeathMountain,
		canGrapple,
		mirror,
		hammer,
		expected,
      }) => {
		store.canEnterWestDeathMountain = jest.fn().mockReturnValue(canEnterWestDeathMountain);
		jest.spyOn(store, 'canGrapple', 'get').mockReturnValue(canGrapple);
		items.mirror = mirror;
		items.hammer = hammer;

		expect(store.canEnterWestDeathMountain()).toBe(expected);
	});
});
