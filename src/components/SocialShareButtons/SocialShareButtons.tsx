"use client"

import React from 'react';
import { FacebookIcon, LinkedinIcon, WhatsappIcon } from 'react-share';
import { FacebookShareButton, LinkedinShareButton, WhatsappShareButton } from 'react-share';

interface SocialShareButtonsProps {
  url: string;
  title: string;
  description: string;
}

const SocialShareButtons: React.FC<SocialShareButtonsProps> = ({ url, title, description }) => {
  return (
    <div className="flex space-x-2">
      <FacebookShareButton url={url} hashtag={title}>
        <FacebookIcon size={24} round />
      </FacebookShareButton>

      <WhatsappShareButton url={url} title={title}>
        <WhatsappIcon size={24} round />
      </WhatsappShareButton>

      <LinkedinShareButton url={url} title={title} summary={description}>
        <LinkedinIcon size={24} round />
      </LinkedinShareButton>
    </div>
  );
};

export default SocialShareButtons;