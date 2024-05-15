export type ManualInputType = {
  name: string;
  key: string;
  value?: string | null;
  validate?: (val: string) => Promise<boolean | string> | boolean | string;
};
