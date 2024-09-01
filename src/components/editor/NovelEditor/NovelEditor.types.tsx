import { JSONContent } from 'novel';

export interface NovelEditorProps {
  initialValue?: JSONContent;
  onChange: (value: JSONContent) => void;
}
