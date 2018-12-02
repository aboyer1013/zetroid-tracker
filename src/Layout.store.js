import { types, getRoot } from 'mobx-state-tree';
import { pick } from 'lodash';

const LayoutStore = types
	.model({
		id: types.identifier,
		splitterSize: 16,
		enableEdgeDock: true,
		tabEnableClose: true,
		tabEnableDrag: true,
		tabEnableRename: true,
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
		tabSetHeaderHeight: 20,
		tabSetTabStripHeight: 20,
		borderBarSize: 25,
		borderEnableDrop: true,
		borderClassName: types.maybeNull(types.string),
	})
	.volatile(self => ({
		layoutPresets: {
			zelda3: {
				current: {},
				STANDARD: {
					'global': {},
					'layout': {
						'type': 'row',
						'id': '#4',
						'children': [
							{
								'type': 'row',
								'id': '#11',
								'weight': 25,
								'children': [
									{
										'type': 'row',
										'id': '#23',
										'weight': 25,
										'children': [
											{
												'type': 'tabset',
												'id': '#22',
												'weight': 50,
												'children': [
													{
														'type': 'tab',
														'id': '#24',
														'name': 'Light World',
														'component': 'Map',
														'config': {
															mapName: 'zelda3-lw',
														},
														'enableClose': true
													}
												],
												'active': true
											},
											{
												'type': 'tabset',
												'id': '#10',
												'weight': 50,
												'children': [
													{
														'type': 'tab',
														'id': '#6',
														'name': 'Dark World',
														'component': 'Map',
														'mapName': 'zelda3-dw',
														'config': {
															'id': '1'
														}
													}
												]
											}
										]
									},
									{
										'type': 'tabset',
										'id': '#70',
										'weight': 5,
										'children': [
											{
												'type': 'tab',
												'id': '#1',
												'name': 'Location Details',
												'component': 'LocationDetail',
												'config': {
													'id': '1'
												},
												'enableClose': false
											}
										]
									}
								]
							}
						]
					},
					'borders': [
						{
							'type': 'border',
							'size': 257,
							'location': 'left',
							'children': [
								{
									'type': 'tab',
									'id': '#3',
									'name': 'Item List',
									'component': 'ItemList',
									'config': {

									},
									'enableClose': false
								},
								{
									'type': 'tab',
									'id': '#2',
									'name': 'Boss List',
									'component': 'ItemList',
									'config': {
										listType: 'boss'
									},
									'enableClose': true
								}
							]
						},
						{
							'type': 'border',
							'location': 'right',
							'children': []
						},
						{
							'type': 'border',
							'location': 'bottom',
							'children': []
						}
					]
				}
			}
		}
	}))
	.views(self => ({
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
			if (!result) {
				result = self.layoutPresets[root.selectedGame.name].STANDARD;
			}
			result = self.normalize(result);
			return result;
		}
	}))
	.actions(self => {
		const saveToLocalStorage = data => {
			getRoot(self).updateGameLayoutStorage(data);
		};
		const normalize = json => {
			const globalConfig = Object.assign({}, json.global, self.globalConfig);

			json.global = globalConfig;
			return json;
		};

		return {
			saveToLocalStorage,
			normalize,
		};
	})
;

export default LayoutStore;
