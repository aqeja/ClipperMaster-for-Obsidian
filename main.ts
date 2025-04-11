import { texts, upsertFile, Welcome } from "common";
import { App, Plugin, PluginSettingTab, Setting, addIcon } from "obsidian";
import { server } from "server";

interface ClipperMasterPluginSettings {
	port: number;
}

const DEFAULT_SETTINGS: ClipperMasterPluginSettings = {
	port: 8282,
};

export default class ClipperMasterPlugin extends Plugin {
	settings: ClipperMasterPluginSettings;

	async onload() {
		addIcon(
			"clippermaster",
			`
			<rect x="4" y="5" width="3" height="16" rx="1.5" transform="rotate(-10 4 5)"/>
			<rect x="11" y="8" width="3" height="11" rx="1.5" transform="rotate(-90 11 8)"/>
			<rect x="11" y="21" width="3" height="11" rx="1.5" transform="rotate(-90 11 21)"/>
			<rect x="11" y="9" width="11" height="6" rx="2" stroke-opacity="0.6"/>
		`
		);
		await this.loadSettings();

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new ClipperMasterSettingTab(this.app, this));

		server.start(this.app);
	}
	onUserEnable() {
		upsertFile(this.app, texts.welcome, Welcome);
	}
	onunload() {
		server.close();
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class ClipperMasterSettingTab extends PluginSettingTab {
	plugin: ClipperMasterPlugin;

	constructor(app: App, plugin: ClipperMasterPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}
	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		// Port setting
		const portSetting = new Setting(containerEl)
			.setName(texts.listeningPort)
			.setDesc(texts.desc);

		const invalidPortElement = portSetting.infoEl.createDiv();
		invalidPortElement.hide();
		invalidPortElement
			.createSpan("settings-error-element")
			.setText(texts.error);

		portSetting.addText((text) => {
			text.setPlaceholder(texts.enterPort);
			text.setValue(String(this.plugin.settings.port));
			text.onChange(async (value) => {
				const numValue = Number(value);
				if (isNaN(numValue) || numValue < 1 || numValue > 65535) {
					invalidPortElement.show();
					return;
				}
				invalidPortElement.hide();
				this.plugin.settings.port = numValue;
				await this.saveAndReload();
			});
		});

		// Guidance button setting
		new Setting(containerEl)
			.setName(texts.guidanceButton)
			.setDesc(texts.guidanceDesc)
			.addButton((btn) => {
				btn.setButtonText(texts.openGuidance)
					.onClick(() => {
						window.open("https://docs.clippermaster.com/docs/integrations/obsidian", "_blank");
					});
			});
	}
	async saveAndReload() {
		await this.plugin.saveSettings();
		await server.close();
		server.start(this.plugin.app);
	}
}
