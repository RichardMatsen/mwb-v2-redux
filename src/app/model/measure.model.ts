export interface IMeasure {
  id: string;
  title: string;
  metric?: number | string;
  color?: string;
  icon?: string;
  link?: string;
  history?: number[];
  narrative?: string;
}

export interface IMeasureUpdate {
  id: string;
  metric: number | string;
  color: string;
  history?: number[];
}
