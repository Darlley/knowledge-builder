'use client';

import Blockquote from '@tiptap/extension-blockquote';
import BulletList from '@tiptap/extension-bullet-list';
import CodeBlock from '@tiptap/extension-code-block';
import Document from '@tiptap/extension-document';
import Heading from '@tiptap/extension-heading';
import ListItem from '@tiptap/extension-list-item';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import { generateHTML } from '@tiptap/html';
import { useMemo } from 'react';
import { RenderArticleProps } from './RenderArticle.types';

// Adicione mais extensões conforme necessário
import Code from '@tiptap/extension-code';
import Link from '@tiptap/extension-link';
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';

export default function RenderArticle({ json }: RenderArticleProps) {
  console.log('props json', json);

  const outPut = useMemo(() => {
    let parsedJson;

    if (typeof json === 'string') {
      try {
        parsedJson = JSON.parse(json);
      } catch (error) {
        console.error('Erro ao analisar JSON:', error);
        return '';
      }
    } else {
      parsedJson = json;
    }

    if (!parsedJson || typeof parsedJson !== 'object' || !parsedJson.type) {
      console.error('JSON inválido:', parsedJson);
      return '';
    }

    try {
      return generateHTML(parsedJson, [
        Document,
        Paragraph,
        Text,
        Link,
        Underline,
        Heading,
        ListItem,
        BulletList,
        Code,
        Blockquote,
        TextStyle,
        CodeBlock,
      ]);
    } catch (error) {
      console.error('Erro ao gerar HTML:', error);
      return '';
    }
  }, [json]);

  if (!outPut) {
    return <p>Não foi possível renderizar o conteúdo.</p>;
  }

  return (
    <div
      className="tex-left prose m-auto w-full sm:prose-lg dark:prose-invert prose-li:marker:text-primary-500"
      dangerouslySetInnerHTML={{ __html: outPut }}
    />
  );
}
