import { types, getRoot } from 'mobx-state-tree';
import { pick, isEmpty } from 'lodash';

const LayoutStore = types
	.model({
		id: types.identifier,
		enableEdgeDock: true,
		tabEnableClose: true,
		tabEnableDrag: true,
		tabEnableRename: false,
		tabClassName: types.maybeNull(types.string),
		tabIcon: types.maybeNull(types.string),
		tabEnableRenderOnDemand: true,
		tabDragSpeed: 0.3,
		tabSetEnableDeleteWhenEmpty: true,
		tabSetEnableDrop: true,
		tabSetEnableDrag: true,
		tabSetEnableDivide: true,
		tabSetEnableMaximize: true,
		tabSetClassNameTabStrip: types.maybeNull(types.string),
		tabSetClassNameHeader: types.maybeNull(types.string),
		tabSetEnableTabStrip: true,
		tabSetHeaderHeight: 30,
		tabSetTabStripHeight: 35,
		borderBarSize: 40,
		borderEnableDrop: true,
		borderClassName: types.maybeNull(types.string),
		showBorderTop: true,
		showBorderRight: true,
		showBorderBottom: true,
		showBorderLeft: true,
	})
	.volatile(() => ({
		// layoutModel: null,
		// Actions: null,
		layoutPresets: {
			zelda3: {
				current: {},
				STANDARD: {
					global: {},
					layout: {
						type: 'row',
						id: '#4',
						children: [
							{
								type: 'row',
								id: '#11',
								weight: 25,
								children: [
									{
										type: 'row',
										id: '#23',
										weight: 25,
										children: [
											{
												type: 'tabset',
												id: '#22',
												weight: 50,
												children: [
													{
														type: 'tab',
														id: '#24',
														name: 'Light World',
														component: 'Map',
														config: {
															mapName: 'zelda3-lw',
														},
														enableClose: false,
													},
												],
												active: true,
											},
											{
												type: 'tabset',
												id: '#10',
												weight: 50,
												children: [
													{
														type: 'tab',
														id: '#6',
														name: 'Dark World',
														component: 'Map',
														mapName: 'zelda3-dw',
														config: {
															mapName: 'zelda3-dw',
														},
														enableClose: false,
													},
												],
											},
										],
									},
									{
										type: 'tabset',
										id: '#70',
										weight: 5,
										children: [
											{
												type: 'tab',
												id: '#1',
												name: 'Details',
												component: 'LocationDetail',
												config: {
													id: '1',
												},
												enableClose: false,
											},
										],
									},
								],
							},
						],
					},
					borders: [
						{
							type: 'border',
							size: 257,
							location: 'left',
							children: [
								{
									type: 'tab',
									id: '#3',
									name: 'Items',
									component: 'ItemList',
									config: {

									},
									enableClose: false,
								},
								{
									type: 'tab',
									id: '#2',
									name: 'Dungeons',
									component: 'ItemList',
									config: {
										listType: 'dungeon',
									},
									enableClose: false,
								},
							],
						},
						{
							type: 'border',
							location: 'right',
							show: true,
							children: [],
						},
						{
							type: 'border',
							location: 'bottom',
							children: [],
						},
						{
							type: 'border',
							location: 'top',
							show: false,
							children: [],
						},
					],
				},
			},
		},
	}))
	.views(self => ({
		get splitterSize() {
			return getRoot(self).configStore.splitterSize || 10;
		},
		get globalConfig() {
			const attrs = [
				'splitterSize',
				'enableEdgeDock',
				'tabEnableClose',
				'tabEnableDrag',
				'tabEnableRename',
				'tabClassName',
				'tabIcon',
				'tabEnableRenderOnDemand',
				'tabDragSpeed',
				'tabSetEnableDeleteWhenEmpty',
				'tabSetEnableDrop',
				'tabSetEnableDrag',
				'tabSetEnableDivide',
				'tabSetEnableMaximize',
				'tabSetClassNameTabStrip',
				'tabSetClassNameHeader',
				'tabSetEnableTabStrip',
				'tabSetHeaderHeight',
				'tabSetTabStripHeight',
				'borderBarSize',
				'borderEnableDrop',
				'borderClassName',
			];

			return pick(self, attrs);
		},
		get json() {
			let result;
			const root = getRoot(self);

			result = root.getGameStorage('layout');
			if (isEmpty(result)) {
				result = self.layoutPresets[root.selectedGame.name].STANDARD;
			}
			result = self.normalize(result);
			return result;
		},
	}))
	.actions((self) => {
		const saveToLocalStorage = (data) => {
			getRoot(self).updateGameLayoutStorage(data);
		};
		const normalize = (json) => {
			const globalConfig = Object.assign({}, json.global, self.globalConfig);

			json.global = globalConfig;
			return json;
		};
		const toggleBorder = (borderName) => {
			self[`showBorder${borderName}`] = !self[`showBorder${borderName}`];
		};

		return {
			saveToLocalStorage,
			normalize,
			toggleBorder,
		};
	});
export default LayoutStore;
