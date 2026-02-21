import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useI18n } from '../hooks/useI18n';

function ShareButtons({ scoreData, onClose }) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  const shareText = t('share.text', { score: scoreData.score, level: scoreData.level, lines: scoreData.lines });

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {

    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: t('share.title'),
          text: shareText
        });
      } catch (error) {
        if (error.name !== 'AbortError') {

        }
      }
    }
  };

  const handleTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const handleWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black/40 rounded-lg p-4 mt-4"
    >
      <div className="text-white/80 text-sm mb-3 text-center">
        {t('share.prompt')}
      </div>

      <div className="flex flex-wrap gap-2 justify-center">

        {navigator.share && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNativeShare}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors"
          >
            {t('share.share')}
          </motion.button>
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCopy}
          className={`${
            copied ? 'bg-green-600' : 'bg-gray-600 hover:bg-gray-500'
          } text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors`}
        >
          {copied ? t('share.copied') : t('share.copy')}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleTwitter}
          className="bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors"
        >
          {t('share.twitter')}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleWhatsApp}
          className="bg-[#25D366] hover:bg-[#20bd5a] text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors"
        >
          {t('share.whatsapp')}
        </motion.button>
      </div>

      {onClose && (
        <div className="text-center mt-3">
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white text-sm transition-colors"
          >
            {t('share.close')}
          </button>
        </div>
      )}
    </motion.div>
  );
}

export default ShareButtons;

