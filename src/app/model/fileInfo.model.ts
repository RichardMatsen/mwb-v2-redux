
export interface IFileInfo {
  name: string;
  namePrefix?: string;
  baseName?: string;
  sequenceNo?: number;
  displayName?: string;
  effectiveDate: Date;
  effectiveTime?: string;
  lastModified?: Date;
  lastRefresh?: String;
  content?: string;
  metric?: number | string;
  badgeColor?: string;
}
