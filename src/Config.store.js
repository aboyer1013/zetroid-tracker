import { types } from 'mobx-state-tree';

// TODO Config for Zelda3 for now. Break this out into its own respective game configs when adding Metroid.
const ConfigStore = types
	.model({
		id: types.identifier,
		// TODO AFAIK, "regions" is still in beta. Including it here for reference but probably will scrap it.
		mode: types.optional(types.enumeration('aka zeldaMode', ['oldstyle', 'regions']), 'oldstyle'),
		MAP_LOGIC: types.optional(types.enumeration('Map logic', ['glitchless', 'minorGlitches', 'majorGlitches', 'owGlitches']), 'glitchless'),
		// Standard is vanilla intro: Stormy beginning with access to only sewer passage to meet Uncle.
		// Open is equivalent to vanilla intro only you start the game like you just exited the church.
		gameState: types.optional(types.enumeration('Game state', ['standard', 'open']), 'standard'),
		splitterSize: types.optional(types.refinement(types.number, val => {
			return val >= 10 && val <= 20;
		}), 10),
		quickMarkMode: false,
	})
	.views(self => ({
		get mapOhko() {
			return self.mode === 'regions';
		},
		get mapSwords() {
			return self.mode === 'regions';
		},
		get minorGlitches() {
			return self.mode === 'regions';
		}
	}))
	.actions((self) => {
		const setSelected = (state) => {
			self.selected = state;
		};
		const setSplitterSize = (newSize) => {
			self.splitterSize = newSize;
		};
		const setQuickMarkMode = (newValue) => {
			self.quickMarkMode = newValue;
		};

		return {
			setSelected,
			setSplitterSize,
			setQuickMarkMode,
		};
	})
;

export default ConfigStore;
