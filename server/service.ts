import { App } from "obsidian";

export type ClipperAttribute = Pick<Attribute, "_id" | "key" | 'valueSource'> & { value: unknown };

export enum ElementValueSourceType {
  /**
   * 文本
   */
  text = "text",
  /**
   * 数字
   */
  number = "number",
  /**
   * 图片
   */
  imageUrl = "img",
  /**
   * video
   */
  videoUrl = "v",
  link = "link",
  /**
   * html tag attr
   */
  attr = "attr",
  snapshot = "snapshot",
}
export enum DocType {
  Bookmark = 1,
  Site,
  AutomationLog,
}
const PRESET_DOC_PREFIX = '$'
export enum PresetAttributeID {
  LargestedImage = `${PRESET_DOC_PREFIX}largest_size_image`,
  Favicon = `${PRESET_DOC_PREFIX}favicon`,
  Title = `${PRESET_DOC_PREFIX}title`,
  H1 = `${PRESET_DOC_PREFIX}h1`,
  Tags = `${PRESET_DOC_PREFIX}tags`,
  Rate = `${PRESET_DOC_PREFIX}rate`,
  Description = `${PRESET_DOC_PREFIX}description`,
  comment = `${PRESET_DOC_PREFIX}comment`,
}
export type Attribute = {
  _id: string;
  key: string;
  /**
   * TODO 以后再加
   */
  // spit?: boolean;
  selector: string;
  valueSource: ElementValueSourceType;
  // attribute?: string;
  /**
   * 列表此字段是否可见
   */
  visible?: boolean;
  createdAt: string;
  updatedAt?: string;
  meta?: {
    attr?: string;
    // TODO 用户输入的属性字段。注意处理本来没有某个字段 后来用户已经定义+页面原生会出现此字段的情况
    // isInput?: boolean;
    // video?: {
    //   type: string;
    // };
  };
};
export type ClipperDoc = {
  _id: string;
  url: string;
  // site: string;
  type: DocType.Bookmark;
  /**
   * 浏览器传入
   */
  bookmarkId: string;
  siteId: string;
  // title: string;
  // tags: string[];
  // rate: number;
  // largestedImage: string;
  // h1: string;
  // favicon: string;
  // description: string;
  // note: {
  //   content: string;
  //   createdAt: string;
  //   updatedAt: string;
  // };
  createdAt: string;
  updatedAt: string;
  attributes?: ClipperAttribute[];
  clips?: (Pick<Attribute, "meta" | "selector" | "valueSource"> & {
    id: string;
    value: string;
  })[];
};

function getMdContent(clip: Pick<ClipperAttribute, 'valueSource' | 'value'>): string {
  switch (clip.valueSource) {
    case ElementValueSourceType.snapshot:
    case ElementValueSourceType.imageUrl:
      return `![](${clip.value})`
    case ElementValueSourceType.link:
      return `[${clip.value}](${clip.value})`
    case ElementValueSourceType.videoUrl:
      // TODO
      return ''
    default:
      return clip.value as string
  }
}

function generateMDContent(clipper: ClipperDoc) {
  const tagsStr = (clipper.attributes?.find(item => item._id === PresetAttributeID.Tags)?.value as string[]).map(item => `#${item}`).join(' ')
  const comment = clipper.attributes?.find(item => item._id === PresetAttributeID.comment)?.value as string
  const rate = clipper.attributes?.find(item => item._id === PresetAttributeID.Rate)?.value as number
  const userSttributes = clipper.attributes?.filter(item => !item._id.startsWith(PRESET_DOC_PREFIX)).map(item => `##### \`${item.key}\`\n${getMdContent(item)}`)?.join('\n') || ''

  const clips = ((clipper.clips ?? []).length > 0 ? clipper.clips?.map((item, index) => `##### \`clip_${index + 1}\`\n${getMdContent(item)}`).join('\n') : '') || ''
  return `${(tagsStr.length > 0 ? tagsStr +'\n' : '') + (comment?.length > 0 ? `## note \n > ${comment}` : '')}
## Url \n${clipper.url}
${rate > 0 ? `## Rate \n${rate}` : ''}
${(userSttributes?.length > 0 ? `## Attributes \n${userSttributes}` : '')}
${(clips?.length > 0 ? `## Clips \n${clips}` : '')}`
}

export class Service {
  constructor(private app: App) {}
  async upsert(clipper: ClipperDoc) {
    this.app.vault.getFolderByPath
    const folder = await this.app.vault.getFolderByPath('test')
    if (!folder) {
      await this.app.vault.createFolder('test')
    }
    const title = clipper.attributes?.find(item => item._id === PresetAttributeID.Title)?.value as string
    const filePath = `test/${title || `Untitled_${clipper._id}`}.md`
    const file = await this.app.vault.getFileByPath(filePath)
    if (file) {
      await this.app.vault.modify(file, generateMDContent(clipper))
    } else {
      await this.app.vault.create(`test/${title || `Untitled_${clipper._id}`}.md`, generateMDContent(clipper))
    }
  }
}